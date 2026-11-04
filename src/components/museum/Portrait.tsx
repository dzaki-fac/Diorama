import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import type { FrameStyle } from '../../data/rectors';
import { makeRektorPlaqueTexture, makeSilhouetteTexture } from './textures';

const FRAME_STYLES: Record<FrameStyle, { color: string; metalness: number; roughness: number; liner: string }> = {
  gold: { color: '#c8a13a', metalness: 0.85, roughness: 0.32, liner: '#f0d878' },
  black: { color: '#16140f', metalness: 0.25, roughness: 0.45, liner: '#3a362c' },
  wood: { color: '#45301e', metalness: 0.05, roughness: 0.55, liner: '#6b4c2f' },
};

export interface PortraitProps {
  position: [number, number, number];
  rotationY: number;
  /** Entry aktif di sebelah kanvas (id dipakai untuk apa pun) */
  image: string | null;
  name: string;
  period: string;
  role: string;
  frame: FrameStyle;
  plaqueSide: 1 | -1;
  spotIntensity: number;
  /** Tinggi kanvas tetap museum (seragam) — gambar di-passepartout di dalamnya */
  canvasWidth?: number;
  canvasHeight?: number;
}

export function Portrait({
  position,
  rotationY,
  image,
  name,
  period,
  role,
  frame,
  plaqueSide,
  spotIntensity,
  canvasWidth = 1.05,
  canvasHeight = 1.4,
}: PortraitProps) {
  const style = FRAME_STYLES[frame];
  const molding = THREE.MathUtils.clamp(canvasWidth * 0.09, 0.07, 0.14);
  const depth = molding * 0.9;
  const liner = molding * 0.4;
  const outerW = canvasWidth + (molding + liner) * 2;
  const outerH = canvasHeight + (molding + liner) * 2;
  const frameDepth = depth + 0.04;

  // Foto di /rektor/* atau null → siluet otomatis
  const texture = useTexture(image ?? '/rektor/placeholder-portrait.png');
  const silhouetteTexture = useMemo(() => makeSilhouetteTexture(name), [name]);
  const map = image ? texture : silhouetteTexture;

  const configuredMap = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Ukuran gambar mengikuti rasio asli, dibingkai passepartout agar frame seragam
  const imgAspect = useMemo(() => {
    if (!image) return 512 / 682;
    const img = configuredMap.image as { width?: number; height?: number } | undefined;
    return img?.width && img?.height ? img.width / img.height : 0.75;
  }, [image, configuredMap]);

  const { matteW, matteH, imgW, imgH } = useMemo(() => {
    const maxW = canvasWidth - 0.08;
    const maxH = canvasHeight - 0.08;
    let w = maxW;
    let h = w / imgAspect;
    if (h > maxH) {
      h = maxH;
      w = h * imgAspect;
    }
    return { matteW: maxW + 0.035, matteH: maxH + 0.035, imgW: w, imgH: h };
  }, [imgAspect, canvasWidth, canvasHeight]);

  const plaqueTexture = useMemo(() => makeRektorPlaqueTexture(name, period, role), [name, period, role]);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* === Bingkai luar (4 batang) === */}
      <mesh castShadow position={[0, outerH / 2 - molding / 2, 0]}>
        <boxGeometry args={[outerW, molding, frameDepth]} />
        <meshStandardMaterial color={style.color} metalness={style.metalness} roughness={style.roughness} />
      </mesh>
      <mesh castShadow position={[0, -outerH / 2 + molding / 2, 0]}>
        <boxGeometry args={[outerW, molding, frameDepth]} />
        <meshStandardMaterial color={style.color} metalness={style.metalness} roughness={style.roughness} />
      </mesh>
      <mesh castShadow position={[-outerW / 2 + molding / 2, 0, 0]}>
        <boxGeometry args={[molding, outerH - molding * 2, frameDepth]} />
        <meshStandardMaterial color={style.color} metalness={style.metalness} roughness={style.roughness} />
      </mesh>
      <mesh castShadow position={[outerW / 2 - molding / 2, 0, 0]}>
        <boxGeometry args={[molding, outerH - molding * 2, frameDepth]} />
        <meshStandardMaterial color={style.color} metalness={style.metalness} roughness={style.roughness} />
      </mesh>

      {/* === Liner dalam === */}
      <mesh position={[0, canvasHeight / 2 + liner / 2, 0.008]}>
        <boxGeometry args={[canvasWidth + liner * 2, liner, depth]} />
        <meshStandardMaterial color={style.liner} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, -canvasHeight / 2 - liner / 2, 0.008]}>
        <boxGeometry args={[canvasWidth + liner * 2, liner, depth]} />
        <meshStandardMaterial color={style.liner} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[-canvasWidth / 2 - liner / 2, 0, 0.008]}>
        <boxGeometry args={[liner, canvasHeight, depth]} />
        <meshStandardMaterial color={style.liner} metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[canvasWidth / 2 + liner / 2, 0, 0.008]}>
        <boxGeometry args={[liner, canvasHeight, depth]} />
        <meshStandardMaterial color={style.liner} metalness={0.7} roughness={0.35} />
      </mesh>

      {/* === Kanvas + passepartout === */}
      <mesh position={[0, 0, frameDepth / 2 + 0.006]}>
        <boxGeometry args={[canvasWidth, canvasHeight, 0.035]} />
        <meshStandardMaterial color="#141210" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0, frameDepth / 2 + 0.026]}>
        <planeGeometry args={[matteW, matteH]} />
        <meshStandardMaterial color="#201d19" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0, frameDepth / 2 + 0.03]}>
        <planeGeometry args={[imgW, imgH]} />
        <meshStandardMaterial map={configuredMap} roughness={0.55} metalness={0.02} />
      </mesh>

      {/* === Plakat perunggu === */}
      <mesh position={[plaqueSide * (outerW / 2 + 0.5), -(position[1] - 1.42), 0.02]}>
        <planeGeometry args={[0.64, 0.4]} />
        <meshStandardMaterial map={plaqueTexture} metalness={0.35} roughness={0.5} />
      </mesh>

      {/* === Spotlight === */}
      <primitive object={spotTarget} position={[0, 0, 0]} />
      <spotLight
        position={[0, 4.35 - position[1], 1.7]}
        target={spotTarget}
        color="#ffd9a6"
        intensity={spotIntensity}
        distance={8}
        angle={0.5}
        penumbra={0.75}
        decay={1.4}
      />
    </group>
  );
}
