import React from "react";
import { Modal as RNModal, Pressable, Text, StyleSheet } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  visible,
  onClose,
  title,
  children,
}: ModalProps) {
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
        {/* Inner Pressable stops taps from bubbling to the overlay. */}
        <Pressable
          onPress={() => {}}
          className="bg-surfaceContainerLowest rounded-2xl w-full max-w-sm p-6"
        >
          {title && (
            <Text className="text-lg text-textPrimary mb-4" style={styles.title}>
              {title}
            </Text>
          )}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: "Inter_700Bold" },
});
