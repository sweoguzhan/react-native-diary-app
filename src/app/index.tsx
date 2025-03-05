import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DatabaseService } from '../services/database';
import { Video } from '../types';

interface VideoItemProps {
  item: Video;
}

const HomeScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const { data: videos = [], isLoading, refetch } = useQuery({
    queryKey: ['videos'],
    queryFn: DatabaseService.getVideos,
  });

  const handleAddVideo = () => {
    router.push('/video-select');
  };

  const handleVideoPress = (videoId: string) => {
    router.push(`/video-detail/${videoId}`);
  };

  const renderItem = ({ item }: VideoItemProps) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => handleVideoPress(item.id)}
    >
      <View style={styles.thumbnail}>
        <Text style={styles.thumbnailText}>Video</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{item.name}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.videoDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz video eklenmemiş</Text>
          </View>
        }
        refreshing={isLoading}
        onRefresh={refetch}
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddVideo}
      >
        <Text style={styles.addButtonText}>+ Video Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... HomeScreen.tsx'deki stiller
});

export default HomeScreen; 