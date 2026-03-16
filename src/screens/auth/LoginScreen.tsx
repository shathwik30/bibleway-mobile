import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import SafeAreaScreen from '@/components/layout/SafeAreaScreen';
import KeyboardAvoidingWrapper from '@/components/layout/KeyboardAvoidingWrapper';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';
import { showToast } from '@/components/ui/Toast';
import { successHaptic } from '@/lib/haptics';
import { AuthStackParamList } from '@/types/navigation';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const loginMutation = useLogin();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        successHaptic();
      },
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.response?.data?.data?.detail || 'Login failed';
        showToast('error', 'Login Failed', message);
      },
    });
  };

  return (
    <SafeAreaScreen>
      <KeyboardAvoidingWrapper>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }} keyboardShouldPersistTaps="handled">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-primary">BibleWay</Text>
          <Text className="text-sm text-textSecondary mt-1">Faith-centered community</Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.email')}
              value={value}
              onChangeText={onChange}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              label={t('auth.password')}
              value={value}
              onChangeText={onChange}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Pressable onPress={() => navigation.navigate('ForgotPassword')} className="self-end mb-6">
          <Text className="text-sm text-primary font-medium">{t('auth.forgotPassword')}</Text>
        </Pressable>

        <Button
          title={t('auth.login')}
          onPress={handleSubmit(onSubmit)}
          loading={loginMutation.isPending}
          fullWidth
          size="lg"
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-sm text-textSecondary">{t('auth.noAccount')} </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text className="text-sm text-primary font-semibold">{t('auth.signUpLink')}</Text>
          </Pressable>
        </View>
      </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}
