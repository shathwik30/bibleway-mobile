import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Text,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Avatar from "@/components/ui/Avatar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useMyProfile, useUpdateProfile } from "@/hooks/useProfile";
import { showToast } from "@/components/ui/Toast";
import { compressImage } from "@/lib/imageCompressor";
import { parseError } from "@/utils/parseError";
import { logger } from "@/utils/logger";
import { colors } from "@/theme/colors";

interface ProfileForm {
  full_name: string;
  bio: string;
  country: string;
  phone_number: string;
  date_of_birth: string;
}

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function buildPayload(
  data: ProfileForm,
  photoUri: string | null,
): FormData | Record<string, string> {
  if (!photoUri) {
    const payload: Record<string, string> = {
      full_name: data.full_name,
      bio: data.bio,
      country: data.country,
      phone_number: data.phone_number,
    };
    if (data.date_of_birth) payload.date_of_birth = data.date_of_birth;
    return payload;
  }

  const formData = new FormData();
  formData.append("full_name", data.full_name);
  formData.append("bio", data.bio);
  formData.append("country", data.country);
  formData.append("phone_number", data.phone_number);
  if (data.date_of_birth) formData.append("date_of_birth", data.date_of_birth);

  const filename = photoUri.split("/").pop() || "profile.jpg";
  // RN FormData accepts {uri, type, name} — Blob cast is a known RN quirk.
  formData.append("profile_photo", {
    uri: photoUri,
    name: filename,
    type: "image/jpeg",
  } as unknown as Blob);
  return formData;
}

export default function EditProfileScreen(): React.ReactElement {
  const navigation = useNavigation();
  const { data: profile } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<ProfileForm>({
      defaultValues: {
        full_name: "",
        bio: "",
        country: "",
        phone_number: "",
        date_of_birth: "",
      },
    });

  const dateOfBirth = watch("date_of_birth");

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
        country: profile.country || "",
        phone_number: profile.phone_number || "",
        date_of_birth: profile.date_of_birth || "",
      });
    }
  }, [profile, reset]);

  const pickImage = useCallback(async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_IMAGE_BYTES) {
        showToast("error", "Image too large", "Please choose an image under 10 MB.");
        return;
      }
      const compressed = await compressImage(asset.uri);
      setSelectedPhoto(compressed);
    } catch (err) {
      logger.error("[EditProfile] pickImage failed", err);
      showToast("error", "Error", parseError(err, "Could not open image picker"));
    }
  }, []);

  const onSubmit = useCallback(
    (data: ProfileForm): void => {
      const payload = buildPayload(data, selectedPhoto);
      updateMutation.mutate(payload, {
        onSuccess: () => {
          showToast("success", "Updated", "Profile updated successfully");
          navigation.goBack();
        },
        onError: (err) => {
          logger.error("[EditProfile] update failed", err);
          showToast("error", "Error", parseError(err, "Failed to update profile"));
        },
      });
    },
    [selectedPhoto, updateMutation, navigation],
  );

  const handleDateChange = useCallback(
    (_event: unknown, selectedDate?: Date): void => {
      setShowDatePicker(Platform.OS === "ios");
      if (selectedDate) {
        const iso = selectedDate.toISOString().split("T")[0];
        if (iso) setValue("date_of_birth", iso);
      }
    },
    [setValue],
  );

  const openDatePicker = useCallback((): void => {
    setShowDatePicker(true);
  }, []);

  const avatarSource = selectedPhoto || profile?.profile_photo || null;

  const computedAge = dateOfBirth
    ? Math.floor(
        (Date.now() - new Date(dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000),
      )
    : (profile?.age ?? null);

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Edit Profile" />
      <ScrollView
        className="flex-1 px-4 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-6">
          <Pressable
            onPress={pickImage}
            className="relative"
            accessibilityLabel="Change profile photo"
            accessibilityRole="button"
          >
            {avatarSource ? (
              <Image source={{ uri: avatarSource }} style={styles.avatar} />
            ) : (
              <Avatar source={null} name={profile?.full_name || ""} size={96} />
            )}
            <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-surfaceContainerLowest">
              <Ionicons name="camera" size={16} color={colors.onPrimary} />
            </View>
          </Pressable>
        </View>

        <Controller
          control={control}
          name="full_name"
          render={({ field: { onChange, value } }) => (
            <Input label="Full Name" value={value} onChangeText={onChange} />
          )}
        />
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Bio"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
            />
          )}
        />

        <View className="mb-4">
          <Text className="text-sm font-medium text-textSecondary mb-1.5">
            Date of Birth
          </Text>
          <Pressable
            onPress={openDatePicker}
            className="flex-row items-center justify-between bg-surfaceContainerLowest rounded-xl px-4 py-3"
            accessibilityLabel="Select date of birth"
            accessibilityRole="button"
          >
            <Text
              className={`text-base ${dateOfBirth ? "text-textPrimary" : "text-textTertiary"}`}
            >
              {dateOfBirth
                ? new Date(dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Select date of birth"}
            </Text>
            {computedAge !== null && computedAge > 0 ? (
              <View className="bg-primary/10 rounded-full px-2.5 py-1">
                <Text className="text-xs font-semibold text-primary">
                  {computedAge} yrs
                </Text>
              </View>
            ) : (
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textTertiary}
              />
            )}
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth ? new Date(dateOfBirth) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              onChange={handleDateChange}
            />
          )}
        </View>

        <Controller
          control={control}
          name="country"
          render={({ field: { onChange, value } }) => (
            <Input label="Country" value={value} onChangeText={onChange} />
          )}
        />
        <Controller
          control={control}
          name="phone_number"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Phone Number"
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
        <View className="mt-4 mb-8">
          <Button
            title="Save Changes"
            onPress={handleSubmit(onSubmit)}
            loading={updateMutation.isPending}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}

const styles = StyleSheet.create({
  avatar: { width: 96, height: 96, borderRadius: 48 },
});
