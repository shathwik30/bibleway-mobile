import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { speak, stopSpeaking, setSpeed, getSpeed } from '@/lib/tts';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';

interface ReadAloudControlsProps {
  text: string;
  language?: string;
}

const SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function ReadAloudControls({ text, language = 'en' }: ReadAloudControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(getSpeed());

  // Stop playback when text or language changes
  useEffect(() => {
    stopSpeaking();
    setIsPlaying(false);
  }, [text, language]);

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      speak(text, language, () => setIsPlaying(false));
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
      speak(text, language, () => setIsPlaying(false));
    }
  };

  const langName = SUPPORTED_LANGUAGES.find((l) => l.code === language)?.name || language;
  const statusText = isPlaying
    ? `Playing in ${langName}...`
    : language !== 'en'
      ? `Read Aloud (${langName})`
      : 'Read Aloud';

  return (
    <View className="flex-row items-center bg-primary/5 rounded-full px-4 py-2.5">
      <Pressable onPress={togglePlay} className="mr-3">
        <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={28} color="#4A6FA5" />
      </Pressable>
      <Text className="flex-1 text-sm text-primary font-medium" numberOfLines={1}>
        {statusText}
      </Text>
      <Pressable onPress={cycleSpeed} className="bg-primary/10 rounded-full px-2.5 py-1">
        <Text className="text-xs font-semibold text-primary">{currentSpeed}x</Text>
      </Pressable>
    </View>
  );
}
