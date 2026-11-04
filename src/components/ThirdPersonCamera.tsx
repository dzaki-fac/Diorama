import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { COLLIDER_BOXES, segmentAabbEntry } from './museum/layout';

interface ThirdPersonCameraProps {
  targetRef: React.RefObject<THREE.Group | null>;
}

const CAMERA_CONFIG = {
  // 3rd Person Distance & Zoom
  distance: 6,
  minDistance: 2.5,
  maxDistance: 15,
  zoomSpeed: 1.2,
  rotationSpeed: 0.0025,

  // Vertical Pitch Limits (in radians)
  // Negative pitch = looking down, Positive pitch = looking up
  minPitch3rd: -0.75, // looking down from above (bird's-eye view)
  maxPitch3rd: 0.85,  // looking up towards the sky
  minPitch1st: -1.4,  // looking down at feet
  maxPitch1st: 1.4,   // looking straight up at sky

  // Target Offsets
  targetOffset3rd: new THREE.Vector3(0, 1.4, 0),
  eyeOffset1st: new THREE.Vector3(0, 1.6, 0),

  // Damping
  damping3rd: 0.08,
  damping1st: 0.35,
};

// Module-level shared yaw angle for camera-relative movement
let _sharedYaw = 0;

export function getCameraAzimuthalAngle(): number {
  return _sharedYaw;
}

