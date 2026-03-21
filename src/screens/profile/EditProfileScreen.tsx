import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Image, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useMyProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useAuthStore } from '@/stores/authStore';
import { showToast } from '@/components/ui/Toast';
import { compressImage } from '@/lib/imageCompressor';
import { API_BASE_URL } from '@/constants/api';
import { ENDPOINTS } from '@/api/endpoints';

interface ProfileForm {
  full_name: string;
  bio: string;
  country: string;
  phone_number: string;
  date_of_birth: string;
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { data: profile } = useMyProfile();
  const updateMutation = useUpdateProfile();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { control, handleSubmit, reset, setValue, watch } = useForm<ProfileForm>({
    defaultValues: { full_name: '', bio: '', country: '', phone_number: '', date_of_birth: '' },
  });

  const dateOfBirth = watch('date_of_birth');

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        country: profile.country || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
  }, [profile, reset]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await compressImage(result.assets[0].uri);
      setSelectedPhoto(compressed);
    }
  };

  const accessToken = useAuthStore((s) => s.accessToken);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: ProfileForm) => {
    if (selectedPhoto) {
      // Use fetch (not Axios) for FormData with file uploads —
      // same pattern as post media uploads (Axios has Android FormData issues).
      setSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('full_name', data.full_name);
        formData.append('bio', data.bio);
        formData.append('country', data.country);
        formData.append('phone_number', data.phone_number);
        if (data.date_of_birth) {
          formData.append('date_of_birth', data.date_of_birth);
        }

        const filename = selectedPhoto.split('/').pop() || 'profile.jpg';
        formData.append('profile_photo', {
          uri: selectedPhoto,
          name: filename,
          type: 'image/jpeg',
        } as any);

        const url = `${API_BASE_URL}${ENDPOINTS.profile.me}`;
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true',
          },
          body: formData,
        });

        const body = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(body?.message || body?.detail || `Update failed (${res.status})`);
        }

        showToast('success', 'Updated', 'Profile updated successfully');
        navigation.goBack();
      } catch (error: any) {
        showToast('error', 'Error', error?.message || 'Failed to update profile');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Use JSON when no image — simpler and more reliable
      const payload: Record<string, string> = {
        full_name: data.full_name,
        bio: data.bio,
        country: data.country,
        phone_number: data.phone_number,
      };
      if (data.date_of_birth) {
        payload.date_of_birth = data.date_of_birth;
      }

      updateMutation.mutate(payload, {
        onSuccess: () => {
          showToast('success', 'Updated', 'Profile updated successfully');
          navigation.goBack();
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message
            || error?.response?.data?.detail
            || error?.message
            || 'Failed to update profile';
          showToast('error', 'Error', msg);
        },
      });
    }
  };

  const avatarSource = selectedPhoto || profile?.profile_photo || null;

  // Compute age from date_of_birth for display
  const computedAge = dateOfBirth
    ? Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : profile?.age ?? null;

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      setValue('date_of_birth', iso);
    }
  };

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

        {/* Date of Birth / Age */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-textSecondary mb-1.5">Date of Birth</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-surface border border-border rounded-xl px-4 py-3"
          >
            <Text className={`text-base ${dateOfBirth ? 'text-textPrimary' : 'text-textTertiary'}`}>
              {dateOfBirth
                ? new Date(dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'Select date of birth'}
            </Text>
            {computedAge !== null && computedAge > 0 ? (
              <View className="bg-primary/10 rounded-full px-2.5 py-1">
                <Text className="text-xs font-semibold text-primary">{computedAge} yrs</Text>
              </View>
            ) : (
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
            )}
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth ? new Date(dateOfBirth) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              minimumDate={new Date(1920, 0, 1)}
              onChange={handleDateChange}
            />
          )}
        </View>

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
          <Button title="Save Changes" onPress={handleSubmit(onSubmit)} loading={submitting || updateMutation.isPending} fullWidth size="lg" />
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
