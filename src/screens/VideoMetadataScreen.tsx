import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Video as ExpoVideo, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useVideoStore } from '../store/videoStore';
import { Video } from '../types';

const VideoMetadataScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { videoUri, startTime, endTime } = route.params;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Zustand store'dan addVideo fonksiyonunu al
  const addVideo = useVideoStore((state) => state.addVideo);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen bir isim girin');
      return;
    }

    setProcessing(true);

    try {
      // Gerçek uygulamada burada FFMPEG ile video kırpma işlemi yapılacak
      // Şimdilik sadece simüle edelim
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Yeni bir video ID'si oluştur
      const videoId = Date.now().toString();
      
      const croppedVideoUri = videoUri;
      
      const newVideo: Video = {
        id: videoId,
        uri: croppedVideoUri,
        name,
        description,
        startTime,
        endTime,
        duration: endTime - startTime,
        createdAt: Date.now()
      };

      addVideo(newVideo);

      // @ts-ignore
      navigation.navigate('Home');
      
      Alert.alert('Başarılı', 'Video başarıyla kaydedildi');
    } catch (error) {
      console.error('Video kaydetme hatası:', error);
      Alert.alert('Hata', 'Video kaydedilirken bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Video Bilgileri</Text>
      
      <ExpoVideo
        source={{ uri: videoUri }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
      />
      
      <View style={styles.form}>
        <Text style={styles.label}>İsim</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Video için bir isim girin"
        />
        
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Video hakkında açıklama girin"
          multiline
          numberOfLines={4}
        />
        
        <Text style={styles.infoText}>
          Seçilen bölüm: {startTime.toFixed(1)}s - {endTime.toFixed(1)}s
        </Text>
        
        <TouchableOpacity 
          style={[styles.saveButton, processing && styles.disabledButton]} 
          onPress={handleSave}
          disabled={processing}
        >
          {processing ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Kaydet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 20,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoMetadataScreen; 