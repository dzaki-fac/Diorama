import { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { Player } from './components/Player';
import { ThirdPersonCamera } from './components/ThirdPersonCamera';
import { Museum } from './components/museum/Museum';
import { ControlsUI } from './components/ControlsUI';

function Scene() {
  const playerRef = useRef<THREE.Group>(null);

  return (
    <>
      <Museum playerRef={playerRef} />
      <Player ref={playerRef} />
      <ThirdPersonCamera targetRef={playerRef} />
    </>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#888" wireframe />
    </mesh>
  );
}

export default function App() {
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 60, near: 0.1, far: 200 }}
        style={{ width: '100vw', height: '100vh' }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Physics gravity={[0, -15, 0]} debug={false}>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
      <ControlsUI />
    </>
  );
}
