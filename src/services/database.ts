import * as SQLite from 'expo-sqlite';
import { Video } from '../types';

export const DatabaseService = {
  init: async () => {
    try {
      console.log("Veritabanı başlatılıyor...");
      const db = await SQLite.openDatabaseAsync('videos.db');
      console.log("Veritabanı açıldı");
      
      // Doğrudan SQL sorgusu gönder
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS videos (
          id TEXT PRIMARY KEY NOT NULL,
          uri TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          startTime REAL NOT NULL,
          endTime REAL NOT NULL,
          duration REAL NOT NULL,
          createdAt INTEGER NOT NULL
        )
      `);
      
      console.log("Tablo oluşturuldu");
      return;
    } catch (error) {
      console.error('Veritabanı başlatma hatası:', error);
      throw error;
    }
  },

  getVideos: async () => {
    try {
      const db = await SQLite.openDatabaseAsync('videos.db');
      const videos = await db.getAllAsync<Video>('SELECT * FROM videos ORDER BY createdAt DESC');
      return videos;
    } catch (error) {
      console.error('Video getirme hatası:', error);
      throw error;
    }
  },

  addVideo: async (video: Video) => {
    try {
      const db = await SQLite.openDatabaseAsync('videos.db');
      
      // Parametreleri SQL sorgusuna ekle
      await db.execAsync(`
        INSERT INTO videos (id, uri, name, description, startTime, endTime, duration, createdAt)
        VALUES ('${video.id}', '${video.uri}', '${video.name}', '${video.description || ''}', 
                ${video.startTime}, ${video.endTime}, ${video.duration}, ${video.createdAt})
      `);
    } catch (error) {
      console.error('Video ekleme hatası:', error);
      throw error;
    }
  },

  updateVideo: async (id: string, updates: Partial<Video>) => {
    try {
      const db = await SQLite.openDatabaseAsync('videos.db');
      
      const setStatements = Object.entries(updates)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => {
          if (typeof value === 'string') {
            return `${key} = '${value}'`;
          }
          return `${key} = ${value}`;
        })
        .join(', ');
      
      await db.execAsync(`UPDATE videos SET ${setStatements} WHERE id = '${id}'`);
    } catch (error) {
      console.error('Video güncelleme hatası:', error);
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    try {
      const db = await SQLite.openDatabaseAsync('videos.db');
      await db.execAsync(`DELETE FROM videos WHERE id = '${id}'`);
    } catch (error) {
      console.error('Video silme hatası:', error);
      throw error;
    }
  },

  getVideoById: async (id: string) => {
    try {
      const db = await SQLite.openDatabaseAsync('videos.db');
      const video = await db.getFirstAsync<Video>(`SELECT * FROM videos WHERE id = '${id}'`);
      return video || null;
    } catch (error) {
      console.error('Video getirme hatası:', error);
      throw error;
    }
  }
}; 