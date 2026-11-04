import { create } from 'zustand';

export type CameraMode = 'third-person' | 'first-person';

interface GameState {
  isRunning: boolean;
  isGrounded: boolean;
  cameraMode: CameraMode;
  velocity: { x: number; y: number; z: number };
  /** ID karya yang sedang dekat dengan pemain (null = tidak ada) */
  activeExhibitId: number | null;
  /** Lightbox "lihat detail" terbuka atau tidak */
  lightboxOpen: boolean;
  setIsRunning: (running: boolean) => void;
  setIsGrounded: (grounded: boolean) => void;
  setVelocity: (velocity: { x: number; y: number; z: number }) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleCameraMode: () => void;
  setActiveExhibit: (id: number | null) => void;
  toggleLightbox: () => void;
  closeLightbox: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isRunning: false,
  isGrounded: true,
  cameraMode: 'third-person',
  velocity: { x: 0, y: 0, z: 0 },
  activeExhibitId: null,
  lightboxOpen: false,
  setIsRunning: (running) => set({ isRunning: running }),
  setIsGrounded: (grounded) => set({ isGrounded: grounded }),
  setVelocity: (velocity) => set({ velocity }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleCameraMode: () =>
    set((state) => ({
      cameraMode: state.cameraMode === 'third-person' ? 'first-person' : 'third-person',
    })),
  // Tidak memicu re-render kalau nilai tidak berubah
  setActiveExhibit: (id) =>
    set((state) =>
      state.activeExhibitId === id ? state : { activeExhibitId: id }
    ),
  toggleLightbox: () =>
    set((state) => ({ lightboxOpen: !state.lightboxOpen })),
  closeLightbox: () => set({ lightboxOpen: false }),
}));
