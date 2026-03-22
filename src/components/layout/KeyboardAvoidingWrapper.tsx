import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface KeyboardAvoidingWrapperProps {
  children: React.ReactNode;
  offset?: number;
}

export default function KeyboardAvoidingWrapper({ children, offset }: KeyboardAvoidingWrapperProps) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1"
      keyboardVerticalOffset={offset ?? (Platform.OS === 'ios' ? 90 : 24)}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
