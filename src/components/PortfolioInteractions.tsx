import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

export function Dialog({
  children,
  labelId,
  className = "",
  close,
}: {
  children: ReactNode
  labelId: string
  className?: string
  close: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const backdropPress = useRef(false)
  useEffect(() => {
    const dialog = ref.current
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    dialog?.showModal()
    dialog?.querySelector<HTMLElement>("[data-dialog-autofocus]")?.focus()
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`project-dialog ${className}`}
      aria-labelledby={labelId}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onPointerDown={(event) => {
        backdropPress.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && backdropPress.current)
          close()
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return
        const focusable = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ].filter(
          (element) =>
            element.tabIndex >= 0 &&
            element.getClientRects().length > 0 &&
            !element.closest("[hidden]"),
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (!first) {
          event.preventDefault()
          return
        }
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === event.currentTarget)
        ) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }}
    >
      {children}
    </dialog>
  )
}

export function navigateToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  window.history.pushState(null, "", `#${id}`)
  target.setAttribute("tabindex", "-1")
  target.focus({ preventScroll: true })
  target.scrollIntoView({ block: "start" })
}

const commands = [
  {
    title: "Projects",
    description: "Explore work and case studies",
    keywords: "work software hazelnet research",
    section: "work",
  },
  {
    title: "Skills",
    description: "Technical expertise and toolkit",
    keywords: "expertise technologies stack dotnet",
    section: "expertise",
  },
  {
    title: "About",
    description: "Background, education, and recognition",
    keywords: "education university scholarship vhon",
    section: "about",
  },
  {
    title: "GitHub",
    description: "Open github.com/Xhyther in a new tab",
    keywords: "code source repositories profile external",
    section: null,
  },
  {
    title: "Contact",
    description: "Start a conversation",
    keywords: "email connect opportunities resume",
    section: "contact",
  },
  {
    title: "Experience",
    description: "Development, security, and leadership",
    keywords: "internship lamina gdg journey",
    section: "experience",
  },
  {
    title: "Home",
    description: "Back to the top",
    keywords: "hero terminal start",
    section: "home",
  },
]

