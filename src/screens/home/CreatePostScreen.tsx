import React, { useState } from 'react';
import { View, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreatePost } from '@/hooks/useSocial';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useAuthStore } from '@/stores/authStore';
import { showToast } from '@/components/ui/Toast';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [textContent, setTextContent] = useState('');
  const createMutation = useCreatePost();
  const { media, uploading, pickImages, removeMedia, uploadMedia } = useMediaUpload();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = textContent.trim();
    if (!text && media.length === 0) {
      showToast('error', 'Error', 'Please add some content');
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

      // Step 2: Create the post (mutateAsync so we await the result)
      await createMutation.mutateAsync({
        text_content: text,
        ...(mediaKeys.length > 0 && { media_keys: mediaKeys, media_types: mediaTypes }),
      });

      showToast('success', 'Posted', 'Your post has been shared');
      navigation.goBack();
    } catch (error: any) {
      console.error('Create post error:', JSON.stringify({
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        data: error?.response?.data,
        url: error?.config?.baseURL + error?.config?.url,
      }, null, 2));
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
      <ScreenHeader title="Create Post" />
      <View className="flex-1 px-4 pt-4">
        <TextInput
          value={textContent}
          onChangeText={setTextContent}
          placeholder="What's on your heart today?"
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
            title="Post"
            onPress={handleSubmit}
            loading={isLoading}
            disabled={(!textContent.trim() && media.length === 0) || isLoading}
          />
        </View>
      </View>
    </SafeAreaScreen>
  );
}
