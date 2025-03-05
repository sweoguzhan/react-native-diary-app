import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const VideoSelectScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSelectVideo = async () => {
    try {
      setLoading(true);
      console.log("Video seçiliyor...");
      
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("İzin Gerekli", "Video seçmek için galeri erişim izni gereklidir.");
        setLoading(false);
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
        videoMaxDuration: 60, 
      });
      
      console.log("Seçim sonucu:", result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];
        console.log("Seçilen video:", selectedVideo.uri);
        
        // @ts-ignore
        navigation.navigate('VideoCrop', { 
          videoUri: selectedVideo.uri,
          videoId: Date.now().toString()
        });
      } else {
        console.log("Video seçimi iptal edildi");
      }
    } catch (error) {
      console.error('Video seçme hatası:', error);
      Alert.alert("Hata", "Video seçilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Video Seçin</Text>
      <Text style={styles.subtitle}>Galerinizdeki bir videoyu seçerek başlayın</Text>
      
      <TouchableOpacity 
        style={styles.selectButton} 
        onPress={handleSelectVideo}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.selectButtonText}>Galeriden Video Seç</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoSelectScreen; 