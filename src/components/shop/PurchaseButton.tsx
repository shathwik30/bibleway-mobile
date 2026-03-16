import React from 'react';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';

interface PurchaseButtonProps {
  isFree: boolean;
  isPurchased: boolean;
  onPurchase: () => void;
  onDownload: () => void;
  loading?: boolean;
}

export default function PurchaseButton({ isFree, isPurchased, onPurchase, onDownload, loading = false }: PurchaseButtonProps) {
  if (isPurchased || isFree) {
    return (
      <Button
        title="Download"
        onPress={onDownload}
        loading={loading}
        leftIcon={<Ionicons name="download-outline" size={18} color="#FFFFFF" />}
        fullWidth
      />
    );
  }

  return (
    <Button
      title="Buy Now"
      onPress={onPurchase}
      loading={loading}
      leftIcon={<Ionicons name="cart-outline" size={18} color="#FFFFFF" />}
      fullWidth
    />
  );
}
