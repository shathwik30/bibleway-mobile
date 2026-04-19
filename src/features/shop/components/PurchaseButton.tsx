import React from "react";
import Button from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";

interface PurchaseButtonProps {
  isFree: boolean;
  isPurchased: boolean;
  onPurchase: () => void;
  onDownload: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function PurchaseButton({
  isFree,
  isPurchased,
  onPurchase,
  onDownload,
  loading = false,
  disabled = false,
}: PurchaseButtonProps) {
  if (isPurchased || isFree) {
    return (
      <Button
        title="Download"
        onPress={onDownload}
        loading={loading}
        disabled={disabled}
        leftIcon={
          <Ionicons name="download-outline" size={18} color={colors.onPrimary} />
        }
        fullWidth
      />
    );
  }

  return (
    <Button
      title="Buy Now"
      onPress={onPurchase}
      loading={loading}
      disabled={disabled}
      leftIcon={
        <Ionicons name="cart-outline" size={18} color={colors.onPrimary} />
      }
      fullWidth
    />
  );
}
