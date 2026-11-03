import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { SecureCore, SkillConstellation } from "./components/ThreeExperiences"
import {
  CommandPalette,
  CopyButton,
  Dialog,
  navigateToSection,
  PortfolioTerminal,
  ReadingProgress,
} from "./components/PortfolioInteractions"

const GITHUB = "https://github.com/Xhyther"
const LINKEDIN = "https://www.linkedin.com/in/vmvt1011/"

function Icon({
  name,
  size = 18,
  ...props
}: {
  name: string
  size?: number
  className?: string
}) {
  const paths: Record<string, ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M12 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M6 18 18 6M6 6h12v12" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </>
    ),
    moon: <path d="M20.7 13a9 9 0 0 1-9.7-9.7A9 9 0 1 0 20.7 13Z" />,
    github: (
      <>
        <path d="M9 19c-4.3 1.3-4.3-2.1-6-2.5M15 22v-3.9c0-1 .1-1.4-.5-2 3.2-.4 6.5-1.6 6.5-7.1A5.5 5.5 0 0 0 19.5 5a5 5 0 0 0-.1-4S18.2.6 15 2.5a14 14 0 0 0-6 0C5.8.6 4.6 1 4.6 1a5 5 0 0 0-.1 4A5.5 5.5 0 0 0 3 9c0 5.5 3.3 6.7 6.5 7.1-.6.6-.6 1.2-.5 2V22" />
      </>
    ),
    code: (
      <>
        <path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18" />
      </>
    ),
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6" />
      </>
    ),
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    menu: <path d="M4 8h16M4 16h16" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 3h8v7a4 4 0 0 1-8 0V3Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 14v7m-4 0h8" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] || paths.arrow}
    </svg>
  )
}

function ExternalLink({
  children,
  href,
  className = "",
}: {
  children: ReactNode
  href: string
  className?: string
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={className}>
      {children}
    </a>
  )
}

type Project = {
  id: string
  number: string
  title: string
  subtitle?: string
  team?: string
  recognition?: string
  fullTitle?: string
  category: string
  kind: string
  description: string
  tags: string[]
  status: string
  role: string
  roleHeading?: string
  overview: string
  approach: string
  challenges: string
  architecture: string
  learnings: string
  detailsLabel: string
  details: string[]
  planned?: string[]
  note: string
  repositoryUrl?: string
}

