import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speak, stopSpeaking, setSpeed, getSpeed } from '@/lib/tts';

interface ReadAloudControlsProps {
  text: string;
  language?: string;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function ReadAloudControls({ text, language = 'en' }: ReadAloudControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(getSpeed());

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speak(text, language);
      setIsPlaying(true);
    }
  };

  const cycleSpeed = () => {
    const currentIndex = SPEEDS.indexOf(currentSpeed);
    const nextIndex = (currentIndex + 1) % SPEEDS.length;
    const newSpeed = SPEEDS[nextIndex];
    setSpeed(newSpeed);
    setCurrentSpeed(newSpeed);
    if (isPlaying) {
      stopSpeaking();
      speak(text, language);
    }
  };

  return (
    <View className="flex-row items-center bg-primary/10 rounded-full px-4 py-2 mx-4 mb-3">
      <Pressable onPress={togglePlay} className="mr-3">
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#4A6FA5" />
      </Pressable>
      <Text className="flex-1 text-sm text-primary font-medium">
        {isPlaying ? 'Playing...' : 'Read Aloud'}
      </Text>
      <Pressable onPress={cycleSpeed} className="bg-primary/20 rounded-full px-2 py-0.5">
        <Text className="text-xs font-semibold text-primary">{currentSpeed}x</Text>
      </Pressable>
    </View>
  );
}
