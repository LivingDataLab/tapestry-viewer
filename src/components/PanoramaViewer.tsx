import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

interface PanoramaSphereProps {
  imageUrl: string;
  opacity: number;
  rotationRef: React.MutableRefObject<number>;
}

const PanoramaSphere = ({ imageUrl, opacity, rotationRef }: PanoramaSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((_, delta) => {
    // Shared rotation so both spheres stay in sync
    rotationRef.current += (Math.PI * 2 * delta) / 45;
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} transparent opacity={opacity} />
    </mesh>
  );
};

interface DualPanoramaViewerProps {
  rawImageUrl: string;
  annotatedImageUrl: string;
  showAnnotated: boolean;
}

const FadingSphere = ({ imageUrl, opacity, rotationRef }: PanoramaSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotationRef.current;
    }
    if (materialRef.current) {
      // Smoothly lerp opacity
      materialRef.current.opacity += (opacity - materialRef.current.opacity) * 0.025;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <meshBasicMaterial ref={materialRef} map={texture} side={THREE.BackSide} transparent opacity={0} />
    </mesh>
  );
};

const RotationDriver = ({ rotationRef }: { rotationRef: React.MutableRefObject<number> }) => {
  useFrame((_, delta) => {
    rotationRef.current += (Math.PI * 2 * delta) / 45;
  });
  return null;
};

const DualPanoramaViewer = ({ rawImageUrl, annotatedImageUrl, showAnnotated }: DualPanoramaViewerProps) => {
  const rotationRef = useRef(0);

  // Reset rotation when row changes (raw URL changes)
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
        />
      </Canvas>
    </div>
  );
};

export default DualPanoramaViewer;
