import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterModelProps {
  isMoving: boolean;
  isRunning: boolean;
}

export function CharacterModel({ isMoving, isRunning }: CharacterModelProps) {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // Reusable materials (created once)
  const materials = useMemo(() => ({
    skin: new THREE.MeshStandardMaterial({ color: '#f4c69e' }),
    shirt: new THREE.MeshStandardMaterial({ color: '#4a90d9' }),
    pants: new THREE.MeshStandardMaterial({ color: '#2c3e50' }),
    shoes: new THREE.MeshStandardMaterial({ color: '#34495e' }),
    hair: new THREE.MeshStandardMaterial({ color: '#3d2314' }),
  }), []);

  useFrame((state) => {
    if (!leftArmRef.current || !rightArmRef.current || !leftLegRef.current || !rightLegRef.current) return;

    if (isMoving) {
      const speed = isRunning ? 12 : 8;
      const amplitude = isRunning ? 0.6 : 0.4;
      const t = state.clock.elapsedTime * speed;

      // Arms swing opposite to legs
      leftArmRef.current.rotation.x = Math.sin(t) * amplitude;
      rightArmRef.current.rotation.x = -Math.sin(t) * amplitude;

      // Legs swing
      leftLegRef.current.rotation.x = -Math.sin(t) * amplitude;
      rightLegRef.current.rotation.x = Math.sin(t) * amplitude;
    } else {
      // Idle gentle sway
      const t = state.clock.elapsedTime * 1.5;
      const idleAmplitude = 0.05;

      leftArmRef.current.rotation.x = Math.sin(t) * idleAmplitude;
      rightArmRef.current.rotation.x = Math.sin(t + Math.PI) * idleAmplitude;
      leftLegRef.current.rotation.x = 0;
      rightLegRef.current.rotation.x = 0;
    }
  });

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 1.6, 0]} material={materials.skin} castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.82, -0.02]} material={materials.hair} castShadow>
        <boxGeometry args={[0.38, 0.12, 0.38]} />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 1.62, 0.178]}>
        <boxGeometry args={[0.06, 0.06, 0.01]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0.08, 1.62, 0.178]}>
        <boxGeometry args={[0.06, 0.06, 0.01]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Body / Torso */}
      <mesh position={[0, 1.15, 0]} material={materials.shirt} castShadow>
        <boxGeometry args={[0.45, 0.55, 0.25]} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.35, 1.35, 0]}>
        <mesh position={[0, -0.22, 0]} material={materials.shirt} castShadow>
          <boxGeometry args={[0.15, 0.45, 0.18]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.5, 0]} material={materials.skin} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.35, 1.35, 0]}>
        <mesh position={[0, -0.22, 0]} material={materials.shirt} castShadow>
          <boxGeometry args={[0.15, 0.45, 0.18]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.5, 0]} material={materials.skin} castShadow>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.12, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} material={materials.pants} castShadow>
          <boxGeometry args={[0.18, 0.5, 0.2]} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.55, 0.04]} material={materials.shoes} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.28]} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.12, 0.82, 0]}>
        <mesh position={[0, -0.25, 0]} material={materials.pants} castShadow>
          <boxGeometry args={[0.18, 0.5, 0.2]} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.55, 0.04]} material={materials.shoes} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.28]} />
        </mesh>
      </group>
    </group>
  );
}
