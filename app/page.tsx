import fs from "fs"
import Link from "next/link"
import path from "path"

interface ComponentMetadata {
  name: string
  description: string
}

export default function Page() {
  const componentsDir = path.join(process.cwd(), "components")
  let components: {
    slug: string
    path: string
    name: string
    description: string
  }[] = []

  if (fs.existsSync(componentsDir)) {
    const dirs = fs
      .readdirSync(componentsDir, { withFileTypes: true })
      .filter(
        (d) =>
          d.isDirectory() &&
          !["ui", "theme-provider"].includes(d.name) &&
          !d.name.startsWith(".")
      )

    components = dirs.map((d) => {
      const metaPath = path.join(componentsDir, d.name, "metadata.json")
      let metadata: ComponentMetadata = {
        name: d.name,
        description: "Accessible component workspace.",
      }

      if (fs.existsSync(metaPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"))
        } catch (err) {
          console.error(`Failed to parse metadata for index: ${d.name}`, err)
        }
      }

      return {
        slug: d.name,
        path: `/${d.name}`,
        name: metadata.name,
        description: metadata.description,
      }
    })
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col p-8 md:p-16">
      {/* Title & Description Section */}
      <div className="mb-12 flex max-w-2xl flex-col gap-3">
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
          Inclusive Blocks by Vaibhav Sompura
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Select a component below to inspect its interactive preview, copy code
          snippets, and review keyboard and screen reader specifications.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {components
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((component) => (
            <Link
              key={component.slug}
              href={component.path}
              className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md dark:bg-card/50 dark:hover:bg-card"
            >
              <div className="flex flex-col gap-2.5">
                <h2 className="flex items-center justify-between font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {component.name}
                  <svg
                    className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {component.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 font-mono text-[10px] text-muted-foreground select-none">
                <span>Route: {component.path}</span>
                <span className="font-sans text-[11px] font-medium text-primary group-hover:underline">
                  View Docs
                </span>
              </div>
            </Link>
          ))}
      </div>

      {/* Footer utility node */}
      <footer className="mt-16 flex items-center justify-between border-t pt-8 font-mono text-xs text-muted-foreground/80">
        <span>Components library sandbox</span>
        <div className="flex items-center gap-1.5">
          Press{" "}
          <kbd className="rounded-sm border bg-muted px-1.5 py-0.5 font-sans text-[11px] font-semibold text-foreground/90 shadow-2xs">
            d
          </kbd>{" "}
          to toggle dark mode
        </div>
      </footer>
    </div>
  )
}
