import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// GEKO brand palette
const COLORS = {
  purpleDeep: '#1a0a2e',
  purpleMid: '#5a2d8c',
  purpleLight: '#b44ae8',
  yellow: '#f5d547',
  orange: '#ff9b3d',
  cream: '#fff4d6',
}

function CameraRig({ scrollProgress }) {
  const { camera } = useThree()
  const smoothed = useRef(scrollProgress)

  useFrame((_, delta) => {
    const t = 1 - Math.pow(0.001, delta)
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, scrollProgress, t)

    const p = smoothed.current - 0.5
    camera.position.x = p * 0.45
    camera.position.y = -p * 0.28
    camera.lookAt(0, 0, 0)
  })

  return null
}

function GradientSky({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uTopColor: { value: new THREE.Color(COLORS.purpleLight) },
      uMidColor: { value: new THREE.Color(COLORS.orange) },
      uBottomColor: { value: new THREE.Color(COLORS.yellow) },
    }),
    [],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh position={[0, 0, -4]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uTopColor;
          uniform vec3 uMidColor;
          uniform vec3 uBottomColor;
          varying vec2 vUv;

          void main() {
            float t = clamp(vUv.y + (uScroll - 0.5) * 0.04, 0.0, 1.0);
            float drift = sin(uTime * 0.06 + vUv.x * 1.5) * 0.015;
            vec3 col = mix(uBottomColor, uMidColor, smoothstep(0.0, 0.55, t + drift));
            col = mix(col, uTopColor, smoothstep(0.45, 1.0, t + drift));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
        depthWrite={false}
      />
    </mesh>
  )
}

function WaterSurface({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDeep: { value: new THREE.Color(COLORS.purpleDeep) },
      uMid: { value: new THREE.Color(COLORS.purpleMid) },
      uHighlight: { value: new THREE.Color(COLORS.yellow) },
    }),
    [],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh
      position={[0, -viewport.height * 0.28, -1.2]}
      scale={[viewport.width, viewport.height * 0.56, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uDeep;
          uniform vec3 uMid;
          uniform vec3 uHighlight;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            uv.x += (uScroll - 0.5) * 0.05;

            float ripple = sin(uv.x * 5.0 + uTime * 0.35) * sin(uv.y * 3.0 - uTime * 0.25);
            ripple = ripple * 0.5 + 0.5;

            float depth = smoothstep(0.0, 1.0, uv.y);
            vec3 col = mix(uDeep, uMid, depth);
            col = mix(col, uHighlight, ripple * 0.08 * smoothstep(0.5, 1.0, uv.y));

            gl_FragColor = vec4(col, 1.0);
          }
        `}
        depthWrite={false}
      />
    </mesh>
  )
}

function Cliff() {
  const { viewport } = useThree()

  return (
    <group>
      <mesh
        position={[viewport.width * 0.34, -viewport.height * 0.02, -1.8]}
        scale={[viewport.width * 0.52, viewport.height * 0.92, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={COLORS.purpleDeep} />
      </mesh>
      <mesh
        position={[viewport.width * 0.27, -viewport.height * 0.03, -1.75]}
        scale={[viewport.width * 0.45, viewport.height * 0.86, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#2a1248" />
      </mesh>
    </group>
  )
}

function Waterfall({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDeep: { value: new THREE.Color(COLORS.purpleMid) },
      uFlow: { value: new THREE.Color(COLORS.yellow) },
      uGlow: { value: new THREE.Color(COLORS.orange) },
      uFoam: { value: new THREE.Color(COLORS.cream) },
    }),
    [],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh
      position={[viewport.width * 0.35, viewport.height * 0.03, -1.4]}
      scale={[viewport.width * 0.32, viewport.height * 0.98, 1]}
    >
      <planeGeometry args={[1, 1, 32, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uDeep;
          uniform vec3 uFlow;
          uniform vec3 uGlow;
          uniform vec3 uFoam;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            uv.x += (uScroll - 0.5) * 0.02;

            float edge = smoothstep(0.0, 0.14, uv.x) * smoothstep(0.0, 0.14, 1.0 - uv.x);

            // Smooth downward scroll (no high-frequency beat = no flicker)
            float scroll = fract(uv.y * 5.5 - uTime * 0.14);
            float streak = smoothstep(0.0, 0.4, scroll) * smoothstep(1.0, 0.45, scroll);

            float slowWave = sin(uv.y * 3.2 - uTime * 0.35) * 0.5 + 0.5;
            slowWave = smoothstep(0.3, 0.7, slowWave);

            float flow = mix(slowWave, streak, 0.4);

            vec3 col = mix(uDeep, uFlow, flow * 0.65 + 0.2);
            col = mix(col, uGlow, streak * 0.35);

            // Tier ledges (inspired by reference tiers)
            float tier1 = smoothstep(0.72, 0.68, uv.y) * smoothstep(0.64, 0.68, uv.y);
            float tier2 = smoothstep(0.48, 0.44, uv.y) * smoothstep(0.40, 0.44, uv.y);
            float tier3 = smoothstep(0.24, 0.20, uv.y) * smoothstep(0.16, 0.20, uv.y);
            float tiers = tier1 + tier2 + tier3;
            col = mix(col, uFoam, tiers * 0.55);

            // Bottom pool foam — gentle ripple
            float pool = smoothstep(0.1, 0.0, uv.y);
            float ripple = sin(uv.x * 14.0 - uTime * 0.5) * 0.5 + 0.5;
            ripple = smoothstep(0.42, 0.58, ripple);
            col = mix(col, uFoam, pool * (0.45 + ripple * 0.35));

            gl_FragColor = vec4(col, 0.92 * edge);
          }
        `}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export default function LandscapeBackground({ scrollProgress = 0 }) {
  return (
    <div className="bgCanvas" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 5], zoom: 1 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <CameraRig scrollProgress={scrollProgress} />
        <GradientSky scrollProgress={scrollProgress} />
        <WaterSurface scrollProgress={scrollProgress} />
        <Cliff />
        <Waterfall scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
