import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import GorhomBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { colors } from "@/theme/colors";

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  onClose?: () => void;
}

export default function BottomSheet({
  children,
  snapPoints: customSnapPoints,
  onClose,
}: BottomSheetProps) {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = useMemo(
    () => customSnapPoints || ["25%", "50%"],
    [customSnapPoints],
  );

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  return (
    <GorhomBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.content}>{children}</BottomSheetView>
    </GorhomBottomSheet>
  );
}

const styles = StyleSheet.create({
  background: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  handleIndicator: { backgroundColor: colors.outlineVariant, width: 40 },
  content: { flex: 1, padding: 16 },
});
