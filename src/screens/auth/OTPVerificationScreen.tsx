import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import ScreenHeader from '@/components/layout/ScreenHeader';
import Button from '@/components/ui/Button';
import { useVerifyEmail, useResendOtp } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import { successHaptic } from '@/lib/haptics';
import { AuthStackParamList } from '@/types/navigation';

export default function OTPVerificationScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'OTPVerification'>>();
  const { email, purpose } = route.params;

  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendOtp();
  const hasAutoSubmitted = useRef(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerify = () => {
    verifyMutation.mutate({ email, otp_code: otp }, {
      onSuccess: () => {
        successHaptic();
        showToast('success', 'Verified', 'Email verified successfully');
        if (purpose === 'password_reset') {
          navigation.navigate('ResetPassword', { email });
        } else {
          navigation.navigate('Login');
        }
      },
      onError: (error: any) => {
        showToast('error', 'Error', error?.response?.data?.message || 'Invalid OTP');
      },
    });
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !hasAutoSubmitted.current && !verifyMutation.isPending) {
      hasAutoSubmitted.current = true;
      handleVerify();
    }
    if (otp.length < 6) {
      hasAutoSubmitted.current = false;
    }
  }, [otp]);

  const handleResend = () => {
    resendMutation.mutate({ email }, {
      onSuccess: () => {
        setCountdown(60);
        showToast('success', 'Sent', 'OTP code resent');
      },
    });
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title={t('auth.otpTitle')} />
      <View className="flex-1 px-6 pt-8">
        <Text className="text-base text-textSecondary text-center mb-2">{t('auth.otpSubtitle')}</Text>
        <Text className="text-base font-semibold text-textPrimary text-center mb-8">{email}</Text>

        <TextInput
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
          placeholder="000000"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          maxLength={6}
          autoFocus={true}
          className="text-3xl text-center font-bold text-textPrimary tracking-[12px] border-b-2 border-border pb-3 mb-8"
        />

        <Button title="Verify" onPress={handleVerify} disabled={otp.length !== 6} loading={verifyMutation.isPending} fullWidth size="lg" />

        <View className="items-center mt-6">
          {countdown > 0 ? (
            <Text className="text-sm text-textSecondary">{t('auth.otpResendIn', { seconds: countdown })}</Text>
          ) : (
            <Button title={t('auth.otpResend')} onPress={handleResend} variant="ghost" loading={resendMutation.isPending} />
          )}
        </View>
      </View>
    </SafeAreaScreen>
  );
}
