import { create } from "zustand";

type CameraFacing = "back" | "front";

interface CameraState {
  facing: CameraFacing;
  torch: boolean;
  timerDuration: number; // 0, 3, or 10
  countdown: number | null;
  zoom: number;

  setCountdown: (val: number | null) => void;
  setZoom: (val: number) => void;
  toggleCamera: () => void;
  toggleTorch: () => void;
  toggleTimer: () => void;
}

export const cameraStore = create<CameraState>((set, get) => ({
  facing: "back",
  torch: false,
  timerDuration: 0,
  countdown: null,
  zoom: 0,

  setCountdown: (val) => set({ countdown: val }),
  setZoom: (val) => set({ zoom: val }),

  toggleCamera: () =>
    set((state) => ({
      facing: state.facing === "back" ? "front" : "back",
      torch: false, // reset torch when flipping
    })),

  toggleTorch: () =>
    set((state) => ({
      torch: !state.torch,
    })),

  toggleTimer: () =>
    set((state) => {
      // Cycle: 0 -> 3 -> 10 -> 0
      const next =
        state.timerDuration === 0 ? 3 : state.timerDuration === 3 ? 10 : 0;
      return { timerDuration: next };
    }),
}));
