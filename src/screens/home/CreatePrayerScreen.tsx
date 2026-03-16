import React, { useState } from 'react';
import { View, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreatePrayer } from '@/hooks/useSocial';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { showToast } from '@/components/ui/Toast';

export default function CreatePrayerScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreatePrayer();
  const { media, uploading, pickImages, createFormData } = useMediaUpload();

  const handleSubmit = () => {
    if (!title.trim()) {
      showToast('error', 'Error', 'Please add a title');
      return;
    }
    const formData = createFormData({ title: title.trim(), description: description.trim() });
    createMutation.mutate(
      formData,
      {
        onSuccess: () => {
          showToast('success', 'Submitted', 'Your prayer request has been shared');
          navigation.goBack();
        },
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to create prayer request');
        },
      },
    );
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Prayer Request" />
      <View className="flex-1 px-4 pt-4">
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Prayer title"
          placeholderTextColor="#9CA3AF"
          className="text-lg font-semibold text-textPrimary p-3 bg-surface rounded-xl mb-3"
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your prayer request..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          className="flex-1 text-base text-textPrimary p-3 bg-surface rounded-xl min-h-[120px]"
        />

        {media.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {media.map((item: { uri: string }, index: number) => (
              <Image key={index} source={{ uri: item.uri }} className="w-20 h-20 rounded-lg" />
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between py-4">
          <Pressable onPress={pickImages} disabled={uploading} className="flex-row items-center p-2">
            <Ionicons name="image-outline" size={24} color="#4A6FA5" />
          </Pressable>
          <Button
            title="Submit"
            onPress={handleSubmit}
            loading={createMutation.isPending || uploading}
            disabled={!title.trim()}
          />
        </View>
      </View>
    </SafeAreaScreen>
  );
}
