import React, { useState } from 'react';
import { View, Text, Pressable, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface DatePickerProps {
  label?: string;
  value: string; // YYYY-MM-DD string
  onChange: (dateString: string) => void;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export default function DatePicker({
  label,
  value,
  onChange,
  error,
  maximumDate,
  minimumDate,
}: DatePickerProps) {
  const [show, setShow] = useState(false);

  const dateValue = value ? new Date(value) : new Date(2000, 0, 1);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  const displayText = value ? format(new Date(value), 'MMMM d, yyyy') : '';

  if (Platform.OS === 'ios') {
    return (
      <View className="mb-4">
        {label && (
          <Text className="text-sm font-medium text-textPrimary mb-1.5">{label}</Text>
        )}
        <Pressable
          onPress={() => setShow(true)}
          className={`flex-row items-center justify-between border rounded-lg px-3 py-3 bg-white ${
            error ? 'border-error' : 'border-border'
          }`}
        >
          <Text className={`text-base ${value ? 'text-textPrimary' : 'text-gray-400'}`}>
            {displayText || 'Select date...'}
          </Text>
          <Ionicons name="calendar-outline" size={18} color="#6B7280" />
        </Pressable>
        {error && <Text className="text-xs text-error mt-1">{error}</Text>}

        <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
          <Pressable onPress={() => setShow(false)} className="flex-1 bg-black/40" />
          <View className="bg-white rounded-t-2xl pb-8">
            <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
              <Text className="text-lg font-bold text-textPrimary">{label || 'Select Date'}</Text>
              <Pressable onPress={() => setShow(false)}>
                <Text className="text-base font-semibold text-primary">Done</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={dateValue}
              mode="date"
              display="spinner"
              onChange={handleChange}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              style={{ height: 200 }}
            />
          </View>
        </Modal>
      </View>
    );
  }

  // Android
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-textPrimary mb-1.5">{label}</Text>
      )}
      <Pressable
        onPress={() => setShow(true)}
        className={`flex-row items-center justify-between border rounded-lg px-3 py-3 bg-white ${
          error ? 'border-error' : 'border-border'
        }`}
      >
        <Text className={`text-base ${value ? 'text-textPrimary' : 'text-gray-400'}`}>
          {displayText || 'Select date...'}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
      </Pressable>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}

      {show && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
}
