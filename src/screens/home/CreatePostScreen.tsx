import React, { useState } from "react";
import { View, TextInput, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Button from "@/components/ui/Button";
import { useCreatePost } from "@/hooks/useSocial";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { useAuthStore } from "@/stores/authStore";
import { showToast } from "@/components/ui/Toast";

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [textContent, setTextContent] = useState("");
  const createMutation = useCreatePost();
  const { media, uploading, pickImages, removeMedia, uploadMedia } =
    useMediaUpload();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const text = textContent.trim();
    if (!text && media.length === 0) {
      showToast("error", "Error", "Please add some content");
      return;
    }

    if (media.length > 0 && !accessToken) {
      showToast("error", "Error", "Please log in again");
      return;
    }

    setSubmitting(true);
    try {
      let mediaKeys: string[] = [];
      let mediaTypes: string[] = [];
      if (media.length > 0) {
        const uploaded = await uploadMedia(accessToken!);
        mediaKeys = uploaded.keys;
        mediaTypes = uploaded.types;
      }

      await createMutation.mutateAsync({
        text_content: text,
        ...(mediaKeys.length > 0 && {
          media_keys: mediaKeys,
          media_types: mediaTypes,
        }),
      });

      showToast("success", "Posted", "Your post has been shared");
      navigation.goBack();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Something went wrong";
      showToast("error", "Error", msg);
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
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
          className="flex-1 text-base text-textPrimary p-3 bg-surface rounded-xl min-h-[120px]"
        />

        {media.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {media.map((item, i) => (
              <Pressable key={item.uri} onLongPress={() => removeMedia(i)}>
                <Image
                  source={{ uri: item.uri }}
                  className="w-20 h-20 rounded-lg"
                />
              </Pressable>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between py-4">
          <Pressable
            onPress={pickImages}
            disabled={isLoading}
            className="flex-row items-center p-2"
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={colors.primary.DEFAULT}
            />
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
