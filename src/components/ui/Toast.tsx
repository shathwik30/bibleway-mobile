import React from 'react';
import { View, Text, Pressable } from 'react-native';
import RNToast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { successHaptic, errorHaptic } from '@/lib/haptics';
import { useAppStore } from '@/stores/appStore';

interface ToastProps {
  text1?: string;
  text2?: string;
  onPress?: () => void;
  hide?: () => void;
}

const TOAST_STYLES = {
  success: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    border: 'border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/80',
    iconColor: '#059669',
    iconName: 'checkmark-circle' as const,
    titleColor: 'text-emerald-900 dark:text-emerald-100',
    messageColor: 'text-emerald-700 dark:text-emerald-300',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/60',
    border: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-900/80',
    iconColor: '#DC2626',
    iconName: 'close-circle' as const,
    titleColor: 'text-red-900 dark:text-red-100',
    messageColor: 'text-red-700 dark:text-red-300',
  },
};

function CustomToast({ type, props }: { type: 'success' | 'error'; props: ToastProps }) {
  const style = TOAST_STYLES[type];
  const isDark = useAppStore((s) => s.isDark);

  return (
    <Animated.View
      entering={FadeInUp.duration(300).springify()}
      exiting={FadeOutUp.duration(200)}
      className="w-[92%] mx-auto"
    >
      <Pressable
        onPress={props.hide}
        className={`flex-row items-center px-4 py-3.5 rounded-2xl border ${style.bg} ${style.border}`}
        style={{
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        {/* Icon */}
        <View className={`w-9 h-9 rounded-full items-center justify-center ${style.iconBg}`}>
          <Ionicons
            name={style.iconName}
            size={20}
            color={isDark ? (type === 'success' ? '#34D399' : '#F87171') : style.iconColor}
          />
        </View>

        {/* Text */}
        <View className="flex-1 ml-3">
          {props.text1 ? (
            <Text className={`text-sm font-semibold ${style.titleColor}`} numberOfLines={1}>
              {props.text1}
            </Text>
          ) : null}
          {props.text2 ? (
            <Text className={`text-xs mt-0.5 ${style.messageColor}`} numberOfLines={2}>
              {props.text2}
            </Text>
          ) : null}
        </View>

        {/* Dismiss */}
        <Pressable onPress={props.hide} className="p-1 ml-2" hitSlop={8}>
          <Ionicons
            name="close"
            size={16}
            color={isDark ? '#9CA3AF' : '#9CA3AF'}
          />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export const toastConfig = {
  success: (props: ToastProps) => <CustomToast type="success" props={props} />,
  error: (props: ToastProps) => <CustomToast type="error" props={props} />,
};

export function showToast(type: 'success' | 'error', title: string, message?: string) {
  if (type === 'success') {
    successHaptic();
  } else if (type === 'error') {
    errorHaptic();
  }

  RNToast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 3500,
    topOffset: 54,
  });
}
