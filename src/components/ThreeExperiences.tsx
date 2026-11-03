import { useEffect, useRef, useState } from "react"
import { skillClusters } from "./scene-data"
import type {
  ClusterId,
  SceneCallbacks,
  SceneController,
  SceneKind,
  SceneSettings,
} from "./scene-data"

type PowerNavigator = Navigator & {
  deviceMemory?: number
  connection?: EventTarget & { saveData?: boolean }
}

function readRenderingPolicy() {
  if (typeof window === "undefined")
    return { reduced: true, lowPower: true, saveData: false }
  const device = navigator as PowerNavigator
  return {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    lowPower:
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.hardwareConcurrency <= 4 ||
      (device.deviceMemory !== undefined && device.deviceMemory <= 4),
    saveData: device.connection?.saveData === true,
  }
}

function useRenderingPolicy() {
  const [policy, setPolicy] = useState(readRenderingPolicy)
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const touch = window.matchMedia("(pointer: coarse)")
    const device = navigator as PowerNavigator
    const update = () => setPolicy(readRenderingPolicy())
    update()
    motion.addEventListener("change", update)
    touch.addEventListener("change", update)
    device.connection?.addEventListener("change", update)
    return () => {
      motion.removeEventListener("change", update)
      touch.removeEventListener("change", update)
      device.connection?.removeEventListener("change", update)
    }
  }, [])
  return policy
}

function useSceneRenderer(
  kind: SceneKind,
  settings: SceneSettings,
  callbacks: SceneCallbacks,
  saveData: boolean,
) {
  const root = useRef<HTMLDivElement>(null)
  const surface = useRef<HTMLDivElement>(null)
  const controller = useRef<SceneController | null>(null)
  const latest = useRef({ settings, callbacks })
  latest.current = { settings, callbacks }
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  )
  const [enabled, setEnabled] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const element = root.current
    if (!element) return
    const preload = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true)
          preload.disconnect()
        }
      },
      { rootMargin: "140px" },
    )
    const viewport = new IntersectionObserver(
      (entries) => {
        setVisible(entries.some((entry) => entry.isIntersecting))
      },
      { threshold: 0.01 },
    )
    preload.observe(element)
    viewport.observe(surface.current || element)
    return () => {
      preload.disconnect()
      viewport.disconnect()
    }
  }, [])
  useEffect(() => {
    controller.current?.update({ ...settings, active: visible })
  }, [
    settings.active,
    settings.animate,
    settings.reducedMotion,
    settings.lowPower,
    settings.light,
    settings.expanded,
    settings.selected,
    settings.highlighted,
    visible,
  ])
  useEffect(() => {
    if (!near || (saveData && !enabled)) {
      setStatus("loading")
      return
    }
    let cancelled = false
    let instance: SceneController | null = null
    setStatus("loading")
    const frame = requestAnimationFrame(() => {
      import("./three-scenes")
        .then(({ createScene }) => {
          if (cancelled || !surface.current) return
          try {
            instance = createScene(
              surface.current,
              kind,
              { ...latest.current.settings, active: false },
              {
                ready: () => {
                  if (!cancelled) setStatus("ready")
                },
                failed: () => {
                  if (!cancelled) {
                    setStatus("fallback")
                    instance?.dispose()
                    controller.current = null
                  }
                },
                toggle: () => latest.current.callbacks.toggle(),
                hover: (cluster, skill) =>
                  latest.current.callbacks.hover(cluster, skill),
                select: (cluster) => latest.current.callbacks.select(cluster),
              },
            )
            controller.current = instance
            instance.update({
              ...latest.current.settings,
              active: visibleRef.current,
            })
          } catch {
            if (!cancelled) {
              surface.current?.querySelector("canvas")?.remove()
              setStatus("fallback")
            }
          }
        })
        .catch(() => {
          if (!cancelled) setStatus("fallback")
        })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      instance?.dispose()
      controller.current = null
    }
  }, [near, saveData, enabled, kind, attempt])
  const visibleRef = useRef(visible)
  visibleRef.current = visible
  return {
    root,
    surface,
    controller,
    status: saveData && !enabled ? "loading" : status,
    visible,
    dataSaver: saveData && !enabled,
    enable: () => {
      setStatus("loading")
      setEnabled(true)
    },
    retry: () => setAttempt((value) => value + 1),
  }
}

interface CoreFallbackProps {
  expanded: boolean
  rotation: number
}

