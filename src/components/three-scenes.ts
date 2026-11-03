import * as THREE from "three"
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js"
import { skillClusters } from "./scene-data"
import type {
  ClusterId,
  SceneCallbacks,
  SceneController,
  SceneKind,
  SceneSettings,
} from "./scene-data"

// No models, HDR downloads, postprocessing, shadows, or custom shaders.
export function createScene(
  host: HTMLDivElement,
  kind: SceneKind,
  initial: SceneSettings,
  callbacks: SceneCallbacks,
): SceneController {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: !initial.lowPower,
    powerPreference: "low-power",
  })
  if (!context) throw new Error("WebGL2 unavailable")
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: !initial.lowPower,
    powerPreference: "low-power",
  })
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, initial.lowPower ? 1 : 1.5),
  )
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0, 0)
  canvas.setAttribute("aria-hidden", "true")
  canvas.setAttribute("tabindex", "-1")
  host.appendChild(canvas)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    kind === "core" ? 34 : 42,
    1,
    0.1,
    30,
  )
  camera.position.set(
    0,
    kind === "core" ? 0.3 : 0.05,
    kind === "core" ? 7.4 : 6.3,
  )
  camera.lookAt(0, 0, 0)
  const root = new THREE.Group()
  scene.add(root)
  const ambient = new THREE.HemisphereLight("#c7e3d7", "#18222a", 2.5)
  scene.add(ambient)
  const key = new THREE.DirectionalLight("#e5f1ec", 4)
  key.position.set(3, 4, 5)
  const rim = new THREE.DirectionalLight("#72d7bf", 3)
  rim.position.set(-4, 0.7, -2)
  scene.add(key, rim)
  const mint = new THREE.Color("#72d7bf")
  const pickables: THREE.Object3D[] = []
  const layers: THREE.Group[] = []
  const materials: THREE.Material[] = []
  const textures: THREE.Texture[] = []
  const groupNodes: {
    mesh: THREE.Mesh
    cluster: ClusterId
    label: THREE.Sprite
  }[] = []
  const coreLabels: THREE.Sprite[] = []
  const nodeMaterials: {
    material: THREE.MeshStandardMaterial
    cluster: ClusterId
  }[] = []
  const lineMaterials: THREE.LineBasicMaterial[] = []

  function label(text: string, color = "#bfddd0", width = 256) {
    const surface = document.createElement("canvas")
    surface.width = width
    surface.height = 64
    const context = surface.getContext("2d")
    if (!context) throw new Error("Canvas text unavailable")
    context.font = "500 24px monospace"
    context.textAlign = "center"
    context.textBaseline = "middle"
    context.fillStyle = color
    context.fillText(text, width / 2, 32)
    const texture = new THREE.CanvasTexture(surface)
    texture.colorSpace = THREE.SRGBColorSpace
    textures.push(texture)
    const material = new THREE.SpriteMaterial({
      map: texture,
      depthTest: false,
      transparent: true,
    })
    materials.push(material)
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(width === 256 ? 1.05 : 0.85, 0.24, 1)
    return sprite
  }

  if (kind === "core") {
    // A tiny, locally generated studio cubemap gives broad controlled reflections.
    if (!initial.lowPower) {
      const faces = Array.from({ length: 6 }, (_, index) => {
        const face = document.createElement("canvas")
        face.width = face.height = 32
        const context = face.getContext("2d")!
        const gradient = context.createLinearGradient(0, 0, 32, 32)
        gradient.addColorStop(0, "#101c24")
        gradient.addColorStop(0.38, index % 2 ? "#98b3ac" : "#314941")
        gradient.addColorStop(0.52, "#1c2e36")
        gradient.addColorStop(1, "#070e13")
        context.fillStyle = gradient
        context.fillRect(0, 0, 32, 32)
        return face
      })
      const environment = new THREE.CubeTexture(faces)
      environment.colorSpace = THREE.SRGBColorSpace
      environment.needsUpdate = true
      textures.push(environment)
      scene.environment = environment
    }
    const bodyGeometry = new RoundedBoxGeometry(1.5, 0.48, 1.22, 2, 0.085)
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: "#24353e",
      metalness: initial.lowPower ? 0.35 : 0.8,
      roughness: 0.36,
      envMapIntensity: 0.8,
    })
    const traceMaterial = new THREE.LineBasicMaterial({
      color: "#72d7bf",
      transparent: true,
      opacity: 0.55,
    })
    lineMaterials.push(traceMaterial)
    materials.push(bodyMaterial, traceMaterial)
    for (let index = 0; index < 3; index++) {
      const layer = new THREE.Group()
      layer.position.y = (1 - index) * 0.53
      const mesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
      mesh.userData.core = true
      pickables.push(mesh)
      const trace = new THREE.LineSegments(
        new THREE.EdgesGeometry(bodyGeometry, 32),
        traceMaterial,
      )
      const name = label(["BUILD", "VERIFY", "SECURE"][index])
      coreLabels.push(name)
      name.position.set(1.35, 0.02, 0)
      name.scale.set(0.94, 0.23, 1)
      layer.add(mesh, trace, name)
      layers.push(layer)
      root.add(layer)
    }
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: "#72d7bf",
      emissive: "#72d7bf",
      emissiveIntensity: 0.65,
      roughness: 0.6,
      metalness: 0.15,
      wireframe: true,
    })
    materials.push(innerMaterial)
    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      innerMaterial,
    )
    inner.scale.set(0.75, 1.6, 0.75)
    root.add(inner)
    const spindle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.035, 1.9, 8),
      innerMaterial,
    )
    root.add(spindle)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#72d7bf",
      transparent: true,
      opacity: 0.47,
    })
    materials.push(ringMaterial)
    for (let index = 0; index < 2; index++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(
          1.63 + index * 0.13,
          0.008,
          4,
          initial.lowPower ? 48 : 80,
        ),
        ringMaterial,
      )
      ring.rotation.set(0.9 + index * 0.8, index * 0.5, 0.35)
      root.add(ring)
    }
    const positions = new Float32Array((initial.lowPower ? 12 : 24) * 3)
    for (let index = 0; index < positions.length / 3; index++) {
      const angle = index * 2.399
      positions[index * 3] = Math.cos(angle) * (1.9 + (index % 3) * 0.15)
      positions[index * 3 + 1] = Math.sin(angle * 1.7) * 1.65
      positions[index * 3 + 2] = Math.sin(angle) * 1.1
    }
    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    )
    const particlesMaterial = new THREE.PointsMaterial({
      color: "#b8f28b",
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })
    materials.push(particlesMaterial)
    root.add(new THREE.Points(particlesGeometry, particlesMaterial))
  } else {
    const connections: number[] = []
    const sphere = new THREE.SphereGeometry(1, 10, 8)
    skillClusters.forEach((cluster, clusterIndex) => {
      const center = new THREE.Vector3(...cluster.position)
      const groupMaterial = new THREE.MeshStandardMaterial({
        color: "#72d7bf",
        roughness: 0.55,
        metalness: 0.15,
        emissive: "#72d7bf",
        emissiveIntensity: 0.1,
      })
      materials.push(groupMaterial)
      nodeMaterials.push({ material: groupMaterial, cluster: cluster.id })
      const mesh = new THREE.Mesh(sphere, groupMaterial)
      mesh.scale.setScalar(0.13)
      mesh.position.copy(center)
      mesh.userData.cluster = cluster.id
      mesh.userData.skill = null
      pickables.push(mesh)
      root.add(mesh)
      const name = label(cluster.name.toUpperCase())
      name.position.copy(center).add(new THREE.Vector3(0, 0.31, 0))
      root.add(name)
      groupNodes.push({ mesh, cluster: cluster.id, label: name })
      cluster.skills.forEach((skill, index) => {
        const angle =
          (index / cluster.skills.length) * Math.PI * 2 + clusterIndex * 0.4
        const node = new THREE.Mesh(sphere, groupMaterial)
        node.scale.setScalar(0.057)
        node.position
          .copy(center)
          .add(
            new THREE.Vector3(
              Math.cos(angle) * 0.53,
              Math.sin(angle) * 0.45,
              Math.sin(index * 1.8) * 0.43,
            ),
          )
        node.userData.cluster = cluster.id
        node.userData.skill = skill
        pickables.push(node)
        root.add(node)
        connections.push(...center.toArray(), ...node.position.toArray())
      })
      const next = skillClusters[(clusterIndex + 1) % skillClusters.length]
      connections.push(...center.toArray(), ...next.position)
    })
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connections, 3),
    )
    const material = new THREE.LineBasicMaterial({
      color: "#72d7bf",
      transparent: true,
      opacity: 0.27,
    })
    lineMaterials.push(material)
    materials.push(material)
    root.add(new THREE.LineSegments(geometry, material))
  }

  let settings = initial
  let disposed = false
  let frame = 0
  let previousTime = 0
  let spin = 0
  let yaw = kind === "core" ? -0.5 : 0
  let pitch = kind === "core" ? 0.15 : 0
  let tiltX = 0
  let tiltY = 0
  let shownExpanded = initial.expanded ? 1 : 0
  let firstFrame = true
  let dragging = false
  let pointerId = -1
  let lastX = 0
  let lastY = 0
  let distance = 0
  let hoveredKey = ""
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function schedule() {
    if (!disposed && settings.active && !document.hidden && !frame)
      frame = requestAnimationFrame(draw)
  }
  function draw(time: number) {
    frame = 0
    if (disposed || !settings.active || document.hidden) return
    const delta = Math.min((time - (previousTime || time)) / 1000, 0.04)
    previousTime = time
    const moving =
      settings.animate &&
      !settings.reducedMotion &&
      !settings.lowPower &&
      !dragging
    if (moving) spin += delta * (kind === "core" ? 0.075 : 0.025)
    const ease = settings.reducedMotion ? 1 : 1 - Math.exp(-delta * 8)
    const targetY = yaw + spin + (settings.reducedMotion ? 0 : tiltY)
    const targetX = pitch + (settings.reducedMotion ? 0 : tiltX)
    root.rotation.y += (targetY - root.rotation.y) * (firstFrame ? 1 : ease)
    root.rotation.x += (targetX - root.rotation.x) * (firstFrame ? 1 : ease)
    const wantedExpansion = settings.expanded ? 1 : 0
    shownExpanded += (wantedExpansion - shownExpanded) * (firstFrame ? 1 : ease)
    layers.forEach((layer, index) => {
      layer.position.y = (1 - index) * (0.53 + shownExpanded * 0.42)
    })
    nodeMaterials.forEach(({ material, cluster }) => {
      const focused = cluster === (settings.highlighted || settings.selected)
      material.color.set(
        focused
          ? settings.light
            ? "#396e28"
            : "#b8f28b"
          : settings.light
            ? "#217463"
            : "#72d7bf",
      )
      material.emissiveIntensity = focused ? 0.28 : 0.04
    })
    groupNodes.forEach(({ mesh, cluster, label: name }) => {
      mesh.scale.setScalar(cluster === settings.selected ? 0.17 : 0.13)
      name.material.color.set(settings.light ? "#243c32" : "#d4e7de")
    })
    coreLabels.forEach((name) =>
      name.material.color.set(settings.light ? "#243c32" : "#ffffff"),
    )
    lineMaterials.forEach((material) =>
      material.color.copy(settings.light ? new THREE.Color("#217463") : mint),
    )
    ambient.intensity = settings.light ? 3.2 : 2.5
    // Data attributes support lightweight runtime QA without exposing a debug UI.
    canvas.dataset.rotation = root.rotation.y.toFixed(3)
    canvas.dataset.expansion = shownExpanded.toFixed(3)
    canvas.dataset.selected = settings.selected
    try {
      renderer.render(scene, camera)
      if (firstFrame) {
        firstFrame = false
        callbacks.ready()
      }
    } catch {
      callbacks.failed()
      return
    }
    const settling =
      Math.abs(targetY - root.rotation.y) +
        Math.abs(targetX - root.rotation.x) +
        Math.abs(wantedExpansion - shownExpanded) >
      0.0005
    if (moving || settling) schedule()
  }
  function pick(event: PointerEvent) {
    const bounds = host.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      (-(event.clientY - bounds.top) / bounds.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    return raycaster.intersectObjects(pickables, false)[0]?.object || null
  }
  function pointerDown(event: PointerEvent) {
    if (event.button !== 0 || dragging) return
    dragging = true
    pointerId = event.pointerId
    distance = 0
    lastX = event.clientX
    lastY = event.clientY
    host.setPointerCapture(event.pointerId)
    host.classList.add("is-dragging")
  }
  function pointerMove(event: PointerEvent) {
    if (dragging && event.pointerId === pointerId) {
      const x = event.clientX - lastX
      const y = event.clientY - lastY
      distance += Math.abs(x) + Math.abs(y)
      yaw += x * 0.008
      pitch = THREE.MathUtils.clamp(pitch + y * 0.005, -0.65, 0.65)
      lastX = event.clientX
      lastY = event.clientY
    } else if (event.pointerType !== "touch") {
      const bounds = host.getBoundingClientRect()
      tiltY =
        ((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 0.18
      tiltX =
        ((event.clientY - bounds.top - bounds.height / 2) / bounds.height) *
        0.12
      const hit = pick(event)
      const key = `${hit?.userData.cluster || ""}:${hit?.userData.skill || ""}`
      if (kind === "constellation" && key !== hoveredKey) {
        hoveredKey = key
        callbacks.hover(
          hit?.userData.cluster || null,
          hit?.userData.skill || null,
        )
      }
      host.style.cursor = hit ? "pointer" : "grab"
    }
    schedule()
  }
  function pointerUp(event: PointerEvent) {
    if (!dragging || event.pointerId !== pointerId) return
    dragging = false
    host.classList.remove("is-dragging")
    if (host.hasPointerCapture(event.pointerId))
      host.releasePointerCapture(event.pointerId)
    if (distance < 7) {
      const hit = pick(event)
      if (hit && kind === "core") callbacks.toggle()
      else if (hit?.userData.cluster) callbacks.select(hit.userData.cluster)
    }
    schedule()
  }
  function cancelDrag() {
    dragging = false
    host.classList.remove("is-dragging")
    schedule()
  }
  function pointerLeave() {
    tiltX = tiltY = 0
    if (kind === "constellation") {
      hoveredKey = ""
      callbacks.hover(null, null)
    }
    schedule()
  }
  function resize() {
    if (disposed) return
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    schedule()
  }
  function visibility() {
    previousTime = 0
    if (document.hidden) {
      cancelAnimationFrame(frame)
      frame = 0
    } else schedule()
  }
  function contextLost(event: Event) {
    event.preventDefault()
    cancelAnimationFrame(frame)
    frame = 0
    callbacks.failed()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  host.addEventListener("pointerdown", pointerDown)
  host.addEventListener("pointermove", pointerMove)
  host.addEventListener("pointerup", pointerUp)
  host.addEventListener("pointercancel", cancelDrag)
  host.addEventListener("pointerleave", pointerLeave)
  canvas.addEventListener("webglcontextlost", contextLost)
  document.addEventListener("visibilitychange", visibility)
  resize()

  return {
    update(next) {
      const qualityChanged = next.lowPower !== settings.lowPower
      settings = next
      if (qualityChanged) {
        renderer.setPixelRatio(
          Math.min(window.devicePixelRatio || 1, next.lowPower ? 1 : 1.5),
        )
        resize()
      }
      canvas.dataset.running = String(
        next.active && next.animate && !next.reducedMotion && !next.lowPower,
      )
      if (!next.active) {
        cancelAnimationFrame(frame)
        frame = 0
        previousTime = 0
      }
      schedule()
    },
    rotate(delta) {
      yaw += delta
      schedule()
    },
    reset() {
      yaw = kind === "core" ? -0.5 : 0
      pitch = kind === "core" ? 0.15 : 0
      spin = tiltX = tiltY = 0
      schedule()
    },
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener("visibilitychange", visibility)
      host.removeEventListener("pointerdown", pointerDown)
      host.removeEventListener("pointermove", pointerMove)
      host.removeEventListener("pointerup", pointerUp)
      host.removeEventListener("pointercancel", cancelDrag)
      host.removeEventListener("pointerleave", pointerLeave)
      canvas.removeEventListener("webglcontextlost", contextLost)
      const geometries = new Set<THREE.BufferGeometry>()
      scene.traverse((object) => {
        if (
          "geometry" in object &&
          object.geometry instanceof THREE.BufferGeometry
        )
          geometries.add(object.geometry)
      })
      geometries.forEach((geometry) => geometry.dispose())
      new Set(materials).forEach((material) => material.dispose())
      textures.forEach((texture) => texture.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
      host.style.cursor = ""
      host.classList.remove("is-dragging")
    },
  }
}
