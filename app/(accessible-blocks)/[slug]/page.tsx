import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { codeToHtml } from "shiki"
import DocsViewer from "@/components/docs-viewer"

interface KeyboardGuideline {
  key: string
  description: string
}

interface AriaGuideline {
  attribute: string
  description: string
}

interface ComponentMetadata {
  name: string
  description: string
  a11y: {
    keyboardNavigation?: KeyboardGuideline[]
    ariaAttributes?: AriaGuideline[]
  }
}

export async function generateStaticParams() {
  const componentsDir = path.join(process.cwd(), "components")
  
  if (!fs.existsSync(componentsDir)) {
    return []
  }

  const dirs = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        !["ui", "theme-provider"].includes(d.name) &&
        !d.name.startsWith(".")
    )

  return dirs.map((d) => ({
    slug: d.name,
  }))
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const componentDir = path.join(process.cwd(), "components", slug)

  if (!fs.existsSync(componentDir)) {
    notFound()
  }

  // 1. Read metadata.json
  const metaPath = path.join(componentDir, "metadata.json")
  let metadata: ComponentMetadata = {
    name: slug.toUpperCase(),
    description: "Accessible component implementation.",
    a11y: {},
  }

  if (fs.existsSync(metaPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"))
    } catch (err) {
      console.error(`Failed to parse metadata.json for ${slug}`, err)
    }
  }

  // 2. Read component code files (excluding demo.tsx and metadata.json itself)
  const files = fs
    .readdirSync(componentDir)
    .filter((f) => f.endsWith(".tsx") && f !== "demo.tsx" && !f.startsWith("."))

  const codeFiles = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(componentDir, filename)
      const content = fs.readFileSync(filePath, "utf8")
      let html = ""
      try {
        html = await codeToHtml(content, {
          lang: "tsx",
          theme: "github-dark",
        })
      } catch (err) {
        console.error(`Failed to highlight ${filename}`, err)
      }
      return {
        filename,
        content,
        html,
      }
    })
  )

  // Also include the demo file code if it exists and we want to view it
  const demoPath = path.join(componentDir, "demo.tsx")
  if (fs.existsSync(demoPath)) {
    const content = fs.readFileSync(demoPath, "utf8")
    let html = ""
    try {
      html = await codeToHtml(content, {
        lang: "tsx",
        theme: "github-dark",
      })
    } catch (err) {
      console.error(`Failed to highlight demo.tsx`, err)
    }
    codeFiles.push({
      filename: "demo.tsx",
      content,
      html,
    })
  }

  // 3. Dynamically import the Demo component
  const DemoComponent = dynamic(() => import(`@/components/${slug}/demo`), {
    loading: () => (
      <div className="flex h-[200px] w-full items-center justify-center rounded-xl border border-dashed bg-accent/10">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="font-mono text-xs text-muted-foreground">
            Loading preview...
          </span>
        </div>
      </div>
    ),
  })

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <DocsViewer
        name={metadata.name}
        description={metadata.description}
        demo={<DemoComponent />}
        codeFiles={codeFiles}
        a11y={metadata.a11y}
      />
    </div>
  )
}
