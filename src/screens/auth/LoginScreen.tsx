import React from "react";
import { View, Text, Pressable, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import KeyboardAvoidingWrapper from "@/components/layout/KeyboardAvoidingWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLogin, useGoogleAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/ui/Toast";
import { successHaptic } from "@/lib/haptics";
import { signInWithGoogle, getFirebaseIdToken } from "@/lib/firebase";
import GoogleLogo from "@/components/ui/GoogleLogo";
import { AuthStackParamList } from "@/types/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { t } = useTranslation();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const loginMutation = useLogin();
  const googleAuthMutation = useGoogleAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      const firebaseIdToken = await getFirebaseIdToken();

      googleAuthMutation.mutate(
        { id_token: firebaseIdToken },
        {
          onSuccess: (data) => {
            if (data.is_new_user && data.google_user) {
              navigation.navigate("GoogleCompleteProfile", {
                email: data.google_user.email,
                fullName: data.google_user.full_name,
                profilePhoto: data.google_user.profile_photo,
                idToken: firebaseIdToken,
              });
            } else {
              successHaptic();
            }
          },
          onError: (error) => {
            showToast(
              "error",
              "Error",
              error.message || "Google sign-in failed",
            );
          },
        },
      );
    } catch (error) {
      if (error instanceof Error && error.message === "cancelled") return;
      const message =
        error instanceof Error ? error.message : "Google sign-in failed";
      showToast("error", "Error", message);
    }
  };

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        successHaptic();
      },
      onError: (error) => {
        showToast("error", "Login Failed", error.message || "Login failed");
      },
    });
  };

  return (
    <SafeAreaScreen>
      <KeyboardAvoidingWrapper>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-8">
            <Image
              source={require("../../../assets/logo.png")}
              style={{ width: 220, height: 80 }}
              resizeMode="contain"
            />
            <Text className="text-sm text-textSecondary mt-1">
              Faith-centered community
            </Text>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t("auth.email")}
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
                label={t("auth.password")}
                value={value}
                onChangeText={onChange}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password?.message}
              />
            )}
          />

          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
            className="self-end mb-6"
          >
            <Text className="text-sm text-primary font-medium">
              {t("auth.forgotPassword")}
            </Text>
          </Pressable>

          <Button
            title={t("auth.login")}
            onPress={handleSubmit(onSubmit)}
            loading={loginMutation.isPending}
            fullWidth
            size="lg"
          />

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-sm text-textSecondary mx-4">or</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          <Pressable
            onPress={handleGoogleSignIn}
            disabled={googleAuthMutation.isPending}
            className="flex-row items-center justify-center border border-border rounded-xl py-3.5 bg-white"
          >
            <GoogleLogo size={20} />
            <Text className="text-base font-medium text-textPrimary ml-3">
              Continue with Google
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-sm text-textSecondary">
              {t("auth.noAccount")}{" "}
            </Text>
            <Pressable onPress={() => navigation.navigate("Register")}>
              <Text className="text-sm text-primary font-semibold">
                {t("auth.signUpLink")}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}
