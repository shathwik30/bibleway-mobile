import React from 'react';
import { Modal as RNModal, View, Pressable, Text } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 items-center justify-center px-6"
      >
        <Pressable onPress={() => {}} className="bg-white rounded-2xl w-full max-w-sm p-6">
          {title && (
            <Text className="text-lg font-bold text-textPrimary mb-4">{title}</Text>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
