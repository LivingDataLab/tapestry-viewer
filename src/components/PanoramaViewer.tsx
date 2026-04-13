import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

interface PanoramaSphereProps {
  imageUrl: string;
}

const PanoramaSphere = ({ imageUrl }: PanoramaSphereProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Full 360° rotation in 45 seconds
      meshRef.current.rotation.y += (Math.PI * 2 * delta) / 45;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 32]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
};

interface PanoramaViewerProps {
  imageUrl: string;
}

const PanoramaViewer = ({ imageUrl }: PanoramaViewerProps) => {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ fov: 75, position: [0, 0, 0.1] }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <PanoramaSphere imageUrl={imageUrl} />
      </Canvas>
    </div>
  );
};

export default PanoramaViewer;
