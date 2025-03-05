import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import VideoSelectScreen from '../screens/VideoSelectScreen';
import VideoCropScreen from '../screens/VideoCropScreen';
import VideoMetadataScreen from '../screens/VideoMetadataScreen';
import VideoDetailScreen from '../screens/VideoDetailScreen';
import VideoEditScreen from '../screens/VideoEditScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Video Günlüğü' }} 
      />
      <Stack.Screen 
        name="VideoSelect" 
        component={VideoSelectScreen} 
        options={{ title: 'Video Seç' }} 
      />
      <Stack.Screen 
        name="VideoCrop" 
        component={VideoCropScreen} 
        options={{ title: 'Video Kırp' }} 
      />
      <Stack.Screen 
        name="VideoMetadata" 
        component={VideoMetadataScreen} 
        options={{ title: 'Video Bilgileri' }} 
      />
      <Stack.Screen 
        name="VideoDetail" 
        component={VideoDetailScreen} 
        options={{ title: 'Video Detayı' }} 
      />
      <Stack.Screen 
        name="VideoEdit" 
        component={VideoEditScreen} 
        options={{ title: 'Video Düzenle' }} 
      />
    </Stack.Navigator>
  );
};

export default MainNavigator; 