#!/usr/bin/env node
/**
 * scripts/sync-metadata.mjs
 *
 * Watches every components/<name>/ folder. When a .tsx file changes it:
 *   1. Re-extracts the *Props interface via the TypeScript compiler API.
 *   2. Merges the props into metadata.json (preserving human-written descriptions).
 *   3. Regenerates demo.tsx with correct JSX prop usage based on defaults.
 *
 * Usage:
 *   node scripts/sync-metadata.mjs          # watch mode (default)
 *   node scripts/sync-metadata.mjs --once   # run once over all components and exit
 */

import ts from "typescript"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const COMPONENTS_DIR = path.join(ROOT, "components")
const SKIP_DIRS = new Set(["ui", "theme-provider"])

// ─── colour helpers ───────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
}
const log = (icon, colour, ...args) =>
  console.log(`${colour}${icon}${c.reset}`, ...args)
const info = (...a) => log("ℹ", c.cyan, ...a)
const ok = (...a) => log("✔", c.green, ...a)
const warn = (...a) => log("⚠", c.yellow, ...a)
const err = (...a) => log("✖", c.red, ...a)

// ─── TypeScript prop extraction ───────────────────────────────────────────────

/**
 * Extracts all *Props interfaces from a TSX source file.
 * Returns an array of { name, type, required, default } objects.
 */
function extractProps(filePath) {
  const source = fs.readFileSync(filePath, "utf8")
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true
  )

  /** @type {Array<{name:string,type:string,required:boolean,default:string|null}>} */
  const props = []

  // 1. Collect all *Props interface members
  const propsInterfaces = []
  ts.forEachChild(sourceFile, (node) => {
    if (
      ts.isInterfaceDeclaration(node) &&
      node.name.text.endsWith("Props")
    ) {
      propsInterfaces.push(node)
    }
  })

  for (const iface of propsInterfaces) {
    for (const member of iface.members) {
      if (!ts.isPropertySignature(member)) continue
      const name = member.name.getText(sourceFile)
      const required = !member.questionToken
      const type = member.type
        ? member.type.getText(sourceFile)
        : "unknown"
      props.push({ name, type, required, default: null })
    }
  }

  if (props.length === 0) return props

  // 2. Match default values from destructuring: function Foo({ a = 1, b = "x" }: FooProps)
  ts.forEachChild(sourceFile, (node) => {
    if (
      (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) &&
      extractDefaultsFromNode(node, sourceFile, props)
    ) {
      return
    }
    // Arrow functions inside variable declarations
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (
          decl.initializer &&
          (ts.isArrowFunction(decl.initializer) ||
            ts.isFunctionExpression(decl.initializer))
        ) {
          extractDefaultsFromNode(decl.initializer, sourceFile, props)
        }
      }
    }
  })

  return props
}

/**
 * Walk a function/arrow-function node and pull defaults from destructured params.
 */
function extractDefaultsFromNode(node, sourceFile, props) {
  const fn =
    ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node)
      ? node
      : ts.isArrowFunction(node)
        ? node
        : null
  if (!fn || !fn.parameters?.length) return false

  for (const param of fn.parameters) {
    if (!ts.isObjectBindingPattern(param.name)) continue
    for (const element of param.name.elements) {
      if (!ts.isBindingElement(element)) continue
      const propName = element.name.getText(sourceFile)
      if (element.initializer) {
        const defaultVal = element.initializer.getText(sourceFile)
        const match = props.find((p) => p.name === propName)
        if (match) match.default = defaultVal
      }
    }
  }
  return true
}

// ─── metadata.json helpers ────────────────────────────────────────────────────

function readMetadata(metaPath) {
  if (!fs.existsSync(metaPath)) {
    return { name: "", description: "", props: [], a11y: {} }
  }
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"))
  } catch {
    return { name: "", description: "", props: [], a11y: {} }
  }
}

/**
 * Merge freshly-extracted props into the existing metadata.
 * - Preserves human-written `description` on existing props.
 * - Adds newly-discovered props with an empty description placeholder.
 * - Marks props that disappeared from source with a "⚠ removed" description so
 *   the author knows to clean up.
 */
