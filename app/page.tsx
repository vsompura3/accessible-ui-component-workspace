import Link from "next/link"

const CREATOR = {
  name: "Vaibhav Sompura",
  website: "https://vaibhavsompura.netlify.app",
  github: "https://github.com/vsompura3",
  linkedin: "https://linkedin.com/in/vaibhav-sompura",
  email: "mailto:vsompura3@gmail.com",
  repo: "https://github.com/vsompura3/accessible-ui-component-workspace",
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="size-4.5">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="size-3.5">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// Feature list for the "Why" section
const FEATURES = [
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Live Sandboxes",
    description: "Every component ships with an interactive preview you can poke at directly in the browser.",
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Syntax-Highlighted Code",
    description: "Server-rendered, zero-bundle syntax highlighting via Shiki. Copy the exact source in one click.",
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" />
      </svg>
    ),
    title: "Accessibility Specs",
    description: "Every page documents keyboard shortcuts, ARIA roles, and screen-reader annotations in detail.",
  },
  {
    icon: (
      <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    title: "Zero-Config Discovery",
    description: "Drop a folder in /components with a metadata.json and it auto-registers. No config files to touch.",
  },
]

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden bg-background text-foreground">
      {/* ── Ambient background blobs ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[580px] w-[580px] rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute top-1/3 -right-40 h-[440px] w-[440px] rounded-full bg-chart-2/10 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/3 h-[380px] w-[380px] rounded-full bg-chart-3/10 blur-[110px]" />
      </div>

      {/* ── Sticky navbar ── */}
      <nav className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md md:px-10">
        <span className="font-heading text-base font-bold tracking-tight">
          Inclusive<span className="text-primary">Blocks</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/components-list"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            Components
          </Link>
          <a
            href={CREATOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GithubIcon />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            View Repo
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-24 md:pb-24 md:pt-36">
        {/* Animated badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3.5 py-1.5 text-xs font-medium text-primary">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Open Source · Accessible by Design
        </div>

        <h1 className="font-heading text-5xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-[5rem]">
          Inclusive
          <br />
          <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
            Blocks
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          An open-source catalog of hand-crafted, accessible UI components.
          Interactive previews, syntax-highlighted code, and comprehensive ARIA
          &amp; keyboard navigation specs — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/components-list"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
          >
            Browse Components
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <GithubIcon />
            Star on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="mt-14 flex flex-wrap gap-10">
          {[
            { label: "Components", value: "3+" },
            { label: "Accessible", value: "100%" },
            { label: "Open Source", value: "MIT" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="font-heading text-3xl font-extrabold text-foreground">
                {stat.value}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features / Why section ── */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            What you get
          </p>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Everything you need to ship accessible UIs
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 rounded-2xl border bg-card/60 p-6 backdrop-blur-xs transition-colors hover:bg-card"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border bg-muted text-foreground">
                {f.icon}
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border bg-primary/5 px-8 py-8 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Ready to explore?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse all components with live previews and copy-ready code.
            </p>
          </div>
          <Link
            href="/components-list"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
          >
            Browse Components
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Creator section ── */}
      <section className="mt-8 border-t border-border/50 bg-card/30 px-6 py-16 backdrop-blur-xs">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            {/* Left */}
            <div className="flex max-w-sm flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                About the Project
              </p>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Built for the community
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                InclusiveBlocks is a free, open-source resource for developers
                who care about building accessible, keyboard-friendly interfaces.
                Every component ships with ARIA annotations, focus management
                notes, and live interactive demos.
              </p>
              <a
                href={CREATOR.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <GithubIcon />
                vsompura3/accessible-ui-component-workspace
                <ExternalLinkIcon />
              </a>
            </div>

            {/* Right: Creator card */}
            <div className="rounded-2xl border bg-card p-6 shadow-xs md:min-w-[300px]">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Created by
              </p>
              <div className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-chart-2 font-heading text-lg font-black text-primary-foreground">
                  VS
                </div>
                <div>
                  <p className="font-heading text-base font-bold text-foreground">
                    Vaibhav Sompura
                  </p>
                  <a
                    href={CREATOR.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    vaibhavsompura.netlify.app
                    <ExternalLinkIcon />
                  </a>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { href: CREATOR.github, label: "GitHub", icon: <GithubIcon /> },
                  { href: CREATOR.linkedin, label: "LinkedIn", icon: <LinkedInIcon /> },
                  { href: CREATOR.email, label: "Email", icon: <MailIcon /> },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-muted-foreground/70">
          <span>
            © {new Date().getFullYear()} InclusiveBlocks ·{" "}
            <a
              href={CREATOR.website}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground hover:underline"
            >
              Vaibhav Sompura
            </a>
          </span>
          <a
            href={CREATOR.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <GithubIcon />
            Open Source
          </a>
        </div>
      </footer>
    </div>
  )
}
