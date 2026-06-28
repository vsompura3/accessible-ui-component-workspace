import fs from "fs"
import Link from "next/link"
import path from "path"

interface ComponentMetadata {
  name: string
  description: string
}

export default function ComponentsPage() {
  const componentsDir = path.join(process.cwd(), "components")
  let components: {
    slug: string
    path: string
    name: string
    description: string
    comingSoon: boolean
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
        description: "Accessible component.",
      }

      if (fs.existsSync(metaPath)) {
        try {
          metadata = JSON.parse(fs.readFileSync(metaPath, "utf8"))
        } catch (err) {
          console.error(`Failed to parse metadata for index: ${d.name}`, err)
        }
      }

      let comingSoon = false
      const demoPath = path.join(componentsDir, d.name, "demo.tsx")
      if (fs.existsSync(demoPath)) {
        try {
          comingSoon = fs.readFileSync(demoPath, "utf8").includes("Coming Soon")
        } catch (err) {}
      }

      return {
        slug: d.name,
        path: `/components-list/${d.name}`,
        name: metadata.name,
        description: metadata.description,
        comingSoon,
      }
    })
  }

  return (
    <div className="relative min-h-svh bg-background text-foreground">
      {/* Ambient blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute top-1/2 -right-32 h-[320px] w-[320px] rounded-full bg-chart-2/8 blur-[100px]" />
      </div>

      {/* Sticky nav */}
      <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md md:px-10">
        <Link href="/" className="font-heading text-base font-bold tracking-tight">
          Inclusive<span className="text-primary">Blocks</span>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">Components</span>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-14">
        {/* Page header */}
        <div className="mb-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
            <span>Components</span>
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
            All Components
          </h1>
          <p className="text-muted-foreground">
            {components.length} component{components.length !== 1 ? "s" : ""} — each with a live preview, code viewer, and accessibility annotations.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {components
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((component) => {
              const CardWrapper = (component.comingSoon ? "div" : Link) as any
              return (
                <CardWrapper
                  key={component.slug}
                  href={component.comingSoon ? undefined : component.path}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-xs backdrop-blur-xs transition-all duration-200 ${
                    component.comingSoon
                      ? "opacity-70 grayscale cursor-not-allowed"
                      : "hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card hover:shadow-md"
                  }`}
                >
                  {/* Hover gradient accent */}
                  {!component.comingSoon && (
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  )}

                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h2 className={`font-heading text-lg font-bold leading-snug text-foreground transition-colors ${!component.comingSoon ? "group-hover:text-primary" : ""}`}>
                          {component.name}
                        </h2>
                        {component.comingSoon && (
                          <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      {!component.comingSoon && (
                        <span className="mt-0.5 shrink-0 rounded-full border bg-muted p-1.5 text-muted-foreground transition-all group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                          <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {component.description || "In development..."}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
                    <code className="font-mono text-[10px] text-muted-foreground/70">
                      /components-list/{component.slug}
                    </code>
                    {!component.comingSoon && (
                      <span className="text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View Docs →
                      </span>
                    )}
                  </div>
                </CardWrapper>
              )
            })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-muted-foreground/70">
          <Link href="/" className="transition-colors hover:text-foreground">
            ← Back to home
          </Link>
          <span>© {new Date().getFullYear()} InclusiveBlocks</span>
        </div>
      </footer>
    </div>
  )
}
