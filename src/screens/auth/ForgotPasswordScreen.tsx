import React from 'react';
import { View, Text } from 'react-native';
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
import { usePasswordReset } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import { AuthStackParamList } from '@/types/navigation';

const schema = z.object({ email: z.string().email('Invalid email') });

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const resetMutation = usePasswordReset();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = (data: { email: string }) => {
    resetMutation.mutate(data, {
      onSuccess: () => {
        showToast('success', 'Code Sent', 'Check your email for the reset code');
        navigation.navigate('OTPVerification', { email: data.email, purpose: 'password_reset' });
      },
      onError: (error: any) => showToast('error', 'Error', error?.response?.data?.message || 'Failed to send code'),
    });
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t('auth.forgotPasswordTitle')} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-base text-textSecondary text-center mb-8">{t('auth.forgotPasswordSubtitle')}</Text>
        <Controller control={control} name="email"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.email')} value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" error={errors.email?.message} />
          )}
        />
        <Button title={t('auth.sendResetCode')} onPress={handleSubmit(onSubmit)} loading={resetMutation.isPending} fullWidth size="lg" />
      </View>
    </SafeAreaScreen>
  );
}
