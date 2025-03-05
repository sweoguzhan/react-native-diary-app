import { create } from 'zustand';
import { Video } from '../types';
import { DatabaseService } from '../services/database';

interface VideoState {
  videos: Video[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  
  initialize: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  addVideo: (video: Video) => Promise<void>;
  updateVideo: (id: string, updates: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getVideoById: (id: string) => Promise<Video | null>;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  loading: false,
  error: null,
  initialized: false,
  
  initialize: async () => {
    try {
      set({ loading: true, error: null });
      await DatabaseService.init();
      await get().fetchVideos();
      set({ initialized: true });
    } catch (error) {
      console.error('Veritabanı başlatma hatası:', error);
      set({ error: 'Veritabanı başlatılamadı' });
    } finally {
      set({ loading: false });
    }
  },
  
  fetchVideos: async () => {
    try {
      set({ loading: true, error: null });
      const videos = await DatabaseService.getVideos();
      set({ videos });
    } catch (error) {
      console.error('Video getirme hatası:', error);
      set({ error: 'Videolar getirilemedi' });
    } finally {
      set({ loading: false });
    }
  },
  
  addVideo: async (video) => {
    try {
      set({ loading: true, error: null });
      await DatabaseService.addVideo(video);
      await get().fetchVideos();
    } catch (error) {
      console.error('Video ekleme hatası:', error);
      set({ error: 'Video eklenemedi' });
    } finally {
      set({ loading: false });
    }
  },
  
  updateVideo: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      await DatabaseService.updateVideo(id, updates);
      await get().fetchVideos();
    } catch (error) {
      console.error('Video güncelleme hatası:', error);
      set({ error: 'Video güncellenemedi' });
    } finally {
      set({ loading: false });
    }
  },
  
  deleteVideo: async (id) => {
    try {
      set({ loading: true, error: null });
      await DatabaseService.deleteVideo(id);
      await get().fetchVideos();
    } catch (error) {
      console.error('Video silme hatası:', error);
      set({ error: 'Video silinemedi' });
    } finally {
      set({ loading: false });
    }
  },
  
  getVideoById: async (id) => {
    try {
      return await DatabaseService.getVideoById(id);
    } catch (error) {
      console.error('Video getirme hatası:', error);
      set({ error: 'Video getirilemedi' });
      return null;
    }
  }
})); 