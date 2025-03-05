import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useVideoStore } from '../store/videoStore';
import { DatabaseService } from '../services/database';

// QueryClient oluştur
const queryClient = new QueryClient();

export default function RootLayout() {
  const { initialize } = useVideoStore();

  useEffect(() => {
    const setupApp = async () => {
      try {
        console.log("Uygulama başlatılıyor...");
        
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

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Video Günlüğü" }} />
        <Stack.Screen name="video-select" options={{ title: "Video Seç" }} />
        <Stack.Screen name="video-crop" options={{ title: "Video Kırp" }} />
        <Stack.Screen name="video-metadata" options={{ title: "Video Bilgileri" }} />
        <Stack.Screen name="video-detail/[id]" options={{ title: "Video Detayı" }} />
      </Stack>
    </QueryClientProvider>
  );
} 