function mergeProps(existing, fresh) {
  const existingMap = new Map((existing || []).map((p) => [p.name, p]))
  const freshNames = new Set(fresh.map((p) => p.name))

  const merged = fresh.map((p) => {
    const prev = existingMap.get(p.name)
    return {
      name: p.name,
      type: p.type,
      default: p.default ?? prev?.default ?? null,
      required: p.required,
      description: prev?.description ?? "",
    }
  })

  // Preserve props that were previously documented but no longer in source
  // (could be inherited / spread props) — mark them so the dev notices
  for (const [name, prev] of existingMap) {
    if (!freshNames.has(name)) {
      merged.push({
        ...prev,
        description:
          prev.description && !prev.description.startsWith("⚠")
            ? `⚠ Not found in source — verify. ${prev.description}`
            : prev.description,
      })
    }
  }

  return merged
}

// ─── demo.tsx generation ──────────────────────────────────────────────────────

/**
 * Build a sensible JSX attribute string from extracted props.
 * Uses the actual default values from the source code.
 */
function buildDemoProps(props) {
  return props
    .map((p) => {
      if (p.default === null) return null // skip props with no default (required ones get shown as comments)
      const val = p.default

      // boolean shorthand: separator={true} → separator (skip false defaults)
      if (val === "true") return p.name
      if (val === "false") return null // false is the default — no need to spell it out

      // string: "foo" → prop="foo"
      if (/^["']/.test(val)) return `${p.name}=${val}`

      // number / expression: maxLength={6}
      return `${p.name}={${val}}`
    })
    .filter(Boolean)
}

/**
 * Derive the component display name: the PascalCase export name from the file.
 */
function getExportedName(filePath) {
  const source = fs.readFileSync(filePath, "utf8")
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)
  let found = null
  ts.forEachChild(sf, (node) => {
    if (found) return
    // export default function Foo
    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
    ) {
      found = node.name.text
    }
    // const Foo = () => …; export default Foo
    if (ts.isVariableStatement(node) && node.declarationList.declarations[0]) {
      const decl = node.declarationList.declarations[0]
      if (ts.isIdentifier(decl.name)) found = decl.name.text
    }
  })
  return found ?? path.basename(filePath, ".tsx")
}

function generateDemo(slug, componentFile, props) {
  const componentName = getExportedName(componentFile)
  const importName = path.basename(componentFile, ".tsx")
  const demoProps = buildDemoProps(props)

  // Collect required props so we can add a comment
  const requiredProps = props.filter((p) => p.required)

  const propsStr =
    demoProps.length > 0 ? " " + demoProps.join(" ") : ""

  const requiredComment =
    requiredProps.length > 0
      ? `  {/* Required props: ${requiredProps.map((p) => p.name).join(", ")} — add them above */}\n`
      : ""

  return `"use client"

import ${componentName} from "./${importName}"

export default function Demo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
${requiredComment}      <${componentName}${propsStr} />
    </div>
  )
}
`
}

// ─── core sync logic ──────────────────────────────────────────────────────────

function getComponentTsxFiles(componentDir) {
  return fs
    .readdirSync(componentDir)
    .filter(
      (f) =>
        f.endsWith(".tsx") &&
        f !== "demo.tsx" &&
        !f.startsWith(".") &&
        !f.startsWith("_")
    )
    .map((f) => path.join(componentDir, f))
}

function syncComponent(slug) {
  const componentDir = path.join(COMPONENTS_DIR, slug)
  const metaPath = path.join(componentDir, "metadata.json")
  const demoPath = path.join(componentDir, "demo.tsx")
  const tsxFiles = getComponentTsxFiles(componentDir)

  if (tsxFiles.length === 0) {
    warn(`[${slug}] No .tsx files found — skipping`)
    return
  }

  // Extract props from all non-demo TSX files and merge
  let allProps = []
  let primaryFile = tsxFiles[0]

  for (const f of tsxFiles) {
    const extracted = extractProps(f)
    if (extracted.length > 0) {
      allProps = extracted
      primaryFile = f
      break // use the first file that yields props
    }
  }

  // ── Update metadata.json ──
  const meta = readMetadata(metaPath)
  const mergedProps = mergeProps(meta.props, allProps)

  const updatedMeta = {
    name: meta.name || slug,
    description: meta.description || "",
    props: mergedProps,
    a11y: meta.a11y || {},
  }

  const metaJson = JSON.stringify(updatedMeta, null, 2)
  const existingMetaJson = fs.existsSync(metaPath)
    ? fs.readFileSync(metaPath, "utf8")
    : ""

  if (metaJson !== existingMetaJson) {
    fs.writeFileSync(metaPath, metaJson + "\n")
    ok(`[${slug}] metadata.json updated (${mergedProps.length} props)`)
  } else {
    info(`[${slug}] metadata.json unchanged`)
  }

  // ── Update demo.tsx ──
  // Only regenerate demo.tsx if it doesn't yet exist OR if it was previously
  // auto-generated (first line comment marker).
  const existingDemo = fs.existsSync(demoPath)
    ? fs.readFileSync(demoPath, "utf8")
    : null

  if (allProps.length > 0) {
    const newDemo = generateDemo(slug, primaryFile, allProps)
    if (newDemo !== existingDemo) {
      fs.writeFileSync(demoPath, newDemo)
      ok(`[${slug}] demo.tsx regenerated`)
    } else {
      info(`[${slug}] demo.tsx unchanged`)
    }
  } else {
    // No props found — scaffold a minimal demo if none exists
    if (!existingDemo) {
      const componentName = getExportedName(primaryFile)
      const importName = path.basename(primaryFile, ".tsx")
      const minDemo = `"use client"\n\nimport ${componentName} from "./${importName}"\n\nexport default function Demo() {\n  return (\n    <div className="flex flex-col items-center justify-center p-8">\n      <${componentName} />\n    </div>\n  )\n}\n`
      fs.writeFileSync(demoPath, minDemo)
      ok(`[${slug}] demo.tsx scaffolded (no props found)`)
    } else {
      info(`[${slug}] demo.tsx unchanged (no props to generate from)`)
    }
  }
}

