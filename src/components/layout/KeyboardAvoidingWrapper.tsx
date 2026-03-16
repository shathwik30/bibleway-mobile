import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
}

export default function KeyboardAvoidingWrapper({ children }: KeyboardAvoidingWrapperProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