const projects: Project[] = [
  {
    id: "hazel",
    number: "01",
    title: "HazelNet",
    category: "Full Stack",
    kind: "FEATURED / FULL-STACK PLATFORM",
    description:
      "From flashcards to a deliberate study loop. Leading and building a full-stack platform with FSRS-powered spaced repetition.",
    tags: ["Blazor / MudBlazor", "ASP.NET Core", "PostgreSQL", "FSRS"],
    status: "Hands-on implementation",
    role: "Project lead / full-stack developer",
    overview:
      "Flashcards are only useful if learners know what to review next. HazelNet connects card-based study with spaced repetition, review history, and analytics so the learning loop extends beyond a single session.",
    approach:
      "Lead the project while implementing across the Blazor/MudBlazor frontend and ASP.NET Core backend. Organize application logic with Clean Architecture and CQRS, persist study data in PostgreSQL, and use FSRS to drive review scheduling.",
    challenges:
      "Keep scheduling, persisted review history, authentication, and the study UI connected without coupling domain rules to presentation. Balance project direction with hands-on implementation across those boundaries.",
    architecture:
      "Blazor and MudBlazor provide the study interface. ASP.NET Core hosts application logic organized with Clean Architecture and CQRS, with PostgreSQL for persistence. FSRS scheduling sits within the review workflow alongside review history and analytics.",
    learnings:
      "A scheduler is one part of a stateful study loop: review history, application boundaries, and clear UI feedback matter together. This project is a vehicle for practicing full-stack ownership, not evidence of measured learning or retention gains.",
    detailsLabel: "Implemented platform capabilities",
    details: [
      "Full-stack flashcard study workflows with Blazor and MudBlazor.",
      "FSRS-based spaced-repetition scheduling connected to review history.",
      "Study analytics and authentication in the application.",
      "ASP.NET Core services and PostgreSQL persistence, structured around Clean Architecture and CQRS.",
    ],
    note: "Hands-on platform implementation and project leadership. No production deployment, adoption, retention gains, or performance figures are claimed.",
  },
  {
    id: "research",
    number: "02",
    title: "R&D Agenda Classifier",
    fullTitle:
      "A Two-Stage Transformer-Based Classification System for Research and Development Agenda Categorization",
    category: "Research",
    kind: "THESIS / IN PROGRESS",
    description:
      "Researching a two-stage approach to R&D agenda classification—with traceable evidence and a human in the loop.",
    tags: ["Transformer research", "Document processing", "Human review"],
    status: "In-progress thesis",
    role: "Student researcher / thesis development",
    overview:
      "Assigning research documents to an R&D agenda requires more than a category label: reviewers need to understand the evidence behind a decision. This thesis investigates classification at both primary-agenda and sub-agenda levels.",
    approach:
      "Investigate a two-stage transformer-based classification workflow for PDF research documents, with evidence/provenance attached to predictions and human-in-the-loop review before accepting a categorization.",
    challenges:
      "Preserve the link between a classification and its source evidence while handling hierarchical agenda labels. A useful research workflow must support reviewer judgment, not just produce a model label.",
    architecture:
      "Proposed, not presented as built: PDF documents feed a two-stage primary/sub-agenda classification workflow. A planned FastAPI/Python service handles document processing and inference; Blazor and ASP.NET Core support review; MySQL stores application and review records.",
    learnings:
      "Research focus: evaluate hierarchical categorization alongside provenance and human review. Accuracy needs a documented dataset, evaluation protocol, and results; no deployed model, accuracy score, or completed implementation is claimed here.",
    detailsLabel: "Current research scope",
    details: [
      "PDF research-document processing as the input to the proposed workflow.",
      "Primary-agenda classification followed by sub-agenda classification.",
      "Evidence and provenance to help reviewers trace a suggested categorization.",
      "Human-in-the-loop review rather than treating a model prediction as a final decision.",
    ],
    planned: [
      "Blazor frontend and ASP.NET Core application/API layer.",
      "FastAPI/Python service for document processing and model inference.",
      "MySQL for application data and classification/review records.",
    ],
    note: "Thesis in progress. The research scope and planned architecture are not presented as implemented features. Feature-level completion, deployment, and ML accuracy are not claimed; evaluation results are not yet reported here.",
  },
  {
    id: "elfin",
    number: "03",
    title: "ElfinURL",
    category: "Full Stack",
    kind: "BACKEND DEVELOPMENT",
    description:
      "Less URL. More possibility. A URL-shortening API built to explore the .NET ecosystem.",
    tags: ["C#", ".NET Web API", "SQLite"],
    status: "Backend implemented / frontend planned",
    role: "Developer / .NET learning project",
    overview:
      "Long URLs are awkward to share. ElfinURL explores a focused solution: a URL-shortening service with a .NET Web API backend and a planned Blazor interface.",
    approach:
      "Implement the API while developing a stronger understanding of HTTP, request handling, and the .NET ecosystem. Keep the backend implementation separate from the planned frontend and analytics work.",
    challenges:
      "Define a focused HTTP interface for creating and resolving shortened links, while keeping the implemented API distinct from planned frontend, analytics, and authentication work.",
    architecture:
      "The implemented .NET Web API backend supports URL shortening with configurable PostgreSQL or SQLite persistence. A Blazor frontend is planned, not presented as implemented.",
    learnings:
      "A small service is a useful setting for understanding HTTP contracts, request handling, and persistence. An implemented backend should not be mistaken for a complete deployed product.",
    detailsLabel: "Implemented backend",
    details: [
      "URL-shortening backend built with .NET Web API.",
      "Database configuration for PostgreSQL or SQLite.",
      "A practical exploration of request handling and service architecture.",
    ],
    planned: ["Blazor frontend.", "Usage analytics and authentication."],
    note: "Backend implemented. The Blazor frontend, analytics, and authentication are listed as planned work in the repository.",
  },
  {
    id: "calis",
    number: "04",
    title: "CALIS",
    category: "Systems",
    kind: "JAVA / INVENTORY APPLICATION",
    description:
      "Bringing structure to locker contents. A Java-based project connecting inventory needs with object-oriented application design.",
    tags: ["Java", "OOP", "Locker inventory"],
    status: "Academic application project",
    role: "Developer / object-oriented programming project",
    overview:
      "Locker contents need an organized inventory, not an informal list. CALIS is a Java-based locker and content inventory project developed in an object-oriented programming context.",
    approach:
      "Use Java and object-oriented design to represent locker inventory and its contents. Focus on translating a concrete record-management problem into application logic.",
    challenges:
      "Translate locker and content relationships into a coherent object model, rather than treating the inventory as an unstructured list.",
    architecture:
      "A Java-based academic application centered on lockers and their contents. The case study focuses on object-oriented domain modeling; no web-service, database, or deployment architecture is asserted.",
    learnings:
      "Learning focus: model a real record-management problem with clear responsibilities and object relationships before adding unnecessary infrastructure.",
    detailsLabel: "Project focus",
    details: [
      "Locker and content inventory in a Java-based application.",
      "Object-oriented modeling of the problem domain.",
      "Practical application development in an academic setting.",
    ],
    note: "An academic Java project. No production rollout, operational scale, or inventory-efficiency improvement is claimed.",
  },
  {
    id: "compiler",
    number: "05",
    title: "C Lexer / Semi-compiler",
    category: "Systems",
    kind: "SYSTEMS / LANGUAGE FUNDAMENTALS",
    description:
      "Looking beneath the syntax. Exploring how source text becomes tokens through a lexer and semi-compiler written in C.",
    tags: ["C", "Tokenization", "Language fundamentals"],
    status: "Language fundamentals project",
    role: "Developer / systems programming",
    overview:
      "Before a language can execute, a tool has to make sense of its source text. This C lexer/semi-compiler explores that early language-processing boundary.",
    approach:
      "Work directly in C to explore tokenization and language fundamentals. Keep the project’s scope explicit: it is a lexer/semi-compiler, not a production-ready compiler toolchain.",
    challenges:
      "Recognize lexical units in source text and keep tokenization boundaries explicit without implying support for a complete language or compiler pipeline.",
    architecture:
      "A C-based source-text processing exercise focused on lexical analysis and tokens. It is a lexer/semi-compiler, not a claimed end-to-end compiler with code generation.",
    learnings:
      "Learning focus: understand the boundary between characters, tokens, and later language-processing stages. Low-level work makes the abstractions used by application frameworks easier to question.",
    detailsLabel: "Project focus",
    details: [
      "Source-text tokenization in C.",
      "An exploration of lexical analysis and language-processing fundamentals.",
      "Low-level implementation practice beyond application frameworks.",
    ],
    note: "A learning-focused lexer/semi-compiler. Full language conformance, code generation, and production compiler readiness are not claimed.",
  },
  {
    id: "security",
    number: "06",
    title: "Security Labs",
    category: "Security",
    kind: "AUTHORIZED / SECURITY PRACTICE",
    description:
      "Understand the weakness. Inspect the request. Bring the lesson back to building—through authorized web-security labs.",
    tags: ["PortSwigger", "Burp Suite", "Nmap", "Linux"],
    status: "Ongoing authorized practice",
    role: "Security learner / lab practitioner",
    overview:
      "Secure application development needs a practical understanding of how vulnerabilities behave. Authorized PortSwigger web-security labs provide a controlled setting to connect security concepts with observable application behavior.",
    approach:
      "Practice inspecting HTTP traffic with Burp Suite, explore network and service discovery with Nmap in authorized environments, and use Linux and Wireshark to strengthen vulnerability-assessment fundamentals.",
    challenges:
      "Turn observed HTTP and network behavior into a reasoned explanation of a weakness, while keeping every exercise within an explicitly authorized scope.",
    architecture:
      "A controlled practice environment, not a deployed product: authorized PortSwigger labs for web behavior, Burp Suite for HTTP inspection, Nmap for permitted discovery, and Linux/Wireshark for network investigation.",
    learnings:
      "Learning focus: observe, reproduce within scope, and explain the underlying assumption. Lab practice informs security-minded development but does not establish production penetration-testing experience.",
    detailsLabel: "Practice areas",
    details: [
      "Authorized PortSwigger web-security lab exercises.",
      "HTTP request/response inspection with Burp Suite.",
      "Nmap and Linux for lab-based discovery and assessment practice.",
      "Wireshark for understanding network traffic.",
    ],
    note: "Ongoing practice in authorized labs, not a claim of client penetration tests, certifications, vulnerability disclosures, or production findings.",
  },
  {
    id: "paleasta",
    number: "07",
    title: "PaLEAsta!",
    subtitle: "AI-Powered Financial Advisor & Bookkeeper",
    team: "Leanux",
    recognition: "InnoLab Hackathon 2026 — 1st Runner-Up",
    category: "Hackathon",
    kind: "HACKATHON / FINANCIAL PLATFORM",
    description:
      "A purpose-driven financial platform designed for local micro-entrepreneurs, combining simplified bookkeeping, record-grounded AI financial guidance through LEA, and a Financial Passport that summarizes business activity for potential lending assessment.",
    tags: ["Bookkeeping", "AI Financial Advisor", "Financial Passport"],
    status: "Hackathon Prototype",
    role: "Team Leanux",
    roleHeading: "Team & prototype scope",
    overview:
      "Local micro-entrepreneurs need approachable tools to organize business records, understand their finances, and summarize business activity for potential lending assessment.",
    approach:
      "PaLEAsta! brings simplified bookkeeping, record-grounded guidance through LEA, and a Financial Passport into one purpose-driven financial platform. This case study describes Team Leanux’s prototype without attributing individual contributions.",
    challenges:
      "Keep bookkeeping understandable for local micro-entrepreneurs, ground financial guidance in business records, and communicate business activity clearly for potential lending assessment.",
    architecture:
      "Product workflow, not a verified implementation architecture: bookkeeping supplies business records; LEA provides record-grounded AI financial guidance; the Financial Passport summarizes business activity for potential lending assessment. No technology stack or deployment architecture is specified.",
    learnings:
      "Product focus: make financial recordkeeping approachable and connect guidance to business records. The Financial Passport supports potential lending assessment; it is not a lending decision or a guarantee of credit.",
    detailsLabel: "Hackathon prototype scope",
    details: [
      "Bookkeeping — simplified records of business activity.",
      "AI Financial Advisor — record-grounded financial guidance through LEA.",
      "Financial Passport — a summary of business activity for potential lending assessment.",
    ],
    note: "Hackathon Prototype by Team Leanux. Recognized as 1st Runner-Up at InnoLab Hackathon 2026, October 26–27, 2026, at Ateneo de Naga University. No production launch, technology stack, or individual implementation responsibilities are claimed.",
  },
]

