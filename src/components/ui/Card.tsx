import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: boolean;
}

export default function Card({ children, padding = true, className = '', ...props }: CardProps & { className?: string }) {
  return (
    <View
      className={`bg-white rounded-xl border border-border ${padding ? 'p-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
