import { useEffect } from 'react';
import { DatabaseService } from './src/services/database';
import { useVideoStore } from './src/store/videoStore';

// Expo Router'ı kullanmak için App.tsx'i basitleştirin
export default function App() {
  const { initialize } = useVideoStore();

  useEffect(() => {
    const setupApp = async () => {
      try {
        // Veritabanını başlat
        await DatabaseService.init();
        
        // Store'u başlat
        await initialize();
      } catch (error) {
        console.error("Uygulama başlatma hatası:", error);
      }
    };

    setupApp();
  }, [initialize]);

  // Expo Router, entry point'i otomatik olarak yönetir
  return null;
}

