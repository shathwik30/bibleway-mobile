import React, { useState } from 'react';
import { View, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreatePrayer } from '@/hooks/useSocial';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useAuthStore } from '@/stores/authStore';
import { showToast } from '@/components/ui/Toast';

export default function CreatePrayerScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const createMutation = useCreatePrayer();
  const { media, uploading, pickImages, removeMedia, uploadMedia } = useMediaUpload();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast('error', 'Error', 'Please add a title');
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: Upload media if any
      let mediaKeys: string[] = [];
      let mediaTypes: string[] = [];
      if (media.length > 0) {
        const uploaded = await uploadMedia(accessToken ?? '');
        mediaKeys = uploaded.keys;
        mediaTypes = uploaded.types;
      }

      // Step 2: Create the prayer
      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        ...(mediaKeys.length > 0 && { media_keys: mediaKeys, media_types: mediaTypes }),
      });

      showToast('success', 'Submitted', 'Your prayer request has been shared');
      navigation.goBack();
    } catch (error: any) {
      console.error('Create prayer error:', error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        'Something went wrong';
      showToast('error', 'Error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = submitting || uploading || createMutation.isPending;

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
            {media.map((item, index) => (
              <Pressable key={index} onLongPress={() => removeMedia(index)}>
                <Image source={{ uri: item.uri }} className="w-20 h-20 rounded-lg" />
              </Pressable>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between py-4">
          <Pressable onPress={pickImages} disabled={isLoading} className="flex-row items-center p-2">
            <Ionicons name="image-outline" size={24} color="#4A6FA5" />
          </Pressable>
          <Button
            title="Submit"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={!title.trim() || isLoading}
          />
        </View>
      </View>
    </SafeAreaScreen>
  );
}
