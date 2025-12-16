"use client"

import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere, Trail, Float } from "@react-three/drei"
import { useMemo, useRef, useState, Suspense, useEffect } from "react"
import * as THREE from "three"
import { useTheme } from "next-themes"

// Major cities coordinates for realistic connections
const CITIES = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 40.7128, lng: -74.0060 },  // New York
  { lat: 51.5074, lng: -0.1278 },   // London
  { lat: 35.6762, lng: 139.6503 },  // Tokyo
  { lat: -33.8688, lng: 151.2093 }, // Sydney
  { lat: -23.5505, lng: -46.6333 }, // Sao Paulo
  { lat: 1.3521, lng: 103.8198 },   // Singapore
  { lat: 25.2048, lng: 55.2708 },   // Dubai
  { lat: 55.7558, lng: 37.6173 },   // Moscow
  { lat: -1.2921, lng: 36.8219 },   // Nairobi
  { lat: 19.0760, lng: 72.8777 },   // Mumbai
  { lat: 52.5200, lng: 13.4050 },   // Berlin
  { lat: 48.8566, lng: 2.3522 },    // Paris
  { lat: 30.0444, lng: 31.2357 },   // Cairo
  { lat: 39.9042, lng: 116.4074 },  // Beijing
]

function latLongToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

function BlinkingPoint({ position, active }: { position: THREE.Vector3, active: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    if (!ref.current) return
    
    // Only blink if active
    const targetScale = active ? 1.5 : 0.01
    const targetOpacity = active ? 1 : 0
    
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    ;(ref.current.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(
      (ref.current.material as THREE.MeshBasicMaterial).opacity,
      targetOpacity,
      0.1
    )
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={[0.2, 0.8, 1]} toneMapped={false} transparent opacity={0} />
    </mesh>
  )
}

function Attack({ radius = 1.5 }: { radius?: number }) {
  const [curve] = useState(() => {
    // Pick two random cities
    const startCity = CITIES[Math.floor(Math.random() * CITIES.length)]
    let endCity = CITIES[Math.floor(Math.random() * CITIES.length)]
    while (startCity === endCity) {
      endCity = CITIES[Math.floor(Math.random() * CITIES.length)]
    }

    const start = latLongToVector3(startCity.lat, startCity.lng, radius)
    const end = latLongToVector3(endCity.lat, endCity.lng, radius)

    // Control point for the arc (higher than the surface)
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(radius * 1.3)

    return new THREE.QuadraticBezierCurve3(start, mid, end)
  })

  const ref = useRef<THREE.Mesh>(null)
  const [progress, setProgress] = useState(0)
  const speed = useMemo(() => 0.005 + Math.random() * 0.01, [])
  const [active, setActive] = useState(false)

  // Delay start randomly
  useEffect(() => {
    const timeout = setTimeout(() => setActive(true), Math.random() * 3000)
    return () => clearTimeout(timeout)
  }, [])

  useFrame(() => {
    if (!active || !ref.current) return

    const nextProgress = progress + speed
    if (nextProgress >= 1) {
      setProgress(0)
    } else {
      setProgress(nextProgress)
      const point = curve.getPoint(nextProgress)
      ref.current.position.copy(point)
    }
  })

  if (!active) return null

  return (
    <group>
      <Trail
        width={0.5} // Thinner trail
        length={6} 
        color={new THREE.Color(0.2, 0.8, 1)} 
        attenuation={(t) => t * t}
      >
        <mesh ref={ref}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color={[0.2, 0.8, 1]} toneMapped={false} />
        </mesh>
      </Trail>
      <BlinkingPoint position={curve.v0} active={progress < 0.05} />
      <BlinkingPoint position={curve.v2} active={progress > 0.95} />
    </group>
  )
}

function World() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  // Load texture for the map
  const texture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg')

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      {/* Earth Sphere with Texture Map */}
      <Sphere args={[1.5, 64, 64]}>
        <meshPhongMaterial
          map={texture}
          color={isDark ? "#4db5ff" : "#ffffff"} 
          emissive={isDark ? "#1e40af" : "#60a5fa"}
          emissiveIntensity={isDark ? 0.2 : 0.1}
          emissiveMap={texture}
          transparent
          opacity={0.9}
          shininess={50}
        />
      </Sphere>

      {/* Atmosphere Glow */}
      <Sphere args={[1.52, 64, 64]}>
        <meshBasicMaterial
          color={isDark ? "#4db5ff" : "#3b82f6"}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Attacks / Comets */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Attack key={i} radius={1.5} />
      ))}
    </group>
  )
}

export function Globe() {
  return (
    <div className="w-full max-w-[600px] aspect-square relative mx-auto">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
        
        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
            <World />
          </Float>
        </Suspense>
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}
