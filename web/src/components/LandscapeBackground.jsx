import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COLORS = {
  purpleBase: '#12081f',
  purpleTop: '#b44ae8',
  purpleMid: '#d44a9a',
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
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPurpleBase: { value: new THREE.Color(COLORS.purpleBase) },
      uGradTop: { value: new THREE.Color(COLORS.purpleTop) },
      uGradMid: { value: new THREE.Color(COLORS.purpleMid) },
      uGradOrange: { value: new THREE.Color(COLORS.orange) },
      uGradYellow: { value: new THREE.Color(COLORS.yellow) },
    }),
    [],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
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
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uPurpleBase;
          uniform vec3 uGradTop;
          uniform vec3 uGradMid;
          uniform vec3 uGradOrange;
          uniform vec3 uGradYellow;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;

            // Diagonal edge — lower offset keeps GEKO area in solid purple
            float slope = 0.72;
            float offset = -0.22 - uScroll * 0.38;
            float diag = uv.y + uv.x * slope + offset;

            // Soft diagonal band for scroll reveal
            float edge = smoothstep(0.38, 0.62, diag);

            // Vertical brand gradient (purple → orange → yellow)
            float t = clamp(uv.y + sin(uTime * 0.04 + uv.x * 0.8) * 0.008, 0.0, 1.0);
            vec3 grad = mix(uGradYellow, uGradOrange, smoothstep(0.0, 0.38, t));
            grad = mix(grad, uGradMid, smoothstep(0.25, 0.62, t));
            grad = mix(grad, uGradTop, smoothstep(0.5, 1.0, t));

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
