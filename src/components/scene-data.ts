export const skillClusters = [
  {
    id: "backend",
    name: "Backend",
    position: [-1.55, 0.9, 0.2],
    skills: ["C#", ".NET", "ASP.NET Core", "Blazor", "MudBlazor", "EF Core"],
    description:
      "Application development across .NET services and Blazor interfaces, with clear boundaries between presentation, application logic, and persistence.",
  },
  {
    id: "data",
    name: "Data",
    position: [1.5, 0.8, -0.35],
    skills: ["SQL", "PostgreSQL", "MySQL", "SQLite"],
    description:
      "Relational data and persistence for practical applications. These are tools in the portfolio, not proficiency scores or database certifications.",
  },
  {
    id: "security",
    name: "Security",
    position: [-1.4, -0.9, -0.3],
    skills: ["PortSwigger labs", "Burp Suite", "Nmap", "Wireshark", "CTFs"],
    description:
      "Authorized web-security labs, HTTP and network inspection, and CTF practice. A developing application-security perspective, not a claim of professional penetration-testing certification.",
  },
  {
    id: "systems",
    name: "Systems",
    position: [1.5, -0.85, 0.4],
    skills: [
      "Python",
      "Java",
      "C",
      "Rust fundamentals",
      "Linux",
      "Git",
      "OOP",
      "Language fundamentals",
    ],
    description:
      "Additional languages, developer tooling, and lower-level foundations. Rust is explicitly fundamentals-level; this grouping does not imply equal depth across every tool.",
  },
] as const

export type ClusterId = typeof skillClusters[number]["id"]
export type SceneKind = "core" | "constellation"

export interface SceneSettings {
  active: boolean
  animate: boolean
  reducedMotion: boolean
  lowPower: boolean
  light: boolean
  expanded: boolean
  selected: ClusterId
  highlighted: ClusterId | null
}

export interface SceneController {
  update: (settings: SceneSettings) => void
  rotate: (delta: number) => void
  reset: () => void
  dispose: () => void
}

export interface SceneCallbacks {
  ready: () => void
  failed: () => void
  toggle: () => void
  hover: (cluster: ClusterId | null, skill: string | null) => void
  select: (cluster: ClusterId) => void
}
