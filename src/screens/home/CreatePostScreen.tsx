import React, { useState } from 'react';
import { View, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useCreatePost } from '@/hooks/useSocial';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { showToast } from '@/components/ui/Toast';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [textContent, setTextContent] = useState('');
  const createMutation = useCreatePost();
  const { media, uploading, pickImages, createFormData } = useMediaUpload();

  const handleSubmit = () => {
    if (!textContent.trim() && media.length === 0) {
      showToast('error', 'Error', 'Please add some content');
      return;
    }
    const formData = createFormData({ text_content: textContent.trim() });
    createMutation.mutate(
      formData,
      {
        onSuccess: () => {
          showToast('success', 'Posted', 'Your post has been shared');
          navigation.goBack();
        },
        onError: (error: any) => {
          showToast('error', 'Error', error?.response?.data?.message || 'Failed to create post');
        },
      },
    );
  };

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
            title="Post"
            onPress={handleSubmit}
            loading={createMutation.isPending || uploading}
            disabled={!textContent.trim() && media.length === 0}
          />
        </View>
      </View>
    </SafeAreaScreen>
  );
}
