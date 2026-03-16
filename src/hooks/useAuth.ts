import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';
import { useAuthStore } from '@/stores/authStore';
import { AuthTokens } from '@/types/api';
import { UserProfile } from '@/types/models';

interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  preferred_language: string;
  country: string;
  phone_number?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<AuthTokens>(ENDPOINTS.auth.login, input),
    onSuccess: async (data) => {
      await setTokens(data as AuthTokens);
      // Fetch user profile
      const profile = await api.get<UserProfile>(ENDPOINTS.profile.me);
      setUser(profile);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post(ENDPOINTS.auth.register, input),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (input: { email: string; otp_code: string }) =>
      api.post(ENDPOINTS.auth.verifyEmail, input),
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: (input: { email: string }) =>
      api.post(ENDPOINTS.auth.resendOtp, input),
  });
}

export function usePasswordReset() {
  return useMutation({
    mutationFn: (input: { email: string }) =>
      api.post(ENDPOINTS.auth.passwordReset, input),
  });
}

export function usePasswordResetConfirm() {
  return useMutation({
    mutationFn: (input: { email: string; otp_code: string; new_password: string }) =>
      api.post(ENDPOINTS.auth.passwordResetConfirm, input),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: { old_password: string; new_password: string }) =>
      api.post(ENDPOINTS.auth.changePassword, input),
  });
}
