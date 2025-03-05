import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from '../types';

interface VideoState {
  videos: Video[];
  addVideo: (video: Video) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  getVideoById: (id: string) => Video | undefined;
}

export const useVideoStore = create<VideoState>()(
  persist(
    (set, get) => ({
      videos: [],
      
      addVideo: (video) => set((state) => ({ 
        videos: [video, ...state.videos] 
      })),
      
      updateVideo: (id, updates) => set((state) => ({
        videos: state.videos.map((video) => 
          video.id === id ? { ...video, ...updates } : video
        )
      })),
      
      deleteVideo: (id) => set((state) => ({
        videos: state.videos.filter((video) => video.id !== id)
      })),
      
      getVideoById: (id) => {
        return get().videos.find((video) => video.id === id);
      },
    }),
    {
      name: 'video-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 