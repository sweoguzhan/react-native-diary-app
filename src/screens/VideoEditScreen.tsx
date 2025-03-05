import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVideoStore } from '../store/videoStore';

const VideoEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { videoId } = route.params;
  
  const video = useVideoStore((state) => state.getVideoById(videoId));
  const updateVideo = useVideoStore((state) => state.updateVideo);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (video) {
      setName(video.name);
      setDescription(video.description);
    }
  }, [video]);
  
  if (!video) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video bulunamadı</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen bir isim girin');
      return;
    }
    
    updateVideo(videoId, { name, description });
    
    // @ts-ignore
    navigation.navigate('VideoDetail', { videoId });
    
    Alert.alert('Başarılı', 'Video bilgileri güncellendi');
  };
  
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
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
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
});

export default VideoEditScreen; 