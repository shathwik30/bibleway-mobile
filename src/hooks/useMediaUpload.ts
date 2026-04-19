import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { compressImage } from "@/lib/imageCompressor";
import { api } from "@/api/client";
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

interface UploadedMedia {
  keys: string[];
  types: string[];
}

function makeFileName(ext: string, index: number): string {
  const unique =
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `media_${unique}_${index}.${ext}`;
}

export function useMediaUpload(): {
  media: SelectedMedia[];
  uploading: boolean;
  pickImages: () => Promise<void>;
  removeMedia: (index: number) => void;
  clearMedia: () => void;
  uploadMedia: () => Promise<UploadedMedia>;
} {
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES_PER_POST - media.length,
      quality: 1,
    });
    if (result.canceled) return;

    const picked = await Promise.all(
      result.assets.map(async (asset): Promise<SelectedMedia> => {
        if (asset.type === "video") return { uri: asset.uri, type: "video" };
        const compressedUri = await compressImage(asset.uri);
        return { uri: compressedUri, type: "image" };
      }),
    );
    setMedia((prev) => [...prev, ...picked].slice(0, MAX_IMAGES_PER_POST));
  };

  const removeMedia = (index: number): void => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const clearMedia = (): void => {
    setMedia([]);
  };

  const uploadMedia = async (): Promise<UploadedMedia> => {
    if (media.length === 0) return { keys: [], types: [] };

    setUploading(true);
    try {
      const formData = new FormData();
      media.forEach((item, i) => {
        const ext = item.type === "video" ? "mp4" : "jpg";
        const mime = item.type === "video" ? "video/mp4" : "image/jpeg";
        // RN's FormData accepts {uri, type, name}; the Blob cast is a known RN quirk.
        formData.append("files", {
          uri: item.uri,
          type: mime,
          name: makeFileName(ext, i),
        } as unknown as Blob);
      });

      const results = await api.post<UploadResponseItem[]>(
        ENDPOINTS.social.mediaUpload,
        formData,
      );

      return {
        keys: (results ?? []).map((r) => r.key),
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
