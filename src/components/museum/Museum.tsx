import { useMemo, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import { Portrait } from './Portrait';
import {
  makeFloorTexture,
  makeWallTexture,
  makeSignTexture,
  makeCrestTexture,
  makeRektorBoardTexture,
} from './textures';
import { COLLECTION, RECTORS } from '../../data/rectors';
import { WALLS, COLUMNS, BENCHES } from './layout';
import { useGameStore } from '../../store/gameStore';

// Mulai fetch aset besar lebih awal (Suspense jadi lebih cepat resolve)
useGLTF.preload('/models/patung.glb');

interface MuseumProps {
  /** Ref ke group visual pemain (untuk proximity check) */
  playerRef: React.RefObject<THREE.Group | null>;
}

/** Normal arah hadap dari rotationY (depan objek). */
function forwardDir(rotationY: number): [number, number] {
  return [Math.sin(rotationY), Math.cos(rotationY)];
}

/** Replika patung kecil di bawah potret tiap rektor. */
function StatueSmall({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const gltf = useGLTF('/models/patung.glb');
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true);
    cloned.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = false;
      }
    });
    return cloned;
  }, [gltf.scene]);
  const { scale, offsetY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const h = Math.max(0.001, box.max.y - box.min.y);
    const s = 0.82 / h;
    return { scale: s, offsetY: -box.min.y * s };
  }, [scene]);

  const pedestalMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#2a282d', roughness: 0.35, metalness: 0.15 }),
    []
  );
  const brassMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c09a3e', metalness: 0.9, roughness: 0.3 }),
    []
  );

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Pedestal kecil */}
      <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.05, 0]} material={pedestalMat}>
          <boxGeometry args={[0.54, 0.1, 0.54]} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.38, 0]} material={pedestalMat}>
          <boxGeometry args={[0.4, 0.56, 0.4]} />
        </mesh>
        <mesh castShadow position={[0, 0.71, 0]} material={pedestalMat}>
          <boxGeometry args={[0.52, 0.07, 0.52]} />
        </mesh>
        <mesh position={[0, 0.755, 0]} material={brassMat}>
          <boxGeometry args={[0.56, 0.03, 0.56]} />
        </mesh>
      </RigidBody>
      {/* Patung kecil menghadap ke dalam ruangan */}
      <primitive object={scene} position={[0, 0.77 + offsetY, 0]} scale={scale} />
    </group>
  );
}

