import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SelectPicker from '@/components/ui/SelectPicker';
import CountryPicker from '@/components/ui/CountryPicker';
import DatePicker from '@/components/ui/DatePicker';
import { useRegister } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import { SUPPORTED_LANGUAGES } from '@/constants/languages';
import { AuthStackParamList } from '@/types/navigation';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  preferred_language: z.string().min(1),
  country: z.string().min(1, 'Country is required'),
  phone_number: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  label: `${lang.nativeName} (${lang.name})`,
  value: lang.code,
}));

// Maximum date = 13 years ago (minimum age)
const MAX_DOB = new Date();
MAX_DOB.setFullYear(MAX_DOB.getFullYear() - 13);

// Minimum date = 120 years ago
const MIN_DOB = new Date();
MIN_DOB.setFullYear(MIN_DOB.getFullYear() - 120);

export default function RegisterScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const registerMutation = useRegister();

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '', password: '', full_name: '', date_of_birth: '',
      gender: '', preferred_language: 'en', country: '', phone_number: '',
    },
  });

  const onSubmit = (data: RegisterForm) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        showToast('success', 'Account Created', 'Please verify your email');
        navigation.navigate('OTPVerification', { email: data.email, purpose: 'email_verification' });
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || 'Registration failed';
        showToast('error', 'Error', message);
      },
    });
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t('auth.register')} />
      <ScrollView className="flex-1 px-6 pt-2" keyboardShouldPersistTaps="handled">
        <Controller control={control} name="full_name"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.fullName')} value={value} onChangeText={onChange} error={errors.full_name?.message} />
          )}
        />
        <Controller control={control} name="email"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.email')} value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          )}
        />
        <Controller control={control} name="password"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.password')} value={value} onChangeText={onChange} secureTextEntry error={errors.password?.message} />
          )}
        />

        {/* Date of Birth - Date Picker */}
        <Controller control={control} name="date_of_birth"
          render={({ field: { onChange, value } }) => (
            <DatePicker
              label={t('auth.dateOfBirth')}
              value={value}
              onChange={onChange}
              maximumDate={MAX_DOB}
              minimumDate={MIN_DOB}
              error={errors.date_of_birth?.message}
            />
          )}
        />

        {/* Gender - Select Picker */}
        <Controller control={control} name="gender"
          render={({ field: { onChange, value } }) => (
            <SelectPicker
              label={t('auth.gender')}
              placeholder="Select gender..."
              options={GENDER_OPTIONS}
              value={value}
              onChange={onChange}
              error={errors.gender?.message}
            />
          )}
        />

        {/* Country - Searchable Country Picker */}
        <Controller control={control} name="country"
          render={({ field: { onChange, value } }) => (
            <CountryPicker
              label={t('auth.country')}
              value={value}
              onChange={onChange}
              error={errors.country?.message}
            />
          )}
        />

        {/* Preferred Language - Select Picker */}
        <Controller control={control} name="preferred_language"
          render={({ field: { onChange, value } }) => (
            <SelectPicker
              label={t('auth.language')}
              placeholder="Select language..."
              options={LANGUAGE_OPTIONS}
              value={value}
              onChange={onChange}
              error={errors.preferred_language?.message}
            />
          )}
        />

        <Controller control={control} name="phone_number"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.phone')} value={value ?? ''} onChangeText={onChange} keyboardType="phone-pad" />
          )}
        />

        <View className="mt-2 mb-8">
          <Button title={t('auth.register')} onPress={handleSubmit(onSubmit)} loading={registerMutation.isPending} fullWidth size="lg" />
        </View>
        <View className="flex-row justify-center mb-6">
          <Text className="text-sm text-textSecondary">{t('auth.hasAccount')} </Text>
          <Pressable onPress={() => navigation.goBack()}>
            <Text className="text-sm text-primary font-semibold">{t('auth.loginLink')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
