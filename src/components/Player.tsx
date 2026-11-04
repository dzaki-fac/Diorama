import { useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { CharacterModel } from './CharacterModel';
import { getCameraAzimuthalAngle } from './ThirdPersonCamera';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameStore } from '../store/gameStore';

const MOVEMENT_CONFIG = {
  walkSpeed: 4,
  runSpeed: 8,
  rotationSmoothing: 0.15,
  groundCheckThreshold: 0.15, // velocity threshold to consider grounded
};

// Titik awal pemain; dipakai RigidBody DAN grup visual agar sinkron
const SPAWN_POSITION: [number, number, number] = [0, 2, 8.2];

// Pre-allocated vectors to avoid per-frame allocations
const _moveDirection = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();
const _targetQuaternion = new THREE.Quaternion();
const _euler = new THREE.Euler();

export const Player = forwardRef<THREE.Group>(function Player(_props, ref) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const modelGroupRef = useRef<THREE.Group>(null);
  const visualGroupRef = useRef<THREE.Group>(null);
  const keys = useKeyboardControls();

  const [isMoving, setIsMoving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const { setIsRunning: setStoreRunning, setIsGrounded: setStoreGrounded } = useGameStore();
  const cameraMode = useGameStore((s) => s.cameraMode);

  // Track ground contact state
  const isGrounded = useRef(true);

  // Expose the visual group ref so the camera can follow it
  useImperativeHandle(ref, () => {
    // We return a group that tracks the rigid body position
    return visualGroupRef.current!;
  });

  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb || !visualGroupRef.current || !modelGroupRef.current) return;

    const currentKeys = keys.current;

    // Check grounded state via velocity
    const linvel = rb.linvel();
    isGrounded.current = Math.abs(linvel.y) < MOVEMENT_CONFIG.groundCheckThreshold;

    // Calculate camera-relative movement direction
    const cameraAngle = getCameraAzimuthalAngle();

    // Forward direction (where camera is looking, projected on XZ plane)
    _forward.set(-Math.sin(cameraAngle), 0, -Math.cos(cameraAngle));
    _right.set(-_forward.z, 0, _forward.x);

    // Accumulate input direction
    _moveDirection.set(0, 0, 0);

    if (currentKeys.forward) _moveDirection.add(_forward);
    if (currentKeys.backward) _moveDirection.sub(_forward);
    if (currentKeys.left) _moveDirection.sub(_right);
    if (currentKeys.right) _moveDirection.add(_right);

    // Normalize for consistent diagonal speed
    const hasInput = _moveDirection.lengthSq() > 0.001;
    if (hasInput) {
      _moveDirection.normalize();
    }

    const sprinting = currentKeys.sprint && hasInput;
    const speed = sprinting ? MOVEMENT_CONFIG.runSpeed : MOVEMENT_CONFIG.walkSpeed;

    // Update state for UI and animation
    setIsMoving(hasInput);
    setIsRunning(sprinting);
    setStoreRunning(sprinting);
    setStoreGrounded(isGrounded.current);

    // Apply horizontal velocity (preserve vertical velocity for gravity/jump)
    const velocityX = hasInput ? _moveDirection.x * speed : 0;
    const velocityZ = hasInput ? _moveDirection.z * speed : 0;

    rb.setLinvel({ x: velocityX, y: linvel.y, z: velocityZ }, true);

    // Museum: tidak ada lompat

    // Update visual position to follow rigid body
    const translation = rb.translation();
    visualGroupRef.current.position.set(translation.x, translation.y, translation.z);

    // Rotate character to face movement direction (smooth interpolation)
    if (hasInput) {
      const targetAngle = Math.atan2(_moveDirection.x, _moveDirection.z);
      _euler.set(0, targetAngle, 0);
      _targetQuaternion.setFromEuler(_euler);
      modelGroupRef.current.quaternion.slerp(_targetQuaternion, MOVEMENT_CONFIG.rotationSmoothing);
    }
  });

  return (
    <>
      {/* Physics body */}
      <RigidBody
        ref={rigidBodyRef}
        position={SPAWN_POSITION}
        linearDamping={0}
        mass={1}
        type="dynamic"
        colliders={false}
        lockRotations
      >
        <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.8, 0]} />
      </RigidBody>

      {/* Visual representation (follows physics body, hidden in first person) */}
      <group ref={visualGroupRef} position={SPAWN_POSITION} visible={cameraMode === 'third-person'}>
        <group ref={modelGroupRef}>
          {/* 
            CharacterModel is the visual mesh group.
            To replace with a GLB model later, swap this component
            with a GLTF-loaded model while keeping the same group structure.
          */}
          <CharacterModel isMoving={isMoving} isRunning={isRunning} />
        </group>
      </group>
    </>
  );
});
