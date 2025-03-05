import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const VideoCropScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // @ts-ignore
  const { videoUri } = route.params;
  
  const videoRef = useRef<Video>(null);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(5); // 5 saniye varsayılan
  
  // Reanimated yerine React Native Animated kullanın
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Ekran yüklendiğinde animasyon başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(translateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  const handleVideoLoad = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.durationMillis) {
      const durationSeconds = status.durationMillis / 1000;
      setDuration(durationSeconds);
      setEndTime(Math.min(5, durationSeconds));
    }
  };

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.positionMillis) {
      setPosition(status.positionMillis / 1000);
    }
  };

  const handleSliderChange = (value: number) => {
    setStartTime(value);
    setEndTime(Math.min(value + 5, duration));
    
    // Videoyu başlangıç noktasına getir
    if (videoRef.current) {
      videoRef.current.setPositionAsync(value * 1000);
    }
  };

  const handleNext = () => {
    // @ts-ignore
    navigation.navigate('VideoMetadata', {
      videoUri,
      startTime,
      endTime,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.contentContainer, 
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Video Kırpma</Text>
        <Text style={styles.subtitle}>5 saniyelik bir bölüm seçin</Text>
        
        <Video
          ref={videoRef}
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onLoad={handleVideoLoad}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        
        <View style={styles.cropControls}>
          <Text style={styles.timeText}>
            Başlangıç: {startTime.toFixed(1)}s - Bitiş: {endTime.toFixed(1)}s
          </Text>
          
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(0, duration - 5)}
            value={startTime}
            onValueChange={handleSliderChange}
            minimumTrackTintColor="#007AFF"
            maximumTrackTintColor="#ddd"
            thumbTintColor="#007AFF"
          />
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>İleri</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  video: {
    width: width - 32,
    height: (width - 32) * 0.6,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  cropControls: {
    marginTop: 20,
  },
  timeText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VideoCropScreen; 