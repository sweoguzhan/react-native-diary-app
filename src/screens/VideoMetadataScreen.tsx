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
import { validateVideoMetadata } from '../schemas/videoSchema';

const VideoMetadataScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { videoUri, startTime, endTime } = route.params;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { addVideo } = useVideoStore();

  const validateForm = () => {
    const result = validateVideoMetadata({
      name,
      description,
      startTime,
      endTime
    });

    if (!result.success) {
      Alert.alert('Hata', result.error || 'Form bilgilerini kontrol edin');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);

    try {
      const videoId = Date.now().toString();
      
      // Kırpılmış video için yeni bir dosya yolu oluştur
      const fileExtension = videoUri.split('.').pop();
      const newFileName = `${videoId}.${fileExtension}`;
      const newVideoUri = `${FileSystem.documentDirectory}videos/${newFileName}`;
      
      const dirInfo = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}videos`);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}videos`, { intermediates: true });
      }
      
      await FileSystem.copyAsync({
        from: videoUri,
        to: newVideoUri
      });
      
      console.log(`Video kopyalandı: ${newVideoUri}`);
      
      // Yeni video nesnesini oluştur
      const newVideo: Video = {
        id: videoId,
        uri: newVideoUri,
        name,
        description,
        startTime,
        endTime,
        duration: endTime - startTime,
        createdAt: Date.now()
      };

      await addVideo(newVideo);

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
        positionMillis={startTime * 1000}
        shouldPlay={false}
      />
      
      <View style={styles.form}>
        <Text style={styles.label}>İsim <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="Video için bir isim girin"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        
        <Text style={styles.label}>Açıklama</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={description}
          onChangeText={setDescription}
          placeholder="Video hakkında açıklama girin"
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        
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
  required: {
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
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