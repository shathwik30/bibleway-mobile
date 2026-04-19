import React, { useState } from "react";
import { View, TextInput, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Button from "@/components/ui/Button";
import { useCreatePrayer } from "@/features/feed/hooks/useSocial";
import { useMediaUpload } from "@/features/feed/hooks/useMediaUpload";
import { showToast } from "@/components/ui/Toast";
import { parseError } from "@/utils/parseError";
import { logger } from "@/utils/logger";
import { fonts } from "@/theme/fonts";

export default function CreatePrayerScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const createMutation = useCreatePrayer();
  const { media, uploading, pickImages, removeMedia, uploadMedia } =
    useMediaUpload();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast("error", "Error", "Please add a title");
      return;
    }

    setSubmitting(true);
    try {
      let mediaKeys: string[] = [];
      let mediaTypes: string[] = [];
      if (media.length > 0) {
        const uploaded = await uploadMedia();
        mediaKeys = uploaded.keys;
        mediaTypes = uploaded.types;
      }

      await createMutation.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        ...(mediaKeys.length > 0 && {
          media_keys: mediaKeys,
          media_types: mediaTypes,
        }),
      });

      showToast("success", "Submitted", "Your prayer request has been shared");
      navigation.goBack();
    } catch (err) {
      logger.error("[CreatePrayer] submit failed", err);
      showToast("error", "Error", parseError(err));
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
          placeholderTextColor={colors.textTertiary}
          className="text-lg font-semibold text-textPrimary p-3 bg-surfaceContainerHigh rounded-xl mb-3"
          style={fonts.semibold}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your prayer request..."
          placeholderTextColor={colors.textTertiary}
          multiline
          textAlignVertical="top"
          className="flex-1 text-base text-textPrimary p-3 bg-surfaceContainerHigh rounded-xl min-h-[120px]"
          style={fonts.regular}
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
