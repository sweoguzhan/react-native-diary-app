import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useVideoStore } from '../store/videoStore';
import { Video } from '../types';

const VideoDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { videoId } = route.params;
  
  const { getVideoById, deleteVideo } = useVideoStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<ExpoVideo | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        setVideo(videoData);
      } catch (error) {
        console.error('Video yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, getVideoById]);
  
  const handleEdit = () => {
    // @ts-ignore
    navigation.navigate('VideoEdit', { videoId });
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Videoyu Sil',
      'Bu videoyu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVideo(videoId);
              // @ts-ignore
              navigation.navigate('Home');
            } catch (error) {
              console.error('Video silme hatası:', error);
              Alert.alert('Hata', 'Video silinirken bir hata oluştu');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ExpoVideo
        ref={videoRef}
        source={{ uri: video.uri }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        positionMillis={video.startTime * 1000}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.positionMillis / 1000 >= video.endTime) {
            videoRef.current?.setPositionAsync(video.startTime * 1000);
          }
        }}
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{video.name}</Text>
        <Text style={styles.date}>
          {new Date(video.createdAt).toLocaleDateString()}
        </Text>
        <Text style={styles.description}>{video.description}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 240,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoDetailScreen; 