export function Museum({ playerRef }: MuseumProps) {
  const floorTex = useMemo(() => {
    const t = makeFloorTexture();
    t.repeat.set(16, 10);
    return t;
  }, []);
  const wallTex = useMemo(() => makeWallTexture(), []);

  const plasterMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e9e2d2', roughness: 0.9 }),
    []
  );

  // Material dinding per panjang (tekstur di-clone dengan repeat berbeda)
  const wallMaterial = useMemo(() => {
    const cache = new Map<number, THREE.MeshStandardMaterial>();
    for (const w of WALLS) {
      if (w.textureLength == null) continue;
      const key = w.textureLength;
      if (cache.has(key)) continue;
      const t = wallTex.clone();
      t.needsUpdate = true;
      t.repeat.set(Math.max(1, Math.round(key / 4)), 1);
      cache.set(key, new THREE.MeshStandardMaterial({ map: t, roughness: 0.85, metalness: 0.02 }));
    }
    return (len?: number) => (len == null ? plasterMaterial : cache.get(len)!);
  }, [wallTex, plasterMaterial]);
  const ceilingMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#3a332c', roughness: 0.95 }),
    []
  );
  const beamMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#42362b', roughness: 0.8 }),
    []
  );
  const columnMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e6dfd0', roughness: 0.35, metalness: 0.05 }),
    []
  );

  const mats = {
    bench: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#38271a', roughness: 0.55 }),
      []
    ),
    brass: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#c09a3e', metalness: 0.9, roughness: 0.28 }),
      []
    ),
    rope: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#6d1d1d', roughness: 0.9 }),
      []
    ),
    doorFrame: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#1f150e', roughness: 0.7 }),
      []
    ),
    door: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#2e2013', roughness: 0.5 }),
      []
    ),
    signGlow: useMemo(
      () => new THREE.MeshStandardMaterial({ color: '#ffc37a', emissive: '#ffb050', emissiveIntensity: 2.2 }),
      []
    ),
    ceilingLight: useMemo(
      () =>
        new THREE.MeshStandardMaterial({
          color: '#f5e7c8',
          emissive: '#ffdba0',
          emissiveIntensity: 1.7,
        }),
      []
    ),
  };

  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.28, metalness: 0.08 }),
    [floorTex]
  );

  const signMuseum = useMemo(() => makeSignTexture('MUSEUM REKTOR UNIVERSITAS DIPONEGORO'), []);
  const signG1 = useMemo(() => makeSignTexture('MASUK →'), []);
  const signG2 = useMemo(() => makeSignTexture('LANJUT →'), []);
  const signG3 = useMemo(() => makeSignTexture('LANJUT →'), []);
  const signExit = useMemo(() => makeSignTexture('KELUAR →'), []);
  const signPerintisan = useMemo(() => makeSignTexture('MASA PERINTISAN'), []);
  const signPembangunan = useMemo(() => makeSignTexture('MASA PEMBANGUNAN'), []);
  const signModern = useMemo(() => makeSignTexture('MASA MODERN'), []);

  const crestTex = useMemo(() => makeCrestTexture(), []);
  const boardTex = useMemo(() => makeRektorBoardTexture(), []);

  // Proximity check: update activeExhibitId di store saat berubah.
  const checkProximity = useCallback(() => {
    const group = playerRef.current;
    if (!group) return;
    const store = useGameStore.getState();
    if (store.lightboxOpen) return;

    const p = group.position;
    let bestId: number | null = null;
    let bestDist = Infinity;
    for (const e of COLLECTION) {
      const dx = p.x - e.position[0];
      const dz = p.z - e.position[2];
      const d = Math.hypot(dx, dz);
      if (d < e.triggerDistance && d < bestDist) {
        bestDist = d;
        bestId = e.id;
      }
    }
    store.setActiveExhibit(bestId);
  }, [playerRef]);

  useFrame(checkProximity);

  useEffect(() => {
    const id = window.setInterval(checkProximity, 250);
    return () => window.clearInterval(id);
  }, [checkProximity]);

  return (
    <>
      <color attach="background" args={['#14100c']} />

      {/* ====== Pencahayaan interior ====== */}
      <ambientLight intensity={0.4} color="#fff1dd" />
      <hemisphereLight args={['#ffe9c4', '#3d332a', 0.55]} />
      {/* Pengisi hangat per zona */}
      <pointLight position={[0, 4.35, 1]} intensity={5.5} distance={18} decay={1.6} color="#ffe2b8" />
      <pointLight position={[-16, 4.35, 4.5]} intensity={4} distance={14} decay={1.6} color="#ffe2b8" />
      <pointLight position={[-11, 4.35, -14.5]} intensity={4} distance={15} decay={1.6} color="#ffe2b8" />
      <pointLight position={[10, 4.35, -14.5]} intensity={4} distance={15} decay={1.6} color="#ffe2b8" />
      <pointLight position={[16, 4.35, -2.5]} intensity={4} distance={13} decay={1.6} color="#ffe2b8" />
      <pointLight position={[16, 4.35, 7.5]} intensity={4} distance={13} decay={1.6} color="#ffe2b8" />
      <directionalLight
        position={[6, 18, 8]}
        intensity={0.5}
        color="#fff4e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-26}
        shadow-camera-right={26}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-bias={-0.0005}
      />

      {/* ====== Lantai ====== */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[24, 0.5, 15.5]} position={[0, -0.5, -4.5]} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, -4.5]}
          receiveShadow
          material={floorMaterial}
        >
          <planeGeometry args={[48, 31]} />
        </mesh>
      </RigidBody>

      {/* ====== Plafon ====== */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, -4.5]} material={ceilingMat}>
        <planeGeometry args={[48, 31]} />
      </mesh>
      {/* Beam kayu */}
      {[
        [0, -15.2, 46],
        [-16, 1.2, 15.2],
        [0, 0, 15.2],
        [0, 5.5, 15.2],
        [16, -2.5, 12.5],
        [16, 7.5, 12.5],
      ].map(([x, z, len]) => (
        <mesh key={`beam-${x}-${z}`} position={[x, 4.8, z]} material={beamMat}>
          <boxGeometry args={[len, 0.36, 0.38]} />
        </mesh>
      ))}
      {/* Panel lampu plafon (emisi, bukan sumber cahaya) */}
      {[
        [0, 1.5, 1.7, 0.95],
        [0, 6, 1.7, 0.95],
        [-16, 4.5, 2.2, 1.1],
        [-8, -14.5, 2.2, 1.1],
        [8, -14.5, 2.2, 1.1],
        [16, -2.5, 2.2, 1.1],
        [16, 7.5, 2.2, 1.1],
      ].map(([x, z, w, d]) => (
        <mesh
          key={`panel-${x}-${z}`}
          rotation={[Math.PI / 2, 0, 0]}
          position={[x, 4.97, z]}
          material={mats.ceilingLight}
        >
          <planeGeometry args={[w, d]} />
        </mesh>
      ))}

      {/* ====== Dinding + collider ====== */}
      {WALLS.map((w, i) => (
        <RigidBody key={`wall-${i}`} type="fixed" colliders="cuboid" position={w.position}>
          <mesh material={wallMaterial(w.textureLength)} receiveShadow>
            <boxGeometry args={w.size} />
          </mesh>
        </RigidBody>
      ))}

      {/* ====== Kolom LOBI ====== */}
      {COLUMNS.map(([x, z], i) => (
        <RigidBody key={`col-${i}`} type="fixed" colliders="cuboid" position={[x, 2.5, z]}>
          <mesh castShadow material={columnMat}>
            <cylinderGeometry args={[0.55, 0.62, 5, 20]} />
          </mesh>
          <mesh position={[0, -2.36, 0]} material={beamMat}>
            <boxGeometry args={[1.4, 0.28, 1.4]} />
          </mesh>
          <mesh position={[0, 2.36, 0]} material={beamMat}>
            <boxGeometry args={[1.4, 0.28, 1.4]} />
          </mesh>
        </RigidBody>
      ))}

      {/* ====== Koleksi (12 potret rektor + 1 lukisan sejarah) ====== */}
      {COLLECTION.map((item) => (
        <Portrait
          key={item.id}
          position={item.position}
          rotationY={item.rotationY}
          image={item.image}
          name={item.name}
          period={item.period}
          role={item.role}
          frame={item.frame}
          plaqueSide={item.plaqueSide}
          spotIntensity={item.spotIntensity}
          canvasWidth={item.canvasWidth}
          canvasHeight={item.canvasHeight}
        />
      ))}

      {/* ====== Replika patung di bawah tiap potret rektor ====== */}
      {RECTORS.map((r) => {
        const [dx, dz] = forwardDir(r.rotationY);
        return (
          <StatueSmall
            key={`statue-${r.id}`}
            position={[r.position[0] + dx * 0.68, 0, r.position[2] + dz * 0.68]}
            rotationY={r.rotationY}
          />
        );
      })}

      {/* ====== Papan monumental LOBI: DUA BELAS REKTOR ====== */}
      <mesh position={[0, 2.7, -8.77]}>
        <planeGeometry args={[7.2, 4.05]} />
        <meshStandardMaterial map={boardTex} roughness={0.75} />
      </mesh>
      {/* Crest Undip kiri-kanan papan */}
      <mesh position={[-5.4, 2.6, -8.77]}>
        <planeGeometry args={[2.25, 2.25]} />
        <meshStandardMaterial map={crestTex} transparent metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[5.4, 2.6, -8.77]}>
        <planeGeometry args={[2.25, 2.25]} />
        <meshStandardMaterial map={crestTex} transparent metalness={0.4} roughness={0.4} />
      </mesh>

      {/* ====== Bench ====== */}
      {BENCHES.map((b, i) => (
        <RigidBody
          key={`bench-${i}`}
          type="fixed"
          colliders="cuboid"
          position={[b.position[0], 0, b.position[2]]}
          rotation={[0, b.rotationY, 0]}
        >
          <mesh position={[0, 0.47, 0]} castShadow material={mats.bench}>
            <boxGeometry args={[1.9, 0.14, 0.55]} />
          </mesh>
          {[-0.72, 0.72].map((x) => (
            <mesh key={x} position={[x, 0.21, 0]} material={mats.bench}>
              <boxGeometry args={[0.16, 0.42, 0.5]} />
            </mesh>
          ))}
        </RigidBody>
      ))}

      {/* ====== Pintu masuk (dekoratif, selatan) ====== */}
      <group position={[0, 0, 10.76]}>
        {[-1.28, 1.28].map((x) => (
          <mesh key={`df-${x}`} position={[x, 1.7, 0]} material={mats.doorFrame}>
            <boxGeometry args={[0.28, 3.45, 0.18]} />
          </mesh>
        ))}
        <mesh position={[0, 3.52, 0]} material={mats.doorFrame}>
          <boxGeometry args={[2.85, 0.3, 0.18]} />
        </mesh>
        {[-0.58, 0.58].map((x) => (
          <mesh key={`dp-${x}`} position={[x, 1.55, 0.01]} material={mats.door}>
            <boxGeometry args={[1.08, 3.1, 0.09]} />
          </mesh>
        ))}
        {[-0.16, 0.16].map((x) => (
          <mesh key={`dh-${x}`} position={[x, 1.15, 0.08]} material={mats.brass}>
            <sphereGeometry args={[0.055, 10, 10]} />
          </mesh>
        ))}
      </group>
      {/* Signage di atas pintu */}
      <mesh position={[0, 4.18, 10.77]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[5.6, 0.7]} />
        <meshBasicMaterial map={signMuseum} transparent depthWrite={false} />
      </mesh>
      {/* Sconce lampu dinding di samping pintu */}
      {[-2.4, 2.4].map((x) => (
        <mesh key={`sconce-${x}`} position={[x, 2.6, 10.74]} material={mats.signGlow}>
          <sphereGeometry args={[0.09, 10, 10]} />
        </mesh>
      ))}

      {/* ====== Signage arch / arah rute ====== */}
      <mesh position={[-7.78, 4.3, 8.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.7, 0.55]} />
        <meshBasicMaterial map={signG1} transparent depthWrite={false} />
      </mesh>
      <mesh position={[-16.5, 4.3, -8.76]}>
        <planeGeometry args={[4.9, 0.58]} />
        <meshBasicMaterial map={signG2} transparent depthWrite={false} />
      </mesh>
      <mesh position={[19, 4.3, -9.76]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[4.9, 0.58]} />
        <meshBasicMaterial map={signG3} transparent depthWrite={false} />
      </mesh>
      <mesh position={[8.24, 4.3, 8.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.7, 0.55]} />
        <meshBasicMaterial map={signExit} transparent depthWrite={false} />
      </mesh>

      {/* ====== Nama galeri besar di dinding potret utama ====== */}
      <mesh position={[-23.77, 4.25, 2.3]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 0.58]} />
        <meshBasicMaterial map={signPerintisan} transparent depthWrite={false} />
      </mesh>
      <mesh position={[1.25, 4.25, -19.77]}>
        <planeGeometry args={[5.2, 0.58]} />
        <meshBasicMaterial map={signPembangunan} transparent depthWrite={false} />
      </mesh>
      <mesh position={[23.77, 4.25, 2.3]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[5.2, 0.58]} />
        <meshBasicMaterial map={signModern} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
