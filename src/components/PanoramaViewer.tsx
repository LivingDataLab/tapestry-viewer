import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

/* ── Glitch shader material ── */
const GlitchMaterial = shaderMaterial(
  {
    map: null,
    opacity: 1.0,
    time: 0.0,
    glitchIntensity: 0.0,
  },
  // vertex
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment
  `
    uniform sampler2D map;
    uniform float opacity;
    uniform float time;
    uniform float glitchIntensity;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;

      // Sporadic horizontal shift bursts
      float lineNoise = step(0.97, rand(vec2(floor(uv.y * 80.0), floor(time * 4.0))));
      float shift = lineNoise * (rand(vec2(time, uv.y)) - 0.5) * 0.012 * glitchIntensity;

      // RGB channel separation — rare random bursts
      float chromaBurst = step(0.985, rand(vec2(floor(time * 1.5), 3.7)));
      float chromaShift = chromaBurst * 0.004 * glitchIntensity * sin(time * 6.0 + uv.y * 20.0);

      float r = texture2D(map, uv + vec2(shift + chromaShift, 0.0)).r;
      float g = texture2D(map, uv + vec2(shift, 0.0)).g;
      float b = texture2D(map, uv + vec2(shift - chromaShift, 0.0)).b;

      // Faint scanlines
      float scanline = 1.0 - 0.04 * glitchIntensity * step(0.5, fract(uv.y * 400.0 + time * 2.0));

      gl_FragColor = vec4(vec3(r, g, b) * scanline, opacity);
    }
  `
);

extend({ GlitchMaterial });

// Augment JSX for the custom material
declare global {
  namespace JSX {
    interface IntrinsicElements {
      glitchMaterial: any;
    }
  }
}

interface PanoramaSphereProps {
  imageUrl: string;
  opacity: number;
  rotationRef: React.MutableRefObject<number>;
  glitch?: boolean;
}

const FadingSphere = ({ imageUrl, opacity, rotationRef, glitch = false }: PanoramaSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationRef.current;
    }
    if (materialRef.current) {
      materialRef.current.opacity += (opacity - materialRef.current.opacity) * 0.025;
      materialRef.current.time += delta;
      // Smoothly ramp glitch intensity
      const targetGlitch = glitch ? 1.0 : 0.0;
      materialRef.current.glitchIntensity += (targetGlitch - materialRef.current.glitchIntensity) * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <glitchMaterial
        ref={materialRef}
        map={texture}
        side={THREE.BackSide}
        transparent
        opacity={0}
        time={0}
        glitchIntensity={0}
      />
    </mesh>
  );
};

const RotationDriver = ({ rotationRef }: { rotationRef: React.MutableRefObject<number> }) => {
  useFrame((_, delta) => {
    rotationRef.current += (Math.PI * 2 * delta) / 45;
  });
  return null;
};

interface DualPanoramaViewerProps {
  rawImageUrl: string;
  annotatedImageUrl: string;
  showAnnotated: boolean;
}

const DualPanoramaViewer = ({ rawImageUrl, annotatedImageUrl, showAnnotated }: DualPanoramaViewerProps) => {
  const rotationRef = useRef(0);

  useEffect(() => {
    rotationRef.current = 0;
  }, [rawImageUrl]);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.1] }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <RotationDriver rotationRef={rotationRef} />
        <FadingSphere
          imageUrl={rawImageUrl}
          opacity={showAnnotated ? 0 : 1}
          rotationRef={rotationRef}
        />
        <FadingSphere
          imageUrl={annotatedImageUrl}
          opacity={showAnnotated ? 1 : 0}
          rotationRef={rotationRef}
          glitch={showAnnotated}
        />
      </Canvas>
    </div>
  );
};

export default DualPanoramaViewer;
