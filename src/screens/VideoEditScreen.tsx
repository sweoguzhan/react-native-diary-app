import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVideoStore } from '../store/videoStore';
import { Video } from '../types';

const VideoEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { videoId } = route.params;
  
  const { getVideoById, updateVideo } = useVideoStore();
  const [video, setVideo] = useState<Video | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        setVideo(videoData);
        if (videoData) {
          setName(videoData.name);
          setDescription(videoData.description || '');
        }
      } catch (error) {
        console.error('Video yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, getVideoById]);
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen bir isim girin');
      return;
    }
    
    try {
      setSaving(true);
      await updateVideo(videoId, { name, description });
      
      // @ts-ignore
      navigation.navigate('VideoDetail', { videoId });
      
      Alert.alert('Başarılı', 'Video bilgileri güncellendi');
    } catch (error) {
      console.error('Video güncelleme hatası:', error);
      Alert.alert('Hata', 'Video güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Video Bilgilerini Düzenle</Text>
      
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
        
        <TouchableOpacity 
          style={[styles.saveButton, saving && styles.disabledButton]} 
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
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
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});

export default VideoEditScreen; 