export function CommandPalette({
  close,
  github,
}: {
  close: () => void
  github: string
}) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const matches = commands.filter((command) =>
    `${command.title} ${command.description} ${command.keywords}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  )
  useEffect(() => {
    document
      .getElementById(`command-option-${active}`)
      ?.scrollIntoView({ block: "nearest", behavior: "instant" })
  }, [active])
  function run(index: number) {
    const command = matches[index]
    if (!command) return
    if (command.section) {
      close()
      requestAnimationFrame(() => navigateToSection(command.section!))
    } else {
      window.open(github, "_blank", "noopener,noreferrer")
      close()
    }
  }
  return (
    <Dialog
      close={close}
      labelId="command-palette-title"
      className="command-palette"
    >
      <div className="palette-inner">
        <div className="palette-heading">
          <h2 id="command-palette-title">Go anywhere.</h2>
          <button className="palette-close" onClick={close}>
            Close <kbd>Esc</kbd>
          </button>
        </div>
        <p className="palette-description" id="palette-description">
          Search this portfolio. Use ↑ ↓ to choose and Enter to go.
        </p>
        <label className="sr-only" htmlFor="command-search">
          Search commands
        </label>
        <input
          id="command-search"
          role="combobox"
          aria-expanded="true"
          aria-autocomplete="list"
          aria-controls="command-results"
          aria-activedescendant={
            matches.length ? `command-option-${active}` : undefined
          }
          aria-describedby="palette-description"
          data-dialog-autofocus
          autoComplete="off"
          placeholder="Projects, skills, contact…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={(event) => {
            if (
              ["ArrowDown", "ArrowUp", "Home", "End", "Enter"].includes(
                event.key,
              )
            ) {
              if (event.key === "Home" || event.key === "End") {
                // Preserve normal text editing when there is a search query.
                if (query) return
              }
              event.preventDefault()
              if (event.key === "Enter") run(active)
              else if (event.key === "Home") setActive(0)
              else if (event.key === "End")
                setActive(Math.max(0, matches.length - 1))
              else
                setActive((index) =>
                  matches.length
                    ? (index +
                        (event.key === "ArrowDown" ? 1 : -1) +
                        matches.length) %
                      matches.length
                    : 0,
                )
            }
          }}
        />
        <div
          id="command-results"
          role="listbox"
          aria-label="Portfolio commands"
          className="command-results"
        >
          {matches.map((command, index) => (
            <button
              role="option"
              aria-selected={index === active}
              id={`command-option-${index}`}
              key={command.title}
              tabIndex={-1}
              className={`command-option ${index === active ? "selected" : ""}`}
              onPointerMove={() => setActive(index)}
              onClick={() => run(index)}
            >
              <span className="command-mark">
                /{String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <strong>{command.title}</strong>
                <small>{command.description}</small>
              </span>
              <span className="command-enter" aria-hidden="true">
                {command.section ? "↵" : "↗"}
              </span>
            </button>
          ))}
        </div>
        {!matches.length && (
          <p className="command-empty" role="status">
            No commands found. Try “projects” or “contact”.
          </p>
        )}
        <div className="palette-footer">
          <span>Navigate with your keyboard</span>
          <kbd>Ctrl / ⌘ K</kbd>
        </div>
      </div>
    </Dialog>
  )
}

const terminalOutputs: Record<string, string> = {
  help: "help     Show available commands\nwhoami   Meet Vhon / Xhyther\nskills   Explore the technical toolkit\nprojects See the selected projects\nclear    Clear terminal output\n\n↑ / ↓ recall history. Everything runs locally.",
  whoami:
    "Vhon Michael Tabalan / Xhyther\nB.S. Computer Science · Bicol University · expected 2027\nC#/.NET developer & aspiring application-security engineer.\nBased in Bicol, Philippines. Open to opportunities.",
  skills:
    "PRIMARY\nC# · .NET · ASP.NET Core · Blazor · MudBlazor · EF Core\nSQL · PostgreSQL · MySQL · SQLite · Git\n\nALSO EXPLORING\nPython · Java · C · Rust fundamentals\nLinux · Burp Suite · Nmap · Wireshark",
}

export function PortfolioTerminal({
  projectNames,
}: {
  projectNames: string[]
}) {
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [draft, setDraft] = useState("")
  const [entries, setEntries] = useState<{
    command: string
    output: string
  }[]>([])
  const [announcement, setAnnouncement] = useState("")
  const log = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [entries])
  function run(value: string) {
    const command = value.trim()
    if (!command) return
    const name = command.toLowerCase()
    setHistory((previous) => [...previous.slice(-49), command])
    setHistoryIndex(null)
    setInput("")
    setDraft("")
    if (name === "clear") {
      setEntries([])
      setAnnouncement("Terminal output cleared.")
    } else {
      const output =
        name === "projects"
          ? `${projectNames.join("\n")}\n\nOpen Selected Work below for scope, status, and case studies.`
          : terminalOutputs[name] ||
            `Unknown command: ${command}\nType help for the five supported commands. No shell commands are executed.`
      setEntries((previous) => [...previous.slice(-19), { command, output }])
      setAnnouncement("")
    }
    field.current?.focus({ preventScroll: true })
  }
  return (
    <div
      className="portfolio-terminal"
      aria-labelledby="portfolio-terminal-title"
    >
      <div className="portfolio-terminal-header">
        <span id="portfolio-terminal-title">
          <span className="status-dot" /> ~/vhon
        </span>
        <span className="terminal-local">LOCAL INTERACTIVE GUIDE</span>
        <button onClick={() => run("clear")} aria-label="Clear terminal output">
          Clear
        </button>
      </div>
      <div
        className="portfolio-terminal-log"
        ref={log}
        role="log"
        aria-label="Terminal output"
        tabIndex={0}
      >
        <p className="terminal-welcome">
          A small guide to the person behind the code.
          <br />
          Type <strong>help</strong> to begin. No shell access. No remote
          execution.
        </p>
        {entries.map((entry, index) => (
          <div className="terminal-entry" key={index}>
            <p>
              <span aria-hidden="true">❯ </span>
              {entry.command}
            </p>
            <pre>{entry.output}</pre>
          </div>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(event) => {
          event.preventDefault()
          run(input)
        }}
      >
        <span aria-hidden="true">❯</span>
        <label htmlFor="terminal-command" className="sr-only">
          Terminal command
        </label>
        <input
          id="terminal-command"
          ref={field}
          value={input}
          placeholder="Try help, whoami, or skills"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={160}
          onChange={(event) => {
            setInput(event.target.value)
            setHistoryIndex(null)
          }}
          onKeyDown={(event) => {
            if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
            event.preventDefault()
            if (!history.length) return
            if (event.key === "ArrowUp") {
              if (historyIndex === null) setDraft(input)
              const next =
                historyIndex === null
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1)
              setHistoryIndex(next)
              setInput(history[next])
            } else if (historyIndex !== null) {
              const next = historyIndex + 1
              setHistoryIndex(next >= history.length ? null : next)
              setInput(next >= history.length ? draft : history[next])
            }
          }}
        />
        <button type="submit" disabled={!input.trim()}>
          Run <span aria-hidden="true">↵</span>
        </button>
      </form>
      <div className="terminal-shortcuts" aria-label="Try a terminal command">
        {["help", "whoami", "skills", "projects"].map((command) => (
          <button key={command} onClick={() => run(command)}>
            {command}
          </button>
        ))}
        <span>↑ ↓ history</span>
      </div>
      <span className="sr-only" role="status">
        {announcement}
      </span>
    </div>
  )
}

interface CopyButtonProps {
  value: string
  label: string
}

export function CopyButton({ value, label }: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle")
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const fallback = useRef<HTMLInputElement>(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (status === "manual") {
      fallback.current?.focus()
      fallback.current?.select()
    }
  }, [status])
  return (
    <div className="copy-control">
      <button
        className="copy-button"
        onClick={async () => {
          clearTimeout(timer.current)
          try {
            await navigator.clipboard.writeText(value)
            setStatus("copied")
            timer.current = setTimeout(() => setStatus("idle"), 2500)
          } catch {
            setStatus("manual")
          }
        }}
      >
        {label}
      </button>
      <span role="status" className="copy-status">
        {status === "copied"
          ? "Copied!"
          : status === "manual"
            ? "Clipboard unavailable. Select and copy:"
            : ""}
      </span>
      {status === "manual" && (
        <input
          ref={fallback}
          aria-label={`Manually copy ${label.toLowerCase()}`}
          readOnly
          value={value}
        />
      )}
    </div>
  )
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - window.innerHeight
        setProgress(
          range > 0
            ? Math.min(
                100,
                Math.max(0, Math.round((window.scrollY / range) * 100)),
              )
            : 0,
        )
      })
    }
    const resize = new ResizeObserver(update)
    resize.observe(document.body)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()
    return () => {
      resize.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(frame)
    }
  }, [])
  return (
    <div
      className="reading-progress"
      role="progressbar"
      aria-label="Page reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  )
}
