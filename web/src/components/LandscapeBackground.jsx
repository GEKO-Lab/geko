import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COLORS = {
  purpleBase: '#12081f',
  purple: '#a855f7',
  pink: '#ec4899',
  orange: '#ff8c2a',
  yellow: '#f5d547',
}

function CameraRig({ scrollProgress }) {
  const { camera } = useThree()
  const smoothed = useRef(scrollProgress)

  useFrame((_, delta) => {
    const t = 1 - Math.pow(0.001, delta)
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, scrollProgress, t)

    const p = smoothed.current - 0.5
    camera.position.x = p * 0.2
    camera.position.y = -p * 0.12
    camera.lookAt(0, 0, 0)
  })

  return null
}

function DiagonalGradientBackground({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uScroll: { value: 0 },
      uPurpleBase: { value: new THREE.Color(COLORS.purpleBase) },
      uPurple: { value: new THREE.Color(COLORS.purple) },
      uPink: { value: new THREE.Color(COLORS.pink) },
      uOrange: { value: new THREE.Color(COLORS.orange) },
      uYellow: { value: new THREE.Color(COLORS.yellow) },
    }),
    [],
  )

  useFrame(() => {
    uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh position={[0, 0, -1]} scale={[viewport.width, viewport.height, 1]}>
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
          uniform float uScroll;
          uniform vec3 uPurpleBase;
          uniform vec3 uPurple;
          uniform vec3 uPink;
          uniform vec3 uOrange;
          uniform vec3 uYellow;
          varying vec2 vUv;

          vec3 brandGradient(float t) {
            t = clamp(t, 0.0, 1.0);
            vec3 col = mix(uYellow, uOrange, smoothstep(0.0, 0.32, t));
            col = mix(col, uPink, smoothstep(0.28, 0.68, t));
            col = mix(col, uPurple, smoothstep(0.58, 1.0, t));
            return col;
          }

          void main() {
            vec2 uv = vUv;

            float slope = 0.72;
            float offset = -0.22 - uScroll * 0.38;
            float diag = uv.y + uv.x * slope + offset;

            // Clean diagonal — minimal AA only (no soft black bleed)
            float edge = smoothstep(0.499, 0.501, diag);

            vec3 grad = brandGradient(uv.y);

            vec3 col = mix(uPurpleBase, grad, edge);
            gl_FragColor = vec4(col, 1.0);
          }
        `}
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
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <CameraRig scrollProgress={scrollProgress} />
        <DiagonalGradientBackground scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
