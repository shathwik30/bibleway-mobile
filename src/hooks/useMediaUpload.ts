import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '@/lib/imageCompressor';
import { MAX_IMAGES_PER_POST } from '@/constants/app';

interface SelectedMedia {
  uri: string;
  type: 'image' | 'video';
}

export function useMediaUpload() {
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES_PER_POST - media.length,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedia: SelectedMedia[] = [];
      for (const asset of result.assets) {
        const isVideo = asset.type === 'video';
        if (isVideo) {
          newMedia.push({ uri: asset.uri, type: 'video' });
        } else {
          const compressedUri = await compressImage(asset.uri);
          newMedia.push({ uri: compressedUri, type: 'image' });
        }
      }
      setMedia((prev) => [...prev, ...newMedia].slice(0, MAX_IMAGES_PER_POST));
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const clearMedia = () => setMedia([]);

  const createFormData = (textFields: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(textFields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    media.forEach((item, index) => {
      const ext = item.type === 'video' ? 'mp4' : 'jpg';
      formData.append('media_files', {
        uri: item.uri,
        type: item.type === 'video' ? 'video/mp4' : 'image/jpeg',
        name: `media_${index}.${ext}`,
      } as any);
      formData.append('media_types', item.type);
    });
    return formData;
  };

  return {
    media,
    uploading,
    setUploading,
    pickImages,
    removeMedia,
    clearMedia,
    createFormData,
  };
}