function ProjectVisual({ type }: { type: string }) {
  if (type === "paleasta")
    return (
      <div className="project-visual visual-finance" aria-hidden="true">
        <span className="visual-label">FINANCE WITH PURPOSE.</span>
        <div className="pipeline-sketch">
          <div className="pipeline-input">
            <Icon name="layers" size={18} />
            <span>PaLEAsta! / TEAM LEANUX</span>
          </div>
          <div className="pipeline-stem" />
          <div className="pipeline-stages">
            <span>
              BOOKKEEPING<small>BUSINESS RECORDS</small>
            </span>
            <Icon name="arrow" size={13} />
            <span>
              LEA<small>GROUNDED GUIDANCE</small>
            </span>
          </div>
          <div className="pipeline-review">FINANCIAL PASSPORT</div>
        </div>
        <span className="visual-caption">
          PRODUCT FLOW SKETCH · HACKATHON PROTOTYPE
        </span>
      </div>
    )
  if (type === "hazel")
    return (
      <div className="project-visual visual-elfin" aria-hidden="true">
        <span className="visual-label">LEARN → REVIEW → REMEMBER</span>
        <div className="study-sketch">
          <div className="study-sketch-header">
            <span>
              hazel<span className="accent">net.</span>
            </span>
            <span>THE STUDY LOOP</span>
          </div>
          <div className="study-sketch-card">
            <span>ACTIVE RECALL</span>
            <strong>What makes a memory last?</strong>
            <span>Retrieval. Timing. Repetition.</span>
          </div>
          <div className="study-sketch-loop">
            <span>REVIEW</span>
            <Icon name="arrow" size={12} />
            <span>FSRS</span>
            <Icon name="arrow" size={12} />
            <span>RESCHEDULE</span>
          </div>
        </div>
        <span className="visual-caption">
          STUDY-WORKFLOW SKETCH · NOT A LIVE PREVIEW
        </span>
      </div>
    )
  if (type === "research" || type === "calis") {
    const research = type === "research"
    return (
      <div className="project-visual visual-finance" aria-hidden="true">
        <span className="visual-label">
          {research
            ? "CLASSIFY WITH CONTEXT, NOT JUST CONFIDENCE."
            : "A PLACE FOR EVERYTHING."}
        </span>
        <div className="pipeline-sketch">
          <div className="pipeline-input">
            <Icon name={research ? "layers" : "code"} size={18} />
            <span>
              {research
                ? "PDF RESEARCH DOCUMENT"
                : "JAVA / OBJECT-ORIENTED DESIGN"}
            </span>
          </div>
          <div className="pipeline-stem" />
          <div className="pipeline-stages">
            <span>
              {research ? "PRIMARY AGENDA" : "LOCKER"}
              <small>{research ? "STAGE 01" : "CONTAINER"}</small>
            </span>
            <Icon name="arrow" size={13} />
            <span>
              {research ? "SUB-AGENDA" : "CONTENTS"}
              <small>{research ? "STAGE 02" : "INVENTORY"}</small>
            </span>
          </div>
          <div className="pipeline-review">
            {research
              ? "EVIDENCE + HUMAN REVIEW"
              : "STRUCTURED INVENTORY MODEL"}
          </div>
        </div>
        <span className="visual-caption">
          {research
            ? "PROPOSED PIPELINE · THESIS IN PROGRESS"
            : "DOMAIN SKETCH · ACADEMIC PROJECT"}
        </span>
      </div>
    )
  }
  if (type === "elfin")
    return (
      <div className="project-visual visual-elfin" aria-hidden="true">
        <span className="visual-label">REQUEST → RESOLVE → REDIRECT</span>
        <div className="link-diagram">
          <div className="url-input">
            <span>https://a-very-long-url.com/...</span>
            <Icon name="diagonal" size={13} />
          </div>
          <div className="diagram-connector">
            <span />
            <small>POST /api/shorten</small>
          </div>
          <div className="url-output">
            <span className="link-symbol">↗</span> elfin.url/
            <strong>x7k2</strong>
            <span className="success-dot" />
          </div>
        </div>
        <span className="visual-caption">API ARCHITECTURE SKETCH</span>
      </div>
    )
  const compiler = type === "compiler"
  return (
    <div className="project-visual visual-ctf" aria-hidden="true">
      <span className="visual-label">
        {compiler
          ? "BEFORE EXECUTION, UNDERSTANDING."
          : "CURIOSITY, WITH PERMISSION."}
      </span>
      <div className="terminal">
        <div className="terminal-top">
          <span />
          <span />
          <span />
          <small>
            {compiler ? "~/systems/lexer" : "~/security/authorized-labs"}
          </small>
        </div>
        <div className="terminal-body">
          <p>
            <em>❯</em> {compiler ? "cat tokens.txt" : "cat approach.md"}
          </p>
          <p className="terminal-comment">
            {compiler
              ? "# source text → tokens"
              : "# authorized environments only"}
          </p>
          <p>
            <b>01</b>{" "}
            {compiler ? "read source characters" : "observe the system"}
          </p>
          <p>
            <b>02</b>{" "}
            {compiler ? "identify lexical units" : "inspect the request"}
          </p>
          <p>
            <b>03</b>{" "}
            {compiler ? "emit token sequence" : "document the learning"}
          </p>
          <p>
            <em>❯</em> <span className="terminal-cursor" />
          </p>
        </div>
      </div>
      <span className="visual-caption">
        {compiler
          ? "TOKENIZATION CONCEPT · NOT EXECUTION OUTPUT"
          : "A LEARNING MINDSET, DOCUMENTED"}
      </span>
    </div>
  )
}

