"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"

// ── External assets ─────────────────────────────────────────────────────────
// Equirectangular world map from Wikimedia Commons (public domain).
// Update this constant if the URL needs to change — do NOT scatter raw URLs.
const MAP_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2560px-World_map_-_low_resolution.svg.png"

// ── City list ───────────────────────────────────────────────────────────────
// `mobile` = shown on small screens (< 640 px wide); must be geographically spread.
const CITIES_ALL = [
  { name: "San Francisco", lat: 37.7749,  lng: -122.4194, mobile: true  },
  { name: "New York",      lat: 40.7128,  lng: -74.0060,  mobile: false },
  { name: "London",        lat: 51.5074,  lng: -0.1278,   mobile: true  },
  { name: "Tokyo",         lat: 35.6762,  lng: 139.6503,  mobile: true  },
  { name: "Sydney",        lat: -33.8688, lng: 151.2093,  mobile: true  },
  { name: "São Paulo",     lat: -23.5505, lng: -46.6333,  mobile: false },
  { name: "Singapore",     lat: 1.3521,   lng: 103.8198,  mobile: true  },
  { name: "Dubai",         lat: 25.2048,  lng: 55.2708,   mobile: false },
  { name: "Moscow",        lat: 55.7558,  lng: 37.6173,   mobile: false },
  { name: "Mumbai",        lat: 19.0760,  lng: 72.8777,   mobile: false },
  { name: "Berlin",        lat: 52.5200,  lng: 13.4050,   mobile: false },
  { name: "Paris",         lat: 48.8566,  lng: 2.3522,    mobile: false },
  { name: "Cairo",         lat: 30.0444,  lng: 31.2357,   mobile: false },
  { name: "Beijing",       lat: 39.9042,  lng: 116.4074,  mobile: false },
  { name: "Toronto",       lat: 43.6532,  lng: -79.3832,  mobile: false },
  { name: "Lagos",         lat: 6.5244,   lng: 3.3792,    mobile: false },
  { name: "Seoul",         lat: 37.5665,  lng: 126.9780,  mobile: false },
  { name: "Mexico City",   lat: 19.4326,  lng: -99.1332,  mobile: false },
  { name: "Istanbul",      lat: 41.0082,  lng: 28.9784,   mobile: false },
  { name: "Buenos Aires",  lat: -34.6037, lng: -58.3816,  mobile: false },
]

interface AttackArc {
  id: string
  sx: number; sy: number
  ex: number; ey: number
  color: string
  progress: number
  tail: number
  alive: boolean
  // destination lat/lng kept for city-hit detection
  dLat: number; dLng: number
}

interface HitPulse {
  x: number; y: number
  r: number; alpha: number
  color: string
}

// Cities that are currently "lit" after being hit
interface LitCity {
  alpha: number    // label glow fade 1→0
  color: string
  ringR: number    // expanding ring radius
  ringA: number    // ring alpha
}

// Find the closest city in CITIES_ALL to a lat/lng, within threshold degrees
function nearestCity(lat: number, lng: number, threshold = 18) {
  let best: typeof CITIES_ALL[0] | null = null
  let bestD = Infinity
  for (const c of CITIES_ALL) {
    const d = Math.hypot(c.lat - lat, c.lng - lng)
    if (d < bestD) { bestD = d; best = c }
  }
  return bestD <= threshold ? best : null
}

function latLngToXY(lat: number, lng: number, w: number, h: number) {
  return { x: ((lng + 180) / 360) * w, y: ((90 - lat) / 180) * h }
}

function bezierPt(t: number, ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
  const m = 1 - t
  return { x: m*m*ax + 2*m*t*bx + t*t*cx, y: m*m*ay + 2*m*t*by + t*t*cy }
}

function ctrlPt(sx: number, sy: number, ex: number, ey: number) {
  return { x: (sx + ex) / 2, y: (sy + ey) / 2 - Math.abs(ex - sx) * 0.3 - 30 }
}

