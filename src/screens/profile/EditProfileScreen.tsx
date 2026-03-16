import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyProfile, useUpdateProfile } from '@/hooks/useProfile';
import { showToast } from '@/components/ui/Toast';
import { compressImage } from '@/lib/imageCompressor';

interface ProfileForm {
  full_name: string;
  bio: string;
  country: string;
  phone_number: string;
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { data: profile } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<ProfileForm>({
    defaultValues: { full_name: '', bio: '', country: '', phone_number: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        country: profile.country || '',
        phone_number: profile.phone_number || '',
      });
    }
  }, [profile, reset]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      setSelectedPhoto(compressed);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('bio', data.bio);
    formData.append('country', data.country);
    formData.append('phone_number', data.phone_number);

    if (selectedPhoto) {
      const filename = selectedPhoto.split('/').pop() || 'profile.jpg';
      formData.append('profile_photo', {
        uri: selectedPhoto,
        name: filename,
        type: 'image/jpeg',
      } as any);
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        showToast('success', 'Updated', 'Profile updated successfully');
        navigation.goBack();
      },
      onError: (error: any) => {
        showToast('error', 'Error', error?.response?.data?.message || 'Failed to update profile');
      },
    });
  };

  const avatarSource = selectedPhoto || profile?.profile_photo || null;

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Edit Profile" />
      <ScrollView className="flex-1 px-4 pt-4" keyboardShouldPersistTaps="handled">
        {/* Avatar with camera overlay */}
        <View className="items-center mb-6">
          <Pressable onPress={pickImage} className="relative">
            {avatarSource ? (
              <Image
                source={{ uri: avatarSource }}
                style={{ width: 96, height: 96, borderRadius: 48 }}
              />
            ) : (
              <Avatar source={null} name={profile?.full_name || ''} size={96} />
            )}
            <View
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white"
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </View>
          </Pressable>
        </View>

        <Controller control={control} name="full_name"
          render={({ field: { onChange, value } }) => (
            <Input label="Full Name" value={value} onChangeText={onChange} />
          )}
        />
        <Controller control={control} name="bio"
          render={({ field: { onChange, value } }) => (
            <Input label="Bio" value={value} onChangeText={onChange} multiline numberOfLines={3} />
          )}
        />
        <Controller control={control} name="country"
          render={({ field: { onChange, value } }) => (
            <Input label="Country" value={value} onChangeText={onChange} />
          )}
        />
        <Controller control={control} name="phone_number"
          render={({ field: { onChange, value } }) => (
            <Input label="Phone Number" value={value} onChangeText={onChange} keyboardType="phone-pad" />
          )}
        />
        <View className="mt-4 mb-8">
          <Button title="Save Changes" onPress={handleSubmit(onSubmit)} loading={updateMutation.isPending} fullWidth size="lg" />
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