function SectionHeading({
  number,
  label,
  title,
  children,
}: {
  number: string
  label: string
  title: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">
          <span>{number} /</span> {label}
        </p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  )
}

function ProjectContext({ project }: { project: Project }) {
  if (!project.team && !project.recognition) return null
  return (
    <div className="project-context">
      {project.team && <p className="project-team">Team {project.team}</p>}
      {project.recognition && (
        <p className="project-recognition">
          <Icon name="trophy" size={14} />
          {project.recognition}
        </p>
      )}
    </div>
  )
}

function ProjectDialog({
  project,
  close,
}: {
  project: Project
  close: () => void
}) {
  const [tab, setTab] = useState("Features")
  const tabs = ["Architecture", "Features", "Learnings"]
  return (
    <Dialog labelId="project-dialog-title" close={close}>
      <div className="dialog-inner">
        <button
          className="icon-button dialog-close"
          onClick={close}
          aria-label="Close project details"
        >
          <Icon name="close" />
        </button>
        <p className="eyebrow">{project.kind}</p>
        <h2 id="project-dialog-title">{project.title}</h2>
        {project.subtitle && (
          <p className="project-subtitle">{project.subtitle}</p>
        )}
        {project.fullTitle && (
          <p className="project-full-title">{project.fullTitle}</p>
        )}
        <p className="project-status">
          <span className="tiny-square" />
          {project.status}
        </p>
        <div className="tags">
          {project.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <ProjectContext project={project} />
        <h3>The problem</h3>
        <p className="dialog-overview">{project.overview}</p>
        <h3>{project.roleHeading || "My role & approach"}</h3>
        <p className="dialog-role">{project.role}</p>
        <p className="dialog-overview">{project.approach}</p>
        <h3>Challenges</h3>
        <p className="dialog-overview">{project.challenges}</p>
        <div
          className="case-tabs"
          role="tablist"
          aria-label="Project detail sections"
        >
          {tabs.map((name, index) => (
            <button
              key={name}
              id={`case-tab-${name.toLowerCase()}`}
              role="tab"
              aria-selected={tab === name}
              aria-controls={`case-panel-${name.toLowerCase()}`}
              tabIndex={tab === name ? 0 : -1}
              onClick={() => setTab(name)}
              onKeyDown={(event) => {
                if (
                  !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                    event.key,
                  )
                )
                  return
                event.preventDefault()
                const next =
                  event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? tabs.length - 1
                      : (index +
                          (event.key === "ArrowRight" ? 1 : -1) +
                          tabs.length) %
                        tabs.length
                setTab(tabs[next])
                document
                  .getElementById(`case-tab-${tabs[next].toLowerCase()}`)
                  ?.focus()
              }}
            >
              {name}
            </button>
          ))}
        </div>
        {tabs.map((name) => (
          <div
            key={name}
            id={`case-panel-${name.toLowerCase()}`}
            role="tabpanel"
            aria-labelledby={`case-tab-${name.toLowerCase()}`}
            tabIndex={0}
            hidden={tab !== name}
            className="case-panel"
          >
            {name === "Architecture" && (
              <>
                <h3>
                  {project.category === "Research"
                    ? "Proposed architecture — not presented as built"
                    : "System boundaries"}
                </h3>
                <p className="dialog-overview">{project.architecture}</p>
                {project.planned && (
                  <>
                    <h3>Planned technology / next steps</h3>
                    <ul className="planned-list">
                      {project.planned.map((detail) => (
                        <li key={detail}>
                          <Icon name="arrow" size={16} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {name === "Features" && (
              <>
                <h3>{project.detailsLabel}</h3>
                <ul>
                  {project.details.map((detail) => (
                    <li key={detail}>
                      <Icon
                        name={
                          project.category === "Research" ? "arrow" : "check"
                        }
                        size={16}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
                {project.planned && (
                  <>
                    <h3>Planned — not presented as implemented</h3>
                    <ul className="planned-list">
                      {project.planned.map((detail) => (
                        <li key={detail}>
                          <Icon name="arrow" size={16} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </>
            )}
            {name === "Learnings" && (
              <>
                <h3>
                  {project.category === "Research"
                    ? "Research & evaluation focus"
                    : "Engineering takeaways"}
                </h3>
                <p className="dialog-overview">{project.learnings}</p>
              </>
            )}
          </div>
        ))}
        <div className="project-note">
          <strong>Outcome / current status</strong>
          <p>{project.note}</p>
        </div>
        <ExternalLink
          className="button button-primary"
          href={project.repositoryUrl || GITHUB}
        >
          {project.repositoryUrl ? "Explore repository" : "View GitHub profile"}{" "}
          <Icon name="diagonal" />
        </ExternalLink>
        {!project.repositoryUrl && (
          <p className="repository-note">
            Project-specific repository link not configured.
          </p>
        )}
      </div>
    </Dialog>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("vhon-theme") === "light" ? "light" : "dark"
    } catch {
      return "dark"
    }
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [filter, setFilter] = useState("All")
  const [projectQuery, setProjectQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem("vhon-theme", theme)
    } catch {
      /* Theme still works without storage. */
    }
  }, [theme])
  useEffect(() => {
    const sections = [
      ...document.querySelectorAll<HTMLElement>("main section[id]"),
    ]
    let frame = 0
    function update() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        let current = "home"
        for (const section of sections) {
          if (
            section.getBoundingClientRect().top <=
            Math.min(220, window.innerHeight * 0.3)
          )
            current = section.id
        }
        if (
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4
        )
          current = "contact"
        setActiveSection(current)
      })
    }
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    update()
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
      cancelAnimationFrame(frame)
    }
  }, [])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setSelectedProject(null)
        setMenuOpen(false)
        setCommandOpen((previous) => !previous)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])
  useEffect(() => {
    const media = window.matchMedia("(min-width: 601px)")
    const closeOnDesktop = () => {
      if (media.matches) setMenuOpen(false)
    }
    media.addEventListener("change", closeOnDesktop)
    return () => media.removeEventListener("change", closeOnDesktop)
  }, [])
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.remove("reveal-pending")
            observer.unobserve(entry.target)
          }
      },
      { threshold: 0.08 },
    )
    const targets = document.querySelectorAll<HTMLElement>(
      ".section-heading, .timeline-item, .expertise-card, .about-grid",
    )
    targets.forEach((target) => {
      if (target.getBoundingClientRect().top > window.innerHeight) {
        target.classList.add("reveal-pending")
        observer.observe(target)
      }
    })
    return () => {
      observer.disconnect()
      targets.forEach((target) => target.classList.remove("reveal-pending"))
    }
  }, [])
  const queryTerms = projectQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  const visibleProjects = projects.filter((project) => {
    const searchable = [
      project.title,
      project.subtitle,
      project.team,
      project.recognition,
      project.fullTitle,
      project.category,
      project.kind,
      project.status,
      project.role,
      project.description,
      project.approach,
      project.architecture,
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase()
    return (
      (filter === "All" || project.category === filter) &&
      queryTerms.every((term) => searchable.includes(term))
    )
  })
  const navLinks = [
    ["work", "Work"],
    ["experience", "Experience"],
    ["expertise", "Expertise"],
    ["about", "About"],
  ]
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand">
            <span className="brand-mark" aria-hidden="true">
              v<span> /</span>
            </span>
            <span>
              vhon<span className="brand-slash"> / </span>
              <span className="brand-alias">xhyther</span>
              <span className="brand-period">.</span>
            </span>
          </a>
          <nav
            className="main-nav"
            aria-label="Main navigation"
            id="main-navigation"
          >
            {navLinks.map(([id, name]) => (
              <a
                key={id}
                className={activeSection === id ? "active" : ""}
                aria-current={activeSection === id ? "location" : undefined}
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </a>
            ))}
            <a
              href="#contact"
              className="mobile-contact"
              onClick={() => setMenuOpen(false)}
            >
              Let’s talk <Icon name="diagonal" size={15} />
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="command-trigger icon-button"
              aria-keyshortcuts="Control+k Meta+k"
              onClick={() => setCommandOpen(true)}
              title="Search portfolio (Ctrl / Cmd + K)"
            >
              <Icon name="search" size={17} />
              <span className="sr-only">Open command palette</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="theme-button icon-button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${
                theme === "dark" ? "light" : "dark"
              } theme`}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
            </button>
            <a
              href="#contact"
              className={`header-contact ${
                activeSection === "contact" ? "active" : ""
              }`}
              aria-current={
                activeSection === "contact" ? "location" : undefined
              }
            >
              Let’s talk <Icon name="diagonal" size={15} />
            </a>
            <button
              className="menu-button icon-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuOpen ? "mobile-navigation" : undefined}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </div>
        <ReadingProgress />
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero container" id="home">
          <div className="hero-topline">
            <p className="eyebrow">
              <span className="status-dot" /> OPEN TO OPPORTUNITIES
            </p>
            <span className="mono hero-index">PORTFOLIO — VOL. 01</span>
          </div>
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-intro">
                <span className="short-line" /> DEVELOPER BY CRAFT. CURIOUS BY
                DEFAULT.
              </div>
              <h1>
                I build software.
                <br />
                <span>I think security.</span>
                <span className="headline-period">_</span>
              </h1>
              <p className="hero-description">
                I design and develop practical applications with C# and .NET—and
                study how to make systems more resilient.
              </p>
              <div className="hero-buttons">
                <a href="#work" className="button button-primary">
                  Explore work <Icon name="down" size={17} />
                </a>
                <ExternalLink href={GITHUB} className="button button-secondary">
                  <Icon name="github" size={17} />
                  View GitHub
                  <Icon name="diagonal" size={15} />
                </ExternalLink>
              </div>
              <div className="hero-utilities">
                <CopyButton value={GITHUB} label="Copy GitHub URL" />
                <span>Resume available on request.</span>
              </div>
              <div className="hero-person">
                <span className="person-line" />
                <div>
                  <strong>Vhon Michael Tabalan</strong>
                  <span>
                    CS student. .NET developer. Security-minded builder.
                  </span>
                </div>
              </div>
            </div>
            <div className="hero-interactive">
              <SecureCore light={theme === "light"} />
              <PortfolioTerminal
                projectNames={projects.map((project) => project.title)}
              />
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              <Icon name="location" size={14} /> Based in Bicol, Philippines
            </span>
            <div className="hero-focus">
              <span>C# / .NET</span>
              <i />
              <span>APPLICATION SECURITY</span>
              <i />
              <span>CONTINUOUS LEARNING</span>
            </div>
            <a href="#work" className="scroll-link">
              SCROLL TO EXPLORE <Icon name="down" size={14} />
            </a>
          </div>
        </section>

        <section className="work-section section container" id="work">
          <SectionHeading
            number="01"
            label="SELECTED WORK"
            title={
              <>
                Built to solve.
                <br className="mobile-break" /> Built to learn
                <span className="accent">.</span>
              </>
            }
          >
            <p className="section-description">
              Full-stack builds, research in progress,
              <br className="desktop-break" /> and the fundamentals behind them.
            </p>
          </SectionHeading>
          <div className="work-toolbar">
            <div className="filters" aria-label="Filter projects">
              {["All", "Full Stack", "Security", "Research"].map((value) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  aria-pressed={filter === value}
                  className={filter === value ? "selected" : ""}
                >
                  {value}
                  {value === "All" && (
                    <span>{String(projects.length).padStart(2, "0")}</span>
                  )}
                </button>
              ))}
            </div>
            <ExternalLink className="text-link all-repos" href={GITHUB}>
              GitHub profile <Icon name="diagonal" size={15} />
            </ExternalLink>
          </div>
          <div className="project-search-row">
            <label className="project-search">
              <Icon name="search" size={17} />
              <span className="sr-only">Search projects</span>
              <input
                id="project-search-input"
                type="search"
                value={projectQuery}
                onChange={(event) => setProjectQuery(event.target.value)}
                placeholder="Search projects, technologies, or topics…"
              />
            </label>
            <p role="status" className="project-result-count">
              {visibleProjects.length} of {projects.length} projects
            </p>
            {projectQuery && (
              <button
                className="text-link"
                onClick={() => {
                  setProjectQuery("")
                  document.getElementById("project-search-input")?.focus()
                }}
              >
                Clear search
              </button>
            )}
          </div>
          <div className="project-grid">
            {visibleProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-visual-frame">
                  <ProjectVisual type={project.id} />
                  <button
                    className="project-visual-button"
                    onClick={() => setSelectedProject(project)}
                    aria-label={`View ${project.title} project details`}
                  >
                    <span className="visual-open">
                      <Icon name="diagonal" size={18} />
                    </span>
                  </button>
                </div>
                <div className="project-copy">
                  <p className="project-kind">
                    <span>{project.number}</span> {project.kind}
                  </p>
                  <button
                    className="project-title"
                    onClick={() => setSelectedProject(project)}
                  >
                    <h3>{project.title}</h3>
                    <Icon name="diagonal" size={22} />
                  </button>
                  {project.subtitle && (
                    <p className="project-subtitle">{project.subtitle}</p>
                  )}
                  <p className="project-status">
                    <span className="tiny-square" />
                    {project.status}
                  </p>
                  <p className="project-description">{project.description}</p>
                  <ProjectContext project={project} />
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visibleProjects.length && (
            <div className="project-empty">
              <Icon name="search" size={28} />
              <h3>No projects match yet.</h3>
              <p>Try a different keyword or explore all categories.</p>
              <button
                className="button button-secondary"
                onClick={() => {
                  setProjectQuery("")
                  setFilter("All")
                  document.getElementById("project-search-input")?.focus()
                }}
              >
                Reset filters & search <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
          <div className="work-footnote">
            <span className="tiny-square" /> Clear scope. Honest status. No
            invented results.
          </div>
        </section>

        <section
          className="experience-section section container"
          id="experience"
        >
          <SectionHeading
            number="02"
            label="THE JOURNEY"
            title={
              <>
                Experience through
                <br />
                doing<span className="accent">.</span>
              </>
            }
          >
            <p className="section-description">
              Hands-on development. Security practice.
              <br />
              Leadership through building.
            </p>
          </SectionHeading>
          <div className="experience-layout">
            <div className="experience-aside">
              <p className="mono">LEARNING IN THE OPEN</p>
              <p>
                Leading a full-stack build, contributing to a campus technology
                community, and developing a security perspective—one practical
                experience at a time.
              </p>
              <span className="aside-glyph" aria-hidden="true">
                ↳
              </span>
            </div>
            <div className="timeline">
              {[
                {
                  year: "2026",
                  label: "JUNE–AUGUST 2026 / REMOTE",
                  title: "Cybersecurity Intern",
                  place: "Lamina Studios LLC",
                  text: "Remote cybersecurity internship with Lamina Studios LLC, June–August 2026.",
                  tag: "Cybersecurity internship",
                },
                {
                  year: "PROJECT",
                  label: "PROJECT LEADERSHIP / FULL-STACK",
                  title: "Project lead / full-stack developer",
                  place: "HazelNet",
                  text: "Lead the flashcard and spaced-repetition platform while implementing across Blazor/MudBlazor, ASP.NET Core, and PostgreSQL. Connect FSRS scheduling, review history, analytics, and authentication through Clean Architecture and CQRS.",
                  tag: "Project direction + hands-on implementation",
                },
                {
                  year: "CAMPUS",
                  label: "TECHNOLOGY LEADERSHIP",
                  title: "Technology leadership",
                  place: "Google Developer Groups on Campus · Bicol University",
                  text: "Contribute technology leadership within Bicol University’s GDG on Campus community, alongside hands-on software development and computer science studies.",
                  tag: "Campus technology community",
                },
                {
                  year: "2026",
                  label: "HACKATHON",
                  title: "Building for disaster resilience",
                  place: "Unleash Hack Legazpi",
                  text: "Collaborated in a team-based hackathon exploring technology to enhance disaster resilience in cities.",
                  tag: "Team collaboration",
                },
                {
                  year: "2025",
                  label: "CAPTURE THE FLAG",
                  title: "Thinking on the other side",
                  place: "Hack4Gov · Team 404Overflow",
                  text: "Put security fundamentals into practice in a regional CTF, working through unfamiliar challenges under competition constraints.",
                  tag: "4th overall, regionals · 10th individually",
                },
                {
                  year: "2025",
                  label: "HACKATHON",
                  title: "Technology meets real-world UX",
                  place: "KadaCareer × Home Credit · HackAda",
                  text: "Participated in a team-based hackathon focused on AI, user experience, and practical problem-solving in fintech.",
                  tag: "AI in UX for fintech",
                },
              ].map((item) => (
                <article className="timeline-item" key={item.title}>
                  <span className="timeline-year">{item.year}</span>
                  <div className="timeline-content">
                    <p className="eyebrow">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p className="timeline-place">{item.place}</p>
                    <p className="timeline-description">{item.text}</p>
                    <span className="timeline-tag">{item.tag}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="expertise-section" id="expertise">
          <div className="container section">
            <SectionHeading
              number="03"
              label="TOOLKIT & MINDSET"
              title={
                <>
                  Depth over buzzwords<span className="accent">.</span>
                </>
              }
            >
              <p className="section-description">
                Tools I build with.
                <br />
                Perspectives I’m growing into.
              </p>
            </SectionHeading>
            <SkillConstellation light={theme === "light"} />
            <div className="expertise-grid">
              {[
                {
                  icon: "code",
                  index: "01",
                  title: "Application engineering",
                  text: "Primary stack: C# and .NET. Build across the UI, API, and data layer with a focus on maintainable application boundaries.",
                  tags: [
                    "C#",
                    ".NET",
                    "ASP.NET Core",
                    "Blazor",
                    "MudBlazor",
                    "EF Core",
                    "SQL",
                    "PostgreSQL",
                    "MySQL",
                    "SQLite",
                    "Git",
                  ],
                },
                {
                  icon: "shield",
                  index: "02",
                  title: "Security-minded thinking",
                  text: "Develop an application-security perspective through authorized PortSwigger labs, vulnerability-assessment practice, and CTF challenges.",
                  tags: [
                    "PortSwigger labs",
                    "Burp Suite",
                    "Nmap",
                    "Linux",
                    "Wireshark",
                    "CTFs",
                  ],
                },
                {
                  icon: "layers",
                  index: "03",
                  title: "Under the hood",
                  text: "Additional languages and foundations: explore document-processing research, Java application design, C tokenization, and Rust fundamentals.",
                  tags: [
                    "Python",
                    "Java",
                    "C",
                    "Rust fundamentals",
                    "OOP",
                    "Language fundamentals",
                  ],
                },
              ].map((item) => (
                <article className="expertise-card" key={item.title}>
                  <div className="expertise-card-top">
                    <span className="expertise-icon">
                      <Icon name={item.icon} size={25} />
                    </span>
                    <span className="mono">{item.index}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <div className="tags">
                    {item.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div className="mindset-note">
              <span className="status-dot" />
              <p>
                Not an expert in everything.{" "}
                <strong>Intentional about what I learn next.</strong>
              </p>
              <span className="mono">MINDSET &gt; TOOLSET</span>
            </div>
          </div>
        </section>

        <section className="about-section section container" id="about">
          <div className="about-grid">
            <div>
              <p className="eyebrow">
                <span>04 /</span> THE PERSON BEHIND THE CODE
              </p>
              <h2>
                Curiosity is
                <br />
                the constant<span className="accent">.</span>
              </h2>
              <div className="about-signature">
                Vhon<span> / Xhyther</span>
              </div>
              <p className="about-location">
                <Icon name="location" size={15} /> Bicol, Philippines
              </p>
            </div>
            <div className="about-content">
              <p className="about-lead">
                I’m Vhon, a Computer Science student who likes knowing not just{" "}
                <em>that</em> something works, but <em>why</em> it works.
              </p>
              <p>
                I'm passionate about both software engineering and
                cybersecurity—building systems that solve real problems,
                understanding how they work, and exploring how to make them more
                secure and resilient.
              </p>
              <p>
                My goal is to grow into an engineer who bridges development and
                security, creating software that's not only functional and
                well-designed, but built to withstand real-world challenges.
              </p>
              <div className="education-card">
                <div className="education-top">
                  <span className="mono">EDUCATION</span>
                  <span className="education-year">EXPECTED 2027</span>
                </div>
                <h3>B.S. Computer Science</h3>
                <p>
                  Bicol University <span>·</span> Philippines
                </p>
                <div className="education-honors">
                  <p>
                    <Icon name="check" size={13} /> CHED Merit Scholarship
                    Program scholar
                  </p>
                  <p>
                    <Icon name="check" size={13} /> Consistent Dean’s Lister
                  </p>
                </div>
              </div>
              <section
                className="achievements"
                aria-labelledby="achievements-heading"
              >
                <div className="achievements-heading">
                  <h3 id="achievements-heading">Achievements & Recognition</h3>
                  <ExternalLink href={GITHUB} className="icon-button">
                    <span className="sr-only">
                      View competition recognition on GitHub
                    </span>
                    <Icon name="diagonal" size={16} />
                  </ExternalLink>
                </div>
                <div className="achievement-list">
                  <article
                    className="achievement-card"
                    aria-labelledby="innolab-award-title"
                  >
                    <div className="achievement-top">
                      <span className="mono">AWARD 01</span>
                      <Icon name="trophy" size={18} />
                    </div>
                    <h4 id="innolab-award-title">InnoLab Hackathon 2026</h4>
                    <p className="achievement-placement">1st Runner-Up</p>
                    <p className="achievement-team">
                      Team Leanux <span>·</span> PaLEAsta!
                    </p>
                    <div className="achievement-details">
                      <p>
                        <time dateTime="2026-10-26">October 26</time>–
                        <time dateTime="2026-10-27">27, 2026</time>
                      </p>
                      <p>Ateneo de Naga University</p>
                    </div>
                  </article>
                  <article
                    className="achievement-card"
                    aria-labelledby="hack4gov-award-title"
                  >
                    <div className="achievement-top">
                      <span className="mono">AWARD 02</span>
                      <Icon name="trophy" size={18} />
                    </div>
                    <h4 id="hack4gov-award-title">Hack4Gov 2025</h4>
                    <p className="achievement-placement">
                      4th Overall — Regionals
                    </p>
                    <p className="achievement-individual">
                      Top 10 Individual Placement
                    </p>
                    <p className="achievement-team">Team 404Overflow</p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="container contact-inner">
            <div className="contact-top">
              <p className="eyebrow">
                <span>05 /</span> WHAT’S NEXT?
              </p>
              <span className="availability">
                <span className="status-dot" /> Open to opportunities
              </span>
            </div>
            <div className="contact-main">
              <div>
                <h2>
                  Good software starts
                  <br />
                  with a conversation<span className="accent">.</span>
                </h2>
                <p>
                  Have an internship, a role, or an interesting problem?
                  <br className="desktop-break" /> I’d love to hear about it.
                </p>
                <ExternalLink
                  href={GITHUB}
                  className="contact-github text-link"
                >
                  <Icon name="github" size={19} /> Explore my GitHub{" "}
                  <Icon name="diagonal" size={16} />
                </ExternalLink>
              </div>
              <a
                className="contact-circle"
                href="mailto:vhontabalan@gmail.com"
                aria-label="Email Vhon Michael Tabalan"
              >
                <Icon name="diagonal" size={42} />
              </a>
            </div>
            <div className="contact-links">
              <a href="mailto:vhontabalan@gmail.com" className="email-link">
                vhontabalan@gmail.com <Icon name="diagonal" size={19} />
              </a>
              <CopyButton value="vhontabalan@gmail.com" label="Copy email" />
              <div className="social-links">
                <ExternalLink href={GITHUB}>
                  GitHub <Icon name="diagonal" size={15} />
                </ExternalLink>
                <ExternalLink href={LINKEDIN}>
                  LinkedIn <Icon name="diagonal" size={15} />
                </ExternalLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="container site-footer">
        <a href="#home" className="footer-brand">
          vhon <span>/ xhyther.</span>
        </a>
        <p>Built with intention. Always a work in progress.</p>
        <a href="#home" className="back-top">
          Back to top <Icon name="down" size={14} />
        </a>
        <span className="copyright">
          © {new Date().getFullYear()} Vhon Michael Tabalan
        </span>
      </footer>
      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          close={() => setSelectedProject(null)}
        />
      )}
      {commandOpen && (
        <CommandPalette github={GITHUB} close={() => setCommandOpen(false)} />
      )}
      {menuOpen && (
        <Dialog
          labelId="mobile-menu-title"
          className="mobile-drawer"
          close={() => setMenuOpen(false)}
        >
          <div className="drawer-inner">
            <div className="drawer-heading">
              <p className="eyebrow">VHON / XHYTHER</p>
              <button
                className="icon-button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <h2 id="mobile-menu-title">
              Explore the portfolio<span className="accent">.</span>
            </h2>
            <nav id="mobile-navigation" aria-label="Mobile navigation">
              {[["home", "Home"], ...navLinks, ["contact", "Contact"]].map(
                ([id, name], index) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={activeSection === id ? "location" : undefined}
                    onClick={(event) => {
                      event.preventDefault()
                      setMenuOpen(false)
                      requestAnimationFrame(() => navigateToSection(id))
                    }}
                  >
                    <span className="mono" aria-hidden="true">
                      0{index + 1}
                    </span>
                    {name}
                    <Icon name="diagonal" size={20} />
                  </a>
                ),
              )}
            </nav>
            <button
              className="drawer-search"
              onClick={() => {
                setMenuOpen(false)
                setCommandOpen(true)
              }}
            >
              <Icon name="search" size={17} /> Search portfolio{" "}
              <kbd>Ctrl / ⌘ K</kbd>
            </button>
            <p className="drawer-note">
              Based in Bicol, Philippines.
              <br />
              Open to opportunities.
            </p>
          </div>
        </Dialog>
      )}
    </>
  )
}
