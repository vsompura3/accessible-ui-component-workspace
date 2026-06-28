"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CodeFile {
  filename: string
  content: string
  html?: string
}

interface DocsViewerProps {
  name: string
  description: string
  demo: React.ReactNode
  codeFiles: CodeFile[]
  a11y?: {
    keyboardNavigation?: { key: string; description: string }[]
    ariaAttributes?: { attribute: string; description: string }[]
  }
}

export default function DocsViewer({
  name,
  description,
  demo,
  codeFiles,
  a11y,
}: DocsViewerProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview")
  const [activeFileIndex, setActiveFileIndex] = useState(0)
  const [copiedFile, setCopiedFile] = useState<string | null>(null)

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedFile(filename)
    setTimeout(() => setCopiedFile(null), 2000)
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-10">
      {/* Header section with back button */}
      <header className="flex flex-col gap-4 border-b pb-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <svg
              className="size-3.5 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {name}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </header>

      {/* Tabs Control */}
      <div className="flex items-center gap-2 border-b pb-px">
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 text-sm font-medium transition-all relative border-b-2 px-1 ${
            activeTab === "preview"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setActiveTab("code")}
          className={`pb-3 text-sm font-medium transition-all relative border-b-2 px-1 ${
            activeTab === "code"
              ? "border-primary text-foreground font-semibold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Code
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "preview" ? (
          <div className="flex flex-col gap-10">
            {/* Component Interactive Preview Card */}
            <div className="relative flex min-h-[300px] items-center justify-center rounded-2xl border bg-card/45 p-8 shadow-xs backdrop-blur-xs transition-all hover:bg-card/60 dark:bg-card/25 dark:hover:bg-card/40">
              <div className="absolute top-3 left-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground select-none">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                </span>
                Live Sandbox
              </div>
              <div className="w-full flex justify-center">{demo}</div>
            </div>

            {/* Accessibility Specifications */}
            {a11y &&
              (a11y.keyboardNavigation || a11y.ariaAttributes) && (
                <section className="flex flex-col gap-6 border-t pt-8">
                  <h2 className="font-heading text-2xl font-bold tracking-tight">
                    Accessibility Specs
                  </h2>

                  {/* Keyboard Navigation Details */}
                  {a11y.keyboardNavigation &&
                    a11y.keyboardNavigation.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground/80">
                          <svg
                            className="size-4.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z"
                            />
                          </svg>
                          Keyboard Interactions
                        </h3>
                        <div className="overflow-hidden rounded-xl border bg-card/20 backdrop-blur-xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                                <th className="p-3.5 font-semibold w-1/3">Key</th>
                                <th className="p-3.5 font-semibold">Action / Expected Behavior</th>
                              </tr>
                            </thead>
                            <tbody>
                              {a11y.keyboardNavigation.map((item, index) => (
                                <tr
                                  key={index}
                                  className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                                >
                                  <td className="p-3.5">
                                    <kbd className="inline-block rounded-md border bg-muted px-2 py-1 font-mono text-xs font-semibold shadow-xs select-all text-foreground/90">
                                      {item.key}
                                    </kbd>
                                  </td>
                                  <td className="p-3.5 text-sm text-muted-foreground leading-relaxed">
                                    {item.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  {/* ARIA and Semantic Attributes Details */}
                  {a11y.ariaAttributes && a11y.ariaAttributes.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-foreground/80">
                        <svg
                          className="size-4.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        ARIA Roles & Attributes
                      </h3>
                      <div className="overflow-hidden rounded-xl border bg-card/20 backdrop-blur-xs">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b bg-muted/40 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                              <th className="p-3.5 font-semibold w-1/3">Attribute / Role</th>
                              <th className="p-3.5 font-semibold">Accessibility Purpose</th>
                            </tr>
                          </thead>
                          <tbody>
                            {a11y.ariaAttributes.map((item, index) => (
                              <tr
                                key={index}
                                className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                              >
                                <td className="p-3.5 font-mono text-xs text-primary font-medium select-all">
                                  {item.attribute}
                                </td>
                                <td className="p-3.5 text-sm text-muted-foreground leading-relaxed">
                                  {item.description}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </section>
              )}
          </div>
        ) : (
          /* Code View Mode */
          <div className="flex flex-col gap-4">
            {/* Multi-file selector (if more than 1 file exists) */}
            {codeFiles.length > 1 && (
              <div className="flex flex-wrap gap-1.5 border-b pb-2">
                {codeFiles.map((file, index) => (
                  <button
                    key={file.filename}
                    onClick={() => setActiveFileIndex(index)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-colors hover:bg-accent/40 ${
                      activeFileIndex === index
                        ? "bg-accent/70 text-foreground font-semibold border"
                        : "text-muted-foreground"
                    }`}
                  >
                    {file.filename}
                  </button>
                ))}
              </div>
            )}

            {/* Code Block Container */}
            <div className="relative overflow-hidden rounded-2xl border bg-card/30 backdrop-blur-xs">
              <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground select-none">
                  {codeFiles[activeFileIndex]?.filename}
                </span>
                <Button
                  onClick={() =>
                    handleCopy(
                      codeFiles[activeFileIndex].filename,
                      codeFiles[activeFileIndex].content
                    )
                  }
                  variant="outline"
                  size="xs"
                  className="font-sans font-normal border cursor-pointer active:scale-95"
                >
                  {copiedFile === codeFiles[activeFileIndex]?.filename ? (
                    <span className="flex items-center gap-1 text-emerald-500 font-medium">
                      <svg
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Copied!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <svg
                        className="size-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Copy code
                    </span>
                  )}
                </Button>
              </div>
              <div className="overflow-x-auto p-4 bg-muted/20 select-text">
                {codeFiles[activeFileIndex]?.html ? (
                  <div
                    className="font-mono text-xs leading-relaxed [&_pre]:bg-transparent! [&_pre]:p-0! [&_pre]:m-0! [&_pre]:overflow-visible!"
                    dangerouslySetInnerHTML={{ __html: codeFiles[activeFileIndex].html }}
                  />
                ) : (
                  <pre className="font-mono text-xs leading-relaxed text-foreground">
                    <code>{codeFiles[activeFileIndex]?.content}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
