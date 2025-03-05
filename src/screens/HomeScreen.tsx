import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVideoStore } from '../store/videoStore';
import { Video } from '../types';

interface VideoItemProps {
  item: Video;
}

const HomeScreen = () => {
  const navigation = useNavigation();
  const videos = useVideoStore((state) => state.videos);

  const handleAddVideo = () => {
    // @ts-ignore
    navigation.navigate('VideoSelect');
  };

  const handleVideoPress = (videoId: string) => {
    // @ts-ignore
    navigation.navigate('VideoDetail', { videoId });
  };

  const renderItem = ({ item }: VideoItemProps) => (
    <TouchableOpacity 
      style={styles.videoItem} 
      onPress={() => handleVideoPress(item.id)}
    >
      <View style={styles.videoThumbnail}>
        <Text style={styles.thumbnailText}>Video</Text>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoName}>{item.name}</Text>
        <Text style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.videoDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddVideo}>
        <Text style={styles.addButtonText}>+ Video Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  videoItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  videoThumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    color: '#888',
  },
  videoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  videoName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  videoDate: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen; 