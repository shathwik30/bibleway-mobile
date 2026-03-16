import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaScreenProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export default function SafeAreaScreen({ children, edges = ['top'] }: SafeAreaScreenProps) {
  return (
    <SafeAreaView edges={edges} className="flex-1 bg-white dark:bg-darkBg">
      {children}
    </SafeAreaView>
  );
}