function CoreFallback({ expanded, rotation }: CoreFallbackProps) {
  return (
    <svg
      className="scene-fallback"
      viewBox="0 0 400 280"
      role="img"
      aria-label={`Engineering core diagram. BUILD, VERIFY, and SECURE layers ${
        expanded ? "separated" : "joined"
      }.`}
    >
      <g fill="none" stroke="var(--mint)" opacity=".3">
        <ellipse
          cx="190"
          cy="140"
          rx="150"
          ry="54"
          transform="rotate(-24 190 140)"
        />
        <ellipse
          cx="190"
          cy="140"
          rx="114"
          ry="102"
          transform="rotate(25 190 140)"
          strokeDasharray="2 6"
        />
      </g>
      <g transform={`rotate(${rotation * 9} 190 140)`}>
        <path
          d="m190 60 32 80-32 80-32-80Z"
          fill="none"
          stroke="var(--mint)"
          opacity=".7"
        />
        {["BUILD", "VERIFY", "SECURE"].map((name, index) => {
          const y = 92 + index * 43 + (expanded ? (index - 1) * 24 : 0)
          return (
            <g key={name}>
              <path
                d={`m125 ${y} 63-24 77 27-63 26Z`}
                fill="var(--surface-raised)"
                stroke="var(--mint)"
                strokeOpacity=".5"
              />
              <path
                d={`m125 ${y} 77 29v23l-77-29Zm77 29 63-26v23l-63 26Z`}
                fill="var(--bg)"
                stroke="var(--mint)"
                strokeOpacity=".35"
              />
              <text
                x="283"
                y={y + 16}
                fill="var(--mint)"
                fontFamily="monospace"
                fontSize="9"
              >
                {name}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

interface NetworkFallbackProps {
  selected: ClusterId
  rotation: number
}

function NetworkFallback({ selected, rotation }: NetworkFallbackProps) {
  return (
    <svg
      className="scene-fallback"
      viewBox="0 0 500 290"
      role="img"
      aria-label="Skill network diagram connecting Backend, Data, Security, and Systems. Use the skill buttons for all details."
    >
      <g transform={`rotate(${rotation * 9} 250 145)`}>
        <path
          d="M120 83 370 83 370 210 120 210Z M120 83 370 210 M120 210 370 83"
          fill="none"
          stroke="var(--mint)"
          opacity=".25"
        />
        {skillClusters.map((cluster, index) => {
          const x = index % 2 ? 370 : 120
          const y = index < 2 ? 83 : 210
          return (
            <g key={cluster.id}>
              <circle
                cx={x}
                cy={y}
                r={selected === cluster.id ? 10 : 7}
                fill={selected === cluster.id ? "var(--accent)" : "var(--mint)"}
              />
              <circle
                cx={x}
                cy={y}
                r="39"
                stroke="var(--mint)"
                fill="none"
                opacity=".25"
                strokeDasharray="2 6"
              />
              {cluster.skills.map((skill, i) => (
                <circle
                  key={skill}
                  cx={
                    x + Math.cos((i / cluster.skills.length) * Math.PI * 2) * 39
                  }
                  cy={
                    y + Math.sin((i / cluster.skills.length) * Math.PI * 2) * 39
                  }
                  r="3"
                  fill="var(--mint)"
                  opacity=".65"
                />
              ))}
              <text
                x={x}
                y={y - 52}
                textAnchor="middle"
                fill="var(--text)"
                fontFamily="monospace"
                fontSize="11"
              >
                {cluster.name.toUpperCase()}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

interface SceneStatusProps {
  status: string
  dataSaver: boolean
}

function SceneStatus({ status, dataSaver }: SceneStatusProps) {
  return (
    <span className="scene-state" role="status">
      {dataSaver
        ? "Data saver · 2D view"
        : status === "ready"
          ? "LIVE 3D"
          : status === "fallback"
            ? "2D fallback · WebGL unavailable"
            : "2D preview · loading 3D"}
    </span>
  )
}

export function SecureCore({ light }: { light: boolean }) {
  const policy = useRenderingPolicy()
  const [expanded, setExpanded] = useState(false)
  const [paused, setPaused] = useState(false)
  const [rotation, setRotation] = useState(0)
  const moving = !paused && !policy.reduced && !policy.lowPower
  const scene = useSceneRenderer(
    "core",
    {
      active: true,
      animate: moving,
      reducedMotion: policy.reduced,
      lowPower: policy.lowPower,
      light,
      expanded,
      selected: "backend",
      highlighted: null,
    },
    {
      ready: () => {},
      failed: () => {},
      toggle: () => setExpanded((value) => !value),
      hover: () => {},
      select: () => {},
    },
    policy.saveData,
  )
  function rotate(delta: number) {
    setRotation((value) => value + delta)
    scene.controller.current?.rotate(delta)
  }
  function reset() {
    setExpanded(false)
    setRotation(0)
    scene.controller.current?.reset()
  }
  return (
    <div
      className="secure-core scene-experience"
      ref={scene.root}
      data-scene="core"
      data-status={scene.status}
      data-active={scene.visible}
    >
      <div className="scene-heading">
        <span className="mono">SYS.01 / SECURE CORE</span>
        <SceneStatus status={scene.status} dataSaver={scene.dataSaver} />
      </div>
      <div
        className={`scene-surface core-surface ${
          scene.status === "ready" ? "scene-ready" : ""
        }`}
        tabIndex={0}
        role="group"
        aria-label="Interactive secure core view"
        aria-describedby="core-instructions"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault()
            rotate(event.key === "ArrowLeft" ? -0.35 : 0.35)
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            setExpanded((value) => !value)
          }
          if (event.key.toLowerCase() === "r") reset()
        }}
      >
        <CoreFallback expanded={expanded} rotation={rotation} />
        <div className="scene-canvas-host" ref={scene.surface} />
      </div>
      <p id="core-instructions" className="scene-instructions">
        {scene.status === "ready"
          ? "Drag to rotate. Click the core to separate its layers."
          : "Use the controls to rotate or separate the layers."}
        <span className="sr-only">
          {" "}
          With the view focused, use left/right arrows to rotate, Enter or Space
          to separate layers, and R to reset.
        </span>
      </p>
      <div className="core-layer-key" aria-label="Core layers">
        <span>01 BUILD</span>
        <span>02 VERIFY</span>
        <span>03 SECURE</span>
      </div>
      <div className="scene-controls" aria-label="Secure core controls">
        <button
          onClick={() => setExpanded((value) => !value)}
          aria-pressed={expanded}
        >
          {expanded ? "Rejoin layers" : "Separate layers"}
        </button>
        <button onClick={() => rotate(-0.35)} aria-label="Rotate core left">
          ←
        </button>
        <button onClick={() => rotate(0.35)} aria-label="Rotate core right">
          →
        </button>
        <button onClick={reset}>Reset view</button>
        {scene.status === "ready" && !policy.reduced && !policy.lowPower && (
          <button
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? "Resume rotation" : "Pause rotation"}
          </button>
        )}
      </div>
      <p className="scene-assist" role="status">
        {expanded
          ? "Layers separated: BUILD / VERIFY / SECURE."
          : "Layers joined: BUILD / VERIFY / SECURE."}
        {policy.reduced
          ? " Reduced motion: manual view."
          : policy.lowPower
            ? " Power-saving: manual view."
            : ""}
      </p>
      {(scene.dataSaver || scene.status === "fallback") && (
        <button
          className="scene-retry"
          onClick={scene.dataSaver ? scene.enable : scene.retry}
        >
          {scene.dataSaver ? "Enable 3D" : "Retry 3D"}
        </button>
      )}
    </div>
  )
}

export function SkillConstellation({ light }: { light: boolean }) {
  const policy = useRenderingPolicy()
  const [selected, setSelected] = useState<ClusterId>("backend")
  const [hovered, setHovered] = useState<ClusterId | null>(null)
  const [skill, setSkill] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)
  const [rotation, setRotation] = useState(0)
  const cluster = skillClusters.find((item) => item.id === selected)!
  const preview = skillClusters.find((item) => item.id === hovered) || cluster
  const scene = useSceneRenderer(
    "constellation",
    {
      active: true,
      animate: !paused && !policy.reduced && !policy.lowPower,
      reducedMotion: policy.reduced,
      lowPower: policy.lowPower,
      light,
      expanded: false,
      selected,
      highlighted: hovered,
    },
    {
      ready: () => {},
      failed: () => {},
      toggle: () => {},
      hover: (id, name) => {
        setHovered(id)
        setSkill(name)
      },
      select: (id) => {
        setSelected(id)
        setHovered(id)
        setSkill(null)
      },
    },
    policy.saveData,
  )
  function rotate(delta: number) {
    setRotation((value) => value + delta)
    scene.controller.current?.rotate(delta)
  }
  function reset() {
    setRotation(0)
    scene.controller.current?.reset()
  }
  return (
    <div
      className="skill-constellation scene-experience"
      ref={scene.root}
      data-scene="constellation"
      data-status={scene.status}
      data-active={scene.visible}
    >
      <div className="constellation-heading">
        <div>
          <p className="eyebrow">CONNECTED, NOT RANKED</p>
          <h3>
            A connected toolkit<span className="accent">.</span>
          </h3>
        </div>
        <SceneStatus status={scene.status} dataSaver={scene.dataSaver} />
      </div>
      <p className="constellation-intro">
        Explore four connected disciplines. Every skill is also listed below—no
        scores, percentages, or certifications implied.
      </p>
      <div className="constellation-layout">
        <div className="constellation-visual">
          <div
            className={`scene-surface network-surface ${
              scene.status === "ready" ? "scene-ready" : ""
            }`}
            tabIndex={0}
            role="group"
            aria-label="Interactive skill constellation view"
            aria-describedby="network-instructions"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault()
                rotate(event.key === "ArrowLeft" ? -0.2 : 0.2)
              }
              if (event.key.toLowerCase() === "r") reset()
            }}
          >
            <NetworkFallback selected={selected} rotation={rotation} />
            <div className="scene-canvas-host" ref={scene.surface} />
            <div className="network-tooltip" aria-live="polite">
              <span className="mono">{preview.name}</span>
              <strong>{skill || preview.skills.join(" · ")}</strong>
            </div>
          </div>
          <p id="network-instructions" className="scene-instructions">
            {scene.status === "ready"
              ? "Hover a node for its exact skill. Select a cluster to explore."
              : "Choose a discipline in the 2D skill list to explore its details."}
            <span className="sr-only">
              {" "}
              Use the buttons in the 2D skill list for equivalent keyboard and
              touch selection. With the view focused, left and right arrows
              rotate it and R resets it.
            </span>
          </p>
          <div
            className="scene-controls"
            aria-label="Constellation view controls"
          >
            <button
              aria-label="Rotate constellation left"
              onClick={() => rotate(-0.2)}
            >
              ←
            </button>
            <button
              aria-label="Rotate constellation right"
              onClick={() => rotate(0.2)}
            >
              →
            </button>
            <button onClick={reset}>Reset view</button>
            {scene.status === "ready" &&
              !policy.reduced &&
              !policy.lowPower && (
                <button
                  aria-pressed={paused}
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? "Resume motion" : "Pause motion"}
                </button>
              )}
            {(scene.dataSaver || scene.status === "fallback") && (
              <button onClick={scene.dataSaver ? scene.enable : scene.retry}>
                {scene.dataSaver ? "Enable 3D" : "Retry 3D"}
              </button>
            )}
          </div>
          {(policy.reduced || policy.lowPower) && (
            <p className="scene-assist">
              {policy.reduced ? "Reduced motion" : "Power-saving"}: renders only
              when you interact.
            </p>
          )}
        </div>
        <div className="cluster-list" aria-label="2D skill list">
          {skillClusters.map((item) => (
            <div
              className={`cluster-list-item ${
                selected === item.id ? "selected" : ""
              }`}
              key={item.id}
            >
              <button
                aria-pressed={selected === item.id}
                aria-controls="cluster-details"
                onClick={() => {
                  setSelected(item.id)
                  setHovered(item.id)
                  setSkill(null)
                }}
                onFocus={() => {
                  setHovered(item.id)
                  setSkill(null)
                }}
                onPointerEnter={() => {
                  setHovered(item.id)
                  setSkill(null)
                }}
                onPointerLeave={() => {
                  setHovered(null)
                  setSkill(null)
                }}
                onBlur={() => {
                  setHovered(null)
                  setSkill(null)
                }}
              >
                <span>{item.name}</span>
                <span aria-hidden="true">↗</span>
              </button>
              <ul>
                {item.skills.map((name) => (
                  <li
                    key={name}
                    className={skill === name ? "skill-highlight" : ""}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <section
        className="cluster-details"
        id="cluster-details"
        aria-labelledby="cluster-details-title"
        aria-live="polite"
      >
        <p className="eyebrow">SELECTED DISCIPLINE</p>
        <h4 id="cluster-details-title">{cluster.name}</h4>
        <p>{cluster.description}</p>
        <ul className="cluster-detail-tags">
          {cluster.skills.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
