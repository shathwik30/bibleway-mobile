import React from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { usePasswordResetConfirm } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import { AuthStackParamList } from '@/types/navigation';

const schema = z.object({
  otp_code: z.string().length(6, 'OTP must be 6 digits'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ResetPassword'>>();
  const { email } = route.params;
  const resetMutation = usePasswordResetConfirm();
  const { control, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { otp_code: '', new_password: '' } });

  const onSubmit = (data: { otp_code: string; new_password: string }) => {
    resetMutation.mutate({ email, ...data }, {
      onSuccess: () => {
        showToast('success', 'Success', 'Password reset successfully');
        navigation.navigate('Login');
      },
      onError: (error: any) => showToast('error', 'Error', error?.response?.data?.message || 'Failed to reset password'),
    });
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t('auth.resetPasswordTitle')} />
      <View className="flex-1 px-6 pt-8">
        <Controller control={control} name="otp_code"
          render={({ field: { onChange, value } }) => (
            <Input label="OTP Code" value={value} onChangeText={onChange} keyboardType="number-pad" maxLength={6} error={errors.otp_code?.message} />
          )}
        />
        <Controller control={control} name="new_password"
          render={({ field: { onChange, value } }) => (
            <Input label={t('auth.newPassword')} value={value} onChangeText={onChange} secureTextEntry error={errors.new_password?.message} />
          )}
        />
        <Button title={t('auth.resetPassword')} onPress={handleSubmit(onSubmit)} loading={resetMutation.isPending} fullWidth size="lg" />
      </View>
    </SafeAreaScreen>
  );
}
