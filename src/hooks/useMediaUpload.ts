import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { compressImage } from "@/lib/imageCompressor";
import { API_BASE_URL } from "@/constants/api";
import { ENDPOINTS } from "@/api/endpoints";
import { MAX_IMAGES_PER_POST } from "@/constants/app";

interface SelectedMedia {
  uri: string;
  type: "image" | "video";
}

interface UploadResponseItem {
  key: string;
  url: string;
}

interface UploadResponseBody {
  data?: UploadResponseItem[];
}

interface UploadErrorBody {
  message?: string;
}

export function useMediaUpload() {
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES_PER_POST - media.length,
      quality: 1,
    });

    if (!result.canceled) {
      const newMedia: SelectedMedia[] = await Promise.all(
        result.assets.map(async (asset) => {
          if (asset.type === "video") {
            return { uri: asset.uri, type: "video" as const };
          }
          const compressedUri = await compressImage(asset.uri);
          return { uri: compressedUri, type: "image" as const };
        }),
      );
      setMedia((prev) => [...prev, ...newMedia].slice(0, MAX_IMAGES_PER_POST));
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const clearMedia = () => setMedia([]);

  const uploadMedia = async (
    accessToken: string,
  ): Promise<{ keys: string[]; types: string[] }> => {
    if (media.length === 0) return { keys: [], types: [] };

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < media.length; i++) {
        const item = media[i];
        const ext = item.type === "video" ? "mp4" : "jpg";
        const uniqueId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        formData.append("files", {
          uri: item.uri,
          type: item.type === "video" ? "video/mp4" : "image/jpeg",
          name: `media_${uniqueId}_${i}.${ext}`,
        } as unknown as Blob);
      }

      const url = `${API_BASE_URL}${ENDPOINTS.social.mediaUpload}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(__DEV__ && { "ngrok-skip-browser-warning": "true" }),
        },
        body: formData,
      });

      if (!res.ok) {
        const errBody: UploadErrorBody | null = await res
          .json()
          .catch((): null => null);
        throw new Error(errBody?.message || `Upload failed (${res.status})`);
      }

      const body: UploadResponseBody = await res.json();
      const results: UploadResponseItem[] = body?.data ?? [];

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