export function ThirdPersonCamera({ targetRef }: ThirdPersonCameraProps) {
  const { camera, gl } = useThree();

  // Camera angles: yaw (horizontal) and pitch (vertical)
  const yaw = useRef(0);
  const pitch = useRef(-0.18); // sudut pandang awal: sedikit menunduk ke dalam museum
  const distance = useRef(CAMERA_CONFIG.distance);

  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Pre-allocated reusable vectors to avoid GC pressure
  const _targetCenter = useRef(new THREE.Vector3());
  const _dir = useRef(new THREE.Vector3());
  const _idealPosition = useRef(new THREE.Vector3());
  const _idealLookAt = useRef(new THREE.Vector3());

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!document.pointerLockElement) return;

    const mode = useGameStore.getState().cameraMode;
    const minPitch = mode === 'first-person' ? CAMERA_CONFIG.minPitch1st : CAMERA_CONFIG.minPitch3rd;
    const maxPitch = mode === 'first-person' ? CAMERA_CONFIG.maxPitch1st : CAMERA_CONFIG.maxPitch3rd;

    // Standard FPS / TPS mouse look:
    // Moving mouse UP (movementY < 0) -> pitch increases -> tilts view UP
    // Moving mouse DOWN (movementY > 0) -> pitch decreases -> tilts view DOWN
    // Moving mouse LEFT (movementX < 0) -> yaw increases -> turns view LEFT
    // Moving mouse RIGHT (movementX > 0) -> yaw decreases -> turns view RIGHT
    yaw.current -= e.movementX * CAMERA_CONFIG.rotationSpeed;
    pitch.current -= e.movementY * CAMERA_CONFIG.rotationSpeed;

    pitch.current = THREE.MathUtils.clamp(pitch.current, minPitch, maxPitch);
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    const mode = useGameStore.getState().cameraMode;
    if (mode === 'third-person') {
      e.preventDefault();
      distance.current += e.deltaY * 0.005 * CAMERA_CONFIG.zoomSpeed;
      distance.current = THREE.MathUtils.clamp(
        distance.current,
        CAMERA_CONFIG.minDistance,
        CAMERA_CONFIG.maxDistance
      );
    }
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    if (e.button === 0 || e.button === 2) {
      gl.domElement.requestPointerLock();
    }
  }, [gl]);

  const handlePointerUp = useCallback(() => {}, []);

  const handleContextMenu = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  useEffect(() => {
    const domElement = gl.domElement;

    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('contextmenu', handleContextMenu);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [gl, handlePointerDown, handlePointerUp, handleMouseMove, handleWheel, handleContextMenu]);

  useFrame(() => {
    if (!targetRef.current) return;

    const targetPosition = targetRef.current.position;
    const mode = useGameStore.getState().cameraMode;

    // Update shared yaw for Player movement calculation
    _sharedYaw = yaw.current;

    // Calculate normalized look direction vector from yaw and pitch
    const cosPitch = Math.cos(pitch.current);
    const sinPitch = Math.sin(pitch.current);
    const sinYaw = Math.sin(yaw.current);
    const cosYaw = Math.cos(yaw.current);

    _dir.current.set(
      -sinYaw * cosPitch,
      sinPitch,
      -cosYaw * cosPitch
    );

    if (mode === 'first-person') {
      // 1st Person: Camera is attached to the player's head / eyes
      _idealPosition.current.set(
        targetPosition.x + CAMERA_CONFIG.eyeOffset1st.x,
        targetPosition.y + CAMERA_CONFIG.eyeOffset1st.y,
        targetPosition.z + CAMERA_CONFIG.eyeOffset1st.z
      );

      _idealLookAt.current.copy(_idealPosition.current).add(_dir.current);

      if (!initialized.current) {
        currentPosition.current.copy(_idealPosition.current);
        currentLookAt.current.copy(_idealLookAt.current);
        initialized.current = true;
      }

      currentPosition.current.lerp(_idealPosition.current, CAMERA_CONFIG.damping1st);
      currentLookAt.current.copy(_idealLookAt.current);

      camera.position.copy(currentPosition.current);
      camera.lookAt(currentLookAt.current);
    } else {
      // 3rd Person: Camera orbits behind the player
      // Ensure pitch stays within 3rd person limits
      pitch.current = THREE.MathUtils.clamp(
        pitch.current,
        CAMERA_CONFIG.minPitch3rd,
        CAMERA_CONFIG.maxPitch3rd
      );

      _targetCenter.current.set(
        targetPosition.x + CAMERA_CONFIG.targetOffset3rd.x,
        targetPosition.y + CAMERA_CONFIG.targetOffset3rd.y,
        targetPosition.z + CAMERA_CONFIG.targetOffset3rd.z
      );

      // Camera position is placed behind the player along the opposite look direction
      const dist = distance.current;
      _idealPosition.current.set(
        _targetCenter.current.x - _dir.current.x * dist,
        _targetCenter.current.y - _dir.current.y * dist,
        _targetCenter.current.z - _dir.current.z * dist
      );

      // Camera collision: geser kamera mendekati pemain bila sinar
      // dari pemain ke posisi kamera mengenai dinding / kolom / plafon.
      {
        const p = {
          x: _targetCenter.current.x,
          y: _targetCenter.current.y,
          z: _targetCenter.current.z,
        };
        const q = {
          x: _idealPosition.current.x,
          y: _idealPosition.current.y,
          z: _idealPosition.current.z,
        };
        const segLen = Math.hypot(q.x - p.x, q.y - p.y, q.z - p.z);
        if (segLen > 0.05) {
          let tMin = 1;
          for (const box of COLLIDER_BOXES) {
            const t = segmentAabbEntry(p, q, box);
            if (t !== null && t < tMin) tMin = t;
          }
          if (tMin < 1) {
            const margin = 0.35 / segLen; // jaga jarak ~35cm dari permukaan
            const clampT = Math.max(0, tMin - margin);
            _idealPosition.current.set(
              p.x + (q.x - p.x) * clampT,
              p.y + (q.y - p.y) * clampT,
              p.z + (q.z - p.z) * clampT
            );
          }
        }
      }

      // Prevent camera from clipping into the ground
      if (_idealPosition.current.y < 0.5) {
        _idealPosition.current.y = 0.5;
      }

      // Look at a point ahead of the character along the look direction
      _idealLookAt.current.set(
        _targetCenter.current.x + _dir.current.x * 2,
        _targetCenter.current.y + _dir.current.y * 2,
        _targetCenter.current.z + _dir.current.z * 2
      );

      if (!initialized.current) {
        currentPosition.current.copy(_idealPosition.current);
        currentLookAt.current.copy(_idealLookAt.current);
        initialized.current = true;
      }

      currentPosition.current.lerp(_idealPosition.current, CAMERA_CONFIG.damping3rd);
      currentLookAt.current.lerp(_idealLookAt.current, CAMERA_CONFIG.damping3rd);

      camera.position.copy(currentPosition.current);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}
