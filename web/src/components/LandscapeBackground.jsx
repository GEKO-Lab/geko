import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function CameraRig({ scrollProgress }) {
  const { camera } = useThree()
  const smoothed = useRef(scrollProgress)

  useFrame((_, delta) => {
    const t = 1 - Math.pow(0.001, delta)
    smoothed.current = THREE.MathUtils.lerp(smoothed.current, scrollProgress, t)

    const p = smoothed.current - 0.5
    camera.position.x = p * 0.55
    camera.position.y = -p * 0.35
    camera.lookAt(0, 0, 0)
  })

  return null
}

function WaterSurface({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uDeep: { value: new THREE.Color('#1f7c64') },
      uShallow: { value: new THREE.Color('#78d9a0') },
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
      <planeGeometry args={[1, 1, 1, 1]} />
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
          uniform vec3 uShallow;
          varying vec2 vUv;

          float wave(vec2 p) {
            float a = sin(p.x * 10.0 + uTime * 0.9);
            float b = sin(p.y * 14.0 - uTime * 0.6);
            float c = sin((p.x + p.y) * 9.0 + uTime * 0.45);
            return (a + b + c) / 3.0;
          }

          void main() {
            vec2 uv = vUv;
            float scrollTilt = (uScroll - 0.5);
            uv.x += scrollTilt * 0.08;

            float w = wave(uv);
            float depth = smoothstep(0.0, 1.0, uv.y);
            vec3 col = mix(uDeep, uShallow, depth);
            col += w * 0.06;

            float sheen = smoothstep(0.72, 0.95, uv.y) * (0.4 + 0.6 * sin(uTime * 0.8 + uv.x * 8.0));
            col = mix(col, vec3(0.85, 0.98, 0.92), sheen * 0.16);

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
        <meshBasicMaterial color="#2b6a50" />
      </mesh>

      <mesh
        position={[viewport.width * 0.27, -viewport.height * 0.03, -1.75]}
        scale={[viewport.width * 0.45, viewport.height * 0.86, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color="#225a44" />
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
      uA: { value: new THREE.Color('#9be7c2') },
      uB: { value: new THREE.Color('#34b48a') },
      uFoam: { value: new THREE.Color('#e8fff2') },
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
      scale={[viewport.width * 0.34, viewport.height * 0.98, 1]}
    >
      <planeGeometry args={[1, 1, 1, 1]} />
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
          uniform vec3 uA;
          uniform vec3 uB;
          uniform vec3 uFoam;
          varying vec2 vUv;

          float stripes(vec2 p) {
            float s1 = sin((p.y + uTime * 0.75) * 26.0 + p.x * 6.0);
            float s2 = sin((p.y + uTime * 0.35) * 43.0 - p.x * 9.0);
            return (s1 + s2) * 0.5;
          }

          void main() {
            vec2 uv = vUv;
            uv.y += uTime * 0.35;
            uv.x += (uScroll - 0.5) * 0.03;

            float s = stripes(uv);
            float flow = smoothstep(-0.3, 0.8, s);

            float edge = smoothstep(0.0, 0.12, vUv.x) * smoothstep(0.0, 0.12, 1.0 - vUv.x);
            float alpha = 0.92 * edge;

            vec3 col = mix(uB, uA, flow);

            float foamBand = smoothstep(0.07, 0.0, vUv.y) * (0.65 + 0.35 * sin(uTime * 1.2 + vUv.x * 12.0));
            col = mix(col, uFoam, foamBand * 0.65);

            gl_FragColor = vec4(col, alpha);
          }
        `}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function GradientSky({ scrollProgress }) {
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uTopColor: { value: new THREE.Color('#f36bbd') },
      uBottomColor: { value: new THREE.Color('#f5e06a') },
    }),
    [],
  )

  useFrame((_, delta) => {
    uniforms.uTime.value += delta
    uniforms.uScroll.value = scrollProgress
  })

  return (
    <mesh position={[0, 0, -4]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
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
          uniform vec3 uBottomColor;
          varying vec2 vUv;

          float softWave(float x) {
            return sin(x) * 0.5 + sin(x * 0.5) * 0.35 + sin(x * 0.25) * 0.15;
          }

          void main() {
            float t = clamp(vUv.y, 0.0, 1.0);
            float scrollTilt = (uScroll - 0.5) * 0.06;
            float drift = softWave(uTime * 0.08 + vUv.x * 2.0) * 0.03;
            vec3 col = mix(uBottomColor, uTopColor, smoothstep(0.0, 1.0, t + drift));
            gl_FragColor = vec4(col + scrollTilt, 1.0);
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
        dpr={[1, 2]}
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

