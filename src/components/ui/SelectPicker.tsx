import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectPickerProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function SelectPicker({
  label,
  placeholder = 'Select...',
  options,
  value,
  onChange,
  error,
}: SelectPickerProps) {
  const [visible, setVisible] = useState(false);
  const selectedOption = options.find((o) => o.value === value);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textPrimary mb-1.5">{label}</Text>
      )}
      <Pressable
        onPress={() => setVisible(true)}
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 bg-white ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <Text
          className={`text-base ${selectedOption ? 'text-textPrimary' : 'text-gray-400'}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </Pressable>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable onPress={() => setVisible(false)} className="flex-1 bg-black/40" />
        <View className="bg-white rounded-t-2xl max-h-[60%]">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
            <Text className="text-lg font-bold text-textPrimary">{label || 'Select'}</Text>
            <Pressable onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#1A1A2E" />
            </Pressable>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.value);
                  setVisible(false);
                }}
                className={`flex-row items-center justify-between px-4 py-3.5 border-b border-border/50 ${
                  value === item.value ? 'bg-primary/5' : ''
                }`}
              >
                <Text
                  className={`text-base ${
                    value === item.value ? 'text-primary font-semibold' : 'text-textPrimary'
                  }`}
                >
                  {item.label}
                </Text>
                {value === item.value && (
                  <Ionicons name="checkmark-circle" size={22} color="#4A6FA5" />
                )}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
