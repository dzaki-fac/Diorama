// Data layout museum — dipakai oleh Museum.tsx (render) dan ThirdPersonCamera.tsx (collision).

export interface WallSeg {
  position: [number, number, number];
  size: [number, number, number];
  /** Panjang dinding untuk repeat tekstur; undefined = plester polos (lintel) */
  textureLength?: number;
}

// ============================================================
// Denah tapal-kuda satu arah:
// LOBI → G1 (Barat) → G2 (bar utara) → G3 (sayap timur) → LOBI
// Batas: x −24..+24, z −20..+11
// ============================================================
export const WALLS: WallSeg[] = [
  // ===== Pembatas luar =====
  { position: [0, 2.5, -20], size: [48, 5, 0.4], textureLength: 48 }, // utara
  { position: [-24, 2.5, -4.5], size: [0.4, 5, 31], textureLength: 31 }, // barat
  { position: [24, 2.5, -4.5], size: [0.4, 5, 31], textureLength: 31 }, // timur
  { position: [0, 2.5, 11], size: [48, 5, 0.4], textureLength: 48 }, // selatan (pintu)

  // ===== z = −9 (pembatas bar utara) =====
  { position: [-21.25, 2.5, -9], size: [5.5, 5, 0.4], textureLength: 5.5 },
  { position: [-16.5, 4.3, -9], size: [4, 1.4, 0.4] }, // lintel arch G1→G2
  { position: [1.25, 2.5, -9], size: [31.5, 5, 0.4], textureLength: 32 }, // termasuk dinding utara LOBI
  { position: [19, 4.3, -9], size: [4, 1.4, 0.4] }, // lintel arch G2→G3
  { position: [22.5, 2.5, -9], size: [3, 5, 0.4], textureLength: 3 },

  // ===== x = −8 (dinding LOBI | G1) — arch LOBI→G1 (z 6.5..10.5) =====
  { position: [-8, 2.5, -1.25], size: [0.4, 5, 15.5], textureLength: 15.5 },
  { position: [-8, 2.5, 10.75], size: [0.4, 5, 0.5], textureLength: 0.5 },
  { position: [-8, 4.3, 8.5], size: [0.4, 1.4, 4] }, // lintel

  // ===== x = +8 (dinding LOBI | G3) — arch G3→LOBI, cermin arch kiri (z 6.5..10.5) =====
  { position: [8, 2.5, -1.25], size: [0.4, 5, 15.5], textureLength: 15.5 },
  { position: [8, 2.5, 10.75], size: [0.4, 5, 0.5], textureLength: 0.5 },
  { position: [8, 4.3, 8.5], size: [0.4, 1.4, 4] }, // lintel
];

export const COLUMNS: [number, number][] = [
  [-5, 4.5],
  [5, 4.5],
  [-5, -3.5],
  [5, -3.5],
];

export const BENCHES: { position: [number, number, number]; rotationY: number }[] = [
  { position: [-4.5, 0, 5.5], rotationY: Math.PI }, // LOBI — menghadap papan
  { position: [4.5, 0, 5.5], rotationY: Math.PI },
  { position: [-16, 0, 4.5], rotationY: Math.PI / 2 }, // G1
  { position: [0, 0, -11.6], rotationY: Math.PI }, // G2 — menghadap potret
  { position: [16, 0, 4.5], rotationY: -Math.PI / 2 }, // G3
];

export interface Box3Data {
  min: [number, number, number];
  max: [number, number, number];
}

/** Kotak-kotak penghalang kamera (dinding + lintel + kolom + plafon + bench). */
export const COLLIDER_BOXES: Box3Data[] = [
  ...WALLS.map((w) => ({
    min: [
      w.position[0] - w.size[0] / 2,
      w.position[1] - w.size[1] / 2,
      w.position[2] - w.size[2] / 2,
    ] as [number, number, number],
    max: [
      w.position[0] + w.size[0] / 2,
      w.position[1] + w.size[1] / 2,
      w.position[2] + w.size[2] / 2,
    ] as [number, number, number],
  })),
  // Kolom (aproksimasi kotak, radius luar 0.62)
  ...COLUMNS.map(([x, z]) => ({
    min: [x - 0.62, 0, z - 0.62] as [number, number, number],
    max: [x + 0.62, 5, z + 0.62] as [number, number, number],
  })),
  // Plafon (5m) dan lantai, supaya kamera tidak bisa naik/tembus ke atas atap
  { min: [-24, 5, -20], max: [24, 5.6, 11] },
  // Bench (tinggi 0.55)
  ...BENCHES.map((b) => ({
    min: [b.position[0] - 0.95, 0, b.position[2] - 0.3] as [number, number, number],
    max: [b.position[0] + 0.95, 0.55, b.position[2] + 0.3] as [number, number, number],
  })),
];

/**
 * Titik masuk segmen P→Q ke kotak AABB (slab method).
 * Return nilai t in [0,1] saat sinar MASUK ke kotak, atau null bila tidak menembus.
 * Ray dianggap mulai dari luar kotak; jika P di dalam kotak, return 0.
 */
export function segmentAabbEntry(
  p: { x: number; y: number; z: number },
  q: { x: number; y: number; z: number },
  box: Box3Data
): number | null {
  const d = { x: q.x - p.x, y: q.y - p.y, z: q.z - p.z };
  let tMin = 0;
  let tMax = 1;
  const axes: Array<'x' | 'y' | 'z'> = ['x', 'y', 'z'];
  for (const axis of axes) {
    const min = box.min[axis === 'x' ? 0 : axis === 'y' ? 1 : 2];
    const max = box.max[axis === 'x' ? 0 : axis === 'y' ? 1 : 2];
    const origin = p[axis];
    const dir = d[axis];
    if (Math.abs(dir) < 1e-9) {
      if (origin < min || origin > max) return null;
      continue;
    }
    let t1 = (min - origin) / dir;
    let t2 = (max - origin) / dir;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tMin = Math.max(tMin, t1);
    tMax = Math.min(tMax, t2);
    if (tMin > tMax) return null;
  }
  return tMin;
}