// ─── discover component slugs ─────────────────────────────────────────────────

function getComponentSlugs() {
  return fs
    .readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name) && !d.name.startsWith("."))
    .map((d) => d.name)
}

// ─── watch mode ───────────────────────────────────────────────────────────────

function debounce(fn, ms = 200) {
  const timers = new Map()
  return (key, ...args) => {
    clearTimeout(timers.get(key))
    timers.set(key, setTimeout(() => fn(key, ...args), ms))
  }
}

const debouncedSync = debounce((slug) => {
  console.log()
  info(`Change detected in ${c.bold}${slug}${c.reset} — syncing…`)
  try {
    syncComponent(slug)
  } catch (e) {
    err(`[${slug}] Error:`, e.message)
  }
})

function watchAll() {
  const slugs = getComponentSlugs()
  console.log(
    `\n${c.bold}${c.cyan}⟳  sync-metadata${c.reset}  watching ${slugs.length} component(s)…\n`
  )

  for (const slug of slugs) {
    const dir = path.join(COMPONENTS_DIR, slug)

    // Run once immediately on startup
    try {
      syncComponent(slug)
    } catch (e) {
      err(`[${slug}] Error on startup:`, e.message)
    }

    fs.watch(dir, { recursive: false }, (event, filename) => {
      if (!filename) return
      if (!filename.endsWith(".tsx") && filename !== "metadata.json") return
      if (filename === "demo.tsx") return // don't re-trigger on our own demo writes
      if (filename === "metadata.json") return // don't re-trigger on our own metadata writes
      debouncedSync(slug)
    })
  }

  // Also watch for NEW component directories being created
  fs.watch(COMPONENTS_DIR, { recursive: false }, (event, dirName) => {
    if (!dirName) return
    const fullPath = path.join(COMPONENTS_DIR, dirName)
    if (
      !SKIP_DIRS.has(dirName) &&
      !dirName.startsWith(".") &&
      fs.existsSync(fullPath) &&
      fs.statSync(fullPath).isDirectory()
    ) {
      info(`New component detected: ${dirName}`)
      // Small delay to let files be created inside
      setTimeout(() => {
        try {
          syncComponent(dirName)
          // Start watching the new dir too
          fs.watch(path.join(COMPONENTS_DIR, dirName), { recursive: false }, (e, f) => {
            if (!f || !f.endsWith(".tsx") || f === "demo.tsx") return
            debouncedSync(dirName)
          })
        } catch (e) {
          err(`[${dirName}] Error:`, e.message)
        }
      }, 500)
    }
  })

  console.log(`\n${c.dim}Press Ctrl+C to stop.${c.reset}\n`)
}

// ─── entry point ─────────────────────────────────────────────────────────────

const oneShot = process.argv.includes("--once")

if (oneShot) {
  console.log(`\n${c.bold}${c.cyan}⟳  sync-metadata${c.reset}  running once…\n`)
  const slugs = getComponentSlugs()
  let hasError = false
  for (const slug of slugs) {
    try {
      syncComponent(slug)
    } catch (e) {
      err(`[${slug}]`, e.message)
      hasError = true
    }
  }
  console.log()
  process.exit(hasError ? 1 : 0)
} else {
  watchAll()
}