// ── Globe props: "bg" = full-screen background, "card" = contained card ───────
export function Globe({ mode = "bg" }: { mode?: "bg" | "card" }) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const arcsRef      = useRef<AttackArc[]>([])
  const pulsesRef    = useRef<HitPulse[]>([])
  const litRef        = useRef<Map<string, LitCity>>(new Map())
  const countRef     = useRef(0)
  const realDataRef  = useRef(false)
  const rafRef       = useRef<number>(0)
  const mapRef       = useRef<HTMLImageElement | null>(null)
  const [count, setCount]       = useState(0)
  const [imgReady, setImgReady] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme !== "light"

  // ── Load map image ────────────────────────────────────────────────────────
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = MAP_IMAGE_URL
    img.onload  = () => { mapRef.current = img; setImgReady(true) }
    img.onerror = () => setImgReady(true)
  }, [])

  // ── Add an arc ────────────────────────────────────────────────────────────
  const addAttack = useCallback((
    sLat: number, sLng: number,
    dLat: number, dLng: number,
    color: string
  ) => {
    const c = canvasRef.current
    if (!c) return
    const s = latLngToXY(sLat, sLng, c.width, c.height)
    const e = latLngToXY(dLat, dLng, c.width, c.height)
    arcsRef.current.push({
      id: Math.random().toString(36).slice(2),
      sx: s.x, sy: s.y, ex: e.x, ey: e.y,
      color, progress: 0, tail: 0, alive: true,
      dLat, dLng,
    })
    countRef.current++
    setCount(countRef.current)
  }, [])

  // ── Fallback mock arcs ────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (realDataRef.current) return
      const a = CITIES_ALL[Math.floor(Math.random() * CITIES_ALL.length)]
      let b = CITIES_ALL[Math.floor(Math.random() * CITIES_ALL.length)]
      while (b === a) b = CITIES_ALL[Math.floor(Math.random() * CITIES_ALL.length)]
      const cols = ["#00e5ff","#ff6600","#ff2244","#22ff88"]
      addAttack(a.lat, a.lng, b.lat, b.lng, cols[Math.floor(Math.random() * cols.length)])
    }, 1600)
    return () => clearInterval(id)
  }, [addAttack])

  // ── Live Check Point SSE feed ─────────────────────────────────────────────
  useEffect(() => {
    const es = new EventSource("/api/threat")
    const handle = (e: MessageEvent) => {
      try {
        const d = JSON.parse(e.data)
        if (typeof d.s_la === "number" && typeof d.d_la === "number") {
          realDataRef.current = true
          let col = "#00e5ff"
          if (d.a_t === "exploit") col = "#ff6600"
          if (d.a_t === "malware") col = "#ff2244"
          addAttack(d.s_la, d.s_lo, d.d_la, d.d_lo, col)
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Globe] failed to parse attack event:", err)
        }
      }
    }
    es.addEventListener("attack", handle)
    es.onmessage = handle
    es.onerror = () => es.close()
    return () => { es.removeEventListener("attack", handle); es.close() }
  }, [addAttack])

  // ── Canvas render loop ────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const el = containerRef.current
      if (!el) return
      canvas.width  = el.clientWidth
      canvas.height = el.clientHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (containerRef.current) ro.observe(containerRef.current)

    const SPEED = 0.009
    const TAIL_SPD = 0.011

    const frame = () => {
      const w = canvas.width, h = canvas.height
      if (!w || !h) { rafRef.current = requestAnimationFrame(frame); return }

      const isMobile = w < 640

      // ── Background ────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h)

      if (isDark) {
        // Deep navy base
        ctx.fillStyle = "#061220"
        ctx.fillRect(0, 0, w, h)

        if (mapRef.current) {
          // Draw map bright, then colour it
          ctx.save()
          ctx.globalAlpha = 0.55
          ctx.drawImage(mapRef.current, 0, 0, w, h)
          ctx.restore()

          // Cyan/teal screen blend to bring out the map in dark mode
          ctx.save()
          ctx.globalCompositeOperation = "screen"
          ctx.globalAlpha = 0.45
          ctx.fillStyle = "#00668a"
          ctx.fillRect(0, 0, w, h)
          ctx.restore()
        } else {
          // Subtle grid fallback
          ctx.strokeStyle = "rgba(0,180,255,0.1)"
          ctx.lineWidth = 0.5
          for (let lng = -180; lng <= 180; lng += 30) {
            const x = ((lng + 180) / 360) * w
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
          }
          for (let lat = -90; lat <= 90; lat += 30) {
            const y = ((90 - lat) / 180) * h
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
          }
        }
      } else {
        // Light blue-grey ocean base
        ctx.fillStyle = "#b8d8ee"
        ctx.fillRect(0, 0, w, h)
        if (mapRef.current) {
          ctx.save()
          ctx.globalAlpha = 0.9
          ctx.drawImage(mapRef.current, 0, 0, w, h)
          ctx.restore()
          // Slight cool-blue tint over the light map
          ctx.save()
          ctx.globalAlpha = 0.12
          ctx.fillStyle = "#0066aa"
          ctx.fillRect(0, 0, w, h)
          ctx.restore()
        }
      }

      // ── City dots + labels ────────────────────────────────────────────────
      const cities = isMobile ? CITIES_ALL.filter(c => c.mobile) : CITIES_ALL
      const dotCol  = isDark ? "#00e5ff" : "#005599"
      const ringCol = isDark ? "rgba(0,229,255,0.3)" : "rgba(0,85,153,0.25)"
      const lblBase = isDark ? "rgba(140,220,255,0.75)" : "rgba(0,34,68,0.8)"
      // Mobile: smaller font so labels fit; desktop: proportional
      const lblSize = isMobile ? 8 : Math.max(9, Math.min(11, w / 72))

      // Tick down lit-city effects
      litRef.current.forEach((lit, name) => {
        lit.alpha  = Math.max(0, lit.alpha  - 0.006)
        lit.ringA  = Math.max(0, lit.ringA  - 0.012)
        lit.ringR += isMobile ? 1.2 : 1.5
        if (lit.alpha <= 0) litRef.current.delete(name)
      })

      cities.forEach(city => {
        const { x, y } = latLngToXY(city.lat, city.lng, w, h)
        const lit = litRef.current.get(city.name)

        // ── Lit expanding ring (Check Point style) ─────────────────────────
        if (lit && lit.ringA > 0) {
          ctx.beginPath()
          ctx.arc(x, y, lit.ringR, 0, Math.PI * 2)
          ctx.strokeStyle = lit.color
          ctx.globalAlpha = lit.ringA * 0.7
          ctx.lineWidth = isMobile ? 1 : 1.5
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // ── Outer idle ring ────────────────────────────────────────────────
        ctx.beginPath()
        ctx.arc(x, y, isMobile ? 4 : 5, 0, Math.PI * 2)
        ctx.strokeStyle = lit ? lit.color : ringCol
        ctx.globalAlpha = lit ? 0.9 : 1
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.globalAlpha = 1

        // ── Centre dot ────────────────────────────────────────────────────
        ctx.beginPath()
        ctx.arc(x, y, isMobile ? 2.5 : 2.5, 0, Math.PI * 2)
        ctx.fillStyle = lit ? lit.color : dotCol
        ctx.fill()

        // ── Label (always shown; glows when lit) ──────────────────────────
        const fontSize = lblSize
        ctx.font = `bold ${fontSize}px monospace`
        ctx.textAlign = "center"
        ctx.textBaseline = "top"
        const ty = y + (isMobile ? 6 : 8)

        if (lit && lit.alpha > 0) {
          // Glowing lit label
          ctx.shadowColor = lit.color
          ctx.shadowBlur  = 8
          ctx.fillStyle   = lit.color
          ctx.globalAlpha = 0.5 + lit.alpha * 0.5
          ctx.fillText(city.name, x, ty)
          ctx.shadowBlur  = 0
          ctx.globalAlpha = 1
        } else {
          // Normal label with tiny background pill for readability
          const tw = ctx.measureText(city.name).width
          const pad = 2
          ctx.fillStyle = isDark ? "rgba(4,12,28,0.65)" : "rgba(220,235,250,0.7)"
          ctx.beginPath()
          ctx.roundRect(
            x - tw / 2 - pad, ty - 1,
            tw + pad * 2, fontSize + 2,
            2
          )
          ctx.fill()
          ctx.fillStyle = lblBase
          ctx.fillText(city.name, x, ty)
        }
      })

      // ── Arcs ────────────────────────────────────────────────────────────
      arcsRef.current = arcsRef.current.filter(a => a.alive)
      arcsRef.current.forEach(arc => {
        const { sx, sy, ex, ey } = arc
        const { x: cx, y: cy } = ctrlPt(sx, sy, ex, ey)

        arc.progress = Math.min(1, arc.progress + SPEED)
        if (arc.progress >= 1) arc.tail = Math.min(1, arc.tail + TAIL_SPD)
        if (arc.progress >= 1 && arc.tail >= 1) {
          arc.alive = false
          pulsesRef.current.push({ x: ex, y: ey, r: 3, alpha: 1, color: arc.color })
          // Light up the nearest destination city
          const hit = nearestCity(arc.dLat, arc.dLng)
          if (hit) {
            litRef.current.set(hit.name, { alpha: 1, color: arc.color, ringR: 2, ringA: 1 })
          }
          return
        }

        const hT = arc.progress
        const tT = arc.progress >= 1 ? arc.tail : Math.max(0, arc.progress - 0.3)
        const steps = 36

        for (let i = Math.round(tT * steps); i < Math.round(hT * steps); i++) {
          const p0 = bezierPt(i / steps,     sx, sy, cx, cy, ex, ey)
          const p1 = bezierPt((i+1) / steps, sx, sy, cx, cy, ex, ey)
          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = arc.color
          ctx.globalAlpha = (i / Math.round(hT * steps)) * 0.85 + 0.15
          ctx.lineWidth = isMobile ? 1.2 : 1.8
          ctx.stroke()
          ctx.globalAlpha = 1
        }

        // Head glow
        const head = bezierPt(hT, sx, sy, cx, cy, ex, ey)
        const grd = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 7)
        grd.addColorStop(0, arc.color + "ee")
        grd.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(head.x, head.y, 7, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.globalAlpha = 0.95
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // ── Pulses ────────────────────────────────────────────────────────────
      pulsesRef.current = pulsesRef.current.filter(p => p.alpha > 0)
      pulsesRef.current.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.strokeStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.lineWidth = 1.5
        ctx.stroke()
        ctx.globalAlpha = 1
        p.r += 1.0; p.alpha -= 0.022
      })

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect() }
  }, [isDark, imgReady])

  // ── Render ────────────────────────────────────────────────────────────────
  if (mode === "card") {
    return (
      <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden border border-cyan-800/30 dark:border-cyan-700/30 shadow-lg" style={{ height: 220 }}>
        <canvas ref={canvasRef} className="w-full h-full" />
        <Badge count={count} />
        <Legend />
      </div>
    )
  }

  // Full-screen background mode
  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      <Badge count={count} />
      <Legend />
    </div>
  )
}

function Badge({ count }: { count: number }) {
  return (
    <div className="absolute bottom-3 right-3 text-right pointer-events-none select-none font-mono">
      <div className="flex items-center justify-end gap-1.5 text-[9px] tracking-widest uppercase text-cyan-500 dark:text-cyan-400">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        Live Threat Feed
      </div>
      <div className="text-lg font-bold tabular-nums text-cyan-400 dark:text-cyan-300 leading-tight">
        {count.toLocaleString()}
        <span className="text-[9px] font-normal ml-1 text-cyan-600/70">attacks</span>
      </div>
    </div>
  )
}

function Legend() {
  return (
    <div className="absolute bottom-3 left-3 flex gap-2.5 font-mono text-[9px] pointer-events-none select-none text-slate-500 dark:text-cyan-800/80">
      <span className="flex items-center gap-1"><span className="w-3 h-px bg-cyan-400 inline-block" />Other</span>
      <span className="flex items-center gap-1"><span className="w-3 h-px bg-orange-500 inline-block" />Exploit</span>
      <span className="flex items-center gap-1"><span className="w-3 h-px bg-red-500 inline-block" />Malware</span>
    </div>
  )
}
