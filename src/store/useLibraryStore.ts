import { CapturedPhoto, photoStorage } from "@/services/storageService";
import { create } from "zustand";

interface LibraryState {
  allPhotos: CapturedPhoto[];
  photos: CapturedPhoto[];
  refreshing: boolean;
  isLoading: boolean;
  photosPerPage: number;

  // Actions
  setRefreshing: (refreshing: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchPhotos: () => Promise<void>;
  loadMore: () => void;
  deletePhoto: (id: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  allPhotos: [],
  photos: [],
  refreshing: false,
  isLoading: true,
  photosPerPage: 20,

  setRefreshing: (refreshing) => set({ refreshing }),
  setIsLoading: (isLoading) => set({ isLoading }),

  fetchPhotos: async () => {
    const { photosPerPage, isLoading } = get();
    const storedPhotos = await photoStorage.getPhotos();
    set({
      allPhotos: storedPhotos,
      photos: storedPhotos.slice(0, photosPerPage),
      isLoading: false,
    });
  },

  loadMore: () => {
    const { photos, allPhotos, photosPerPage } = get();
    if (photos.length >= allPhotos.length) return;

    const nextPhotos = allPhotos.slice(0, photos.length + photosPerPage);
    set({ photos: nextPhotos });
  },

  deletePhoto: (id: string) => {
    set((state) => ({
      allPhotos: state.allPhotos.filter((p) => p.id !== id),
      photos: state.photos.filter((p) => p.id !== id),
    }));
  },
}));
