import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import SafeAreaScreen from "@/components/layout/SafeAreaScreen";
import KeyboardAvoidingWrapper from "@/components/layout/KeyboardAvoidingWrapper";
import ScreenHeader from "@/components/layout/ScreenHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import SelectPicker from "@/components/ui/SelectPicker";
import CountryPicker from "@/components/ui/CountryPicker";
import { useGoogleAuth } from "@/hooks/useAuth";
import { showToast } from "@/components/ui/Toast";
import { successHaptic } from "@/lib/haptics";
import { getFirebaseIdToken } from "@/lib/firebase";
import { SUPPORTED_LANGUAGES } from "@/constants/languages";
import type { AuthStackParamList } from "@/types/navigation";
import { fonts } from "@/theme/fonts";

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 13);

const minDate = new Date();
minDate.setFullYear(minDate.getFullYear() - 120);

const schema = z.object({
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  country: z.string().min(1, "Country is required"),
  preferred_language: z.string().min(1),
});

const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((lang) => ({
  label: `${lang.nativeName} (${lang.name})`,
  value: lang.code,
}));

type FormData = z.infer<typeof schema>;

const GENDER_OPTIONS = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export default function GoogleCompleteProfileScreen() {
  const { t } = useTranslation();
  const route =
    useRoute<RouteProp<AuthStackParamList, "GoogleCompleteProfile">>();
  const { email, fullName, profilePhoto, idToken: _idToken } = route.params;
  const googleAuth = useGoogleAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date_of_birth: "",
      gender: "",
      country: "",
      preferred_language: "en",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Get a fresh Firebase token in case the original expired
      const freshToken = await getFirebaseIdToken();
      googleAuth.mutate(
        {
          id_token: freshToken,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          country: data.country,
          preferred_language: data.preferred_language,
        },
        {
          onSuccess: (result) => {
            if (!result.is_new_user) {
              successHaptic();
            }
          },
          onError: (error) => {
            showToast(
              "error",
              "Error",
              error.message || "Something went wrong",
            );
          },
        },
      );
    } catch {
      showToast("error", "Error", "Session expired. Please try again.");
    }
  };

  return (
    <SafeAreaScreen>
      <ScreenHeader title="Complete Profile" showBack={false} />
      <KeyboardAvoidingWrapper>
        <ScrollView
          contentContainerStyle={{ padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mb-6">
            <Avatar source={profilePhoto || null} name={fullName} size={80} />
            <Text
              className="text-lg font-bold text-textPrimary mt-3"
              style={fonts.serifBold}
            >
              {fullName}
            </Text>
            <Text
              className="text-sm text-textSecondary"
              style={fonts.regular}
            >
              {email}
            </Text>
          </View>

          <Text
            className="text-base text-textSecondary mb-6 text-center"
            style={fonts.regular}
          >
            We need a few more details to set up your account
          </Text>

          <Controller
            control={control}
            name="date_of_birth"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                label={t("auth.dateOfBirth")}
                value={value}
                onChange={onChange}
                maximumDate={maxDate}
                minimumDate={minDate}
                error={errors.date_of_birth?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <SelectPicker
                label={t("auth.gender")}
                value={value}
                onChange={onChange}
                options={GENDER_OPTIONS}
                error={errors.gender?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => (
              <CountryPicker
                label={t("auth.country")}
                value={value}
                onChange={onChange}
                error={errors.country?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="preferred_language"
            render={({ field: { onChange, value } }) => (
              <SelectPicker
                label={t("auth.language")}
                placeholder="Select language..."
                options={LANGUAGE_OPTIONS}
                value={value}
                onChange={onChange}
                error={errors.preferred_language?.message}
              />
            )}
          />

          <View className="mt-4">
            <Button
              title="Continue"
              onPress={handleSubmit(onSubmit)}
              loading={googleAuth.isPending}
              fullWidth
              size="lg"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeAreaScreen>
  );
}
