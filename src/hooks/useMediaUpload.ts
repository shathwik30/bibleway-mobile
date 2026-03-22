import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { compressImage } from '@/lib/imageCompressor';
import { API_BASE_URL } from '@/constants/api';
import { ENDPOINTS } from '@/api/endpoints';
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
      mediaTypes: ['images', 'videos'],
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

  /**
   * Upload all selected media to UploadThing via the backend.
   * Uses fetch (not Axios) because RN Axios has issues with FormData file uploads on Android.
   */
  const uploadMedia = async (accessToken: string): Promise<{ keys: string[]; types: string[] }> => {
    if (media.length === 0) return { keys: [], types: [] };

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < media.length; i++) {
        const item = media[i];
        const ext = item.type === 'video' ? 'mp4' : 'jpg';
        formData.append('files', {
          uri: item.uri,
          type: item.type === 'video' ? 'video/mp4' : 'image/jpeg',
          name: `media_${i}.${ext}`,
        } as any);
      }

      const url = `${API_BASE_URL}${ENDPOINTS.social.mediaUpload}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || `Upload failed (${res.status})`);
      }

      const body = await res.json();
      // Backend returns { message, data: [{key, url}, ...] }
      const results: { key: string; url: string }[] = body?.data ?? body ?? [];

      return {
        keys: results.map((r) => r.key),
        types: media.map((m) => m.type),
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    media,
    uploading,
    pickImages,
    removeMedia,
    clearMedia,
    uploadMedia,
  };
}
