import React, { useCallback, useMemo, useRef } from 'react';
import GorhomBottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

interface BottomSheetProps {
  children: React.ReactNode;
  snapPoints?: string[];
  onClose?: () => void;
}

export default function BottomSheet({ children, snapPoints: customSnapPoints, onClose }: BottomSheetProps) {
  const bottomSheetRef = useRef<GorhomBottomSheet>(null);
  const snapPoints = useMemo(() => customSnapPoints || ['25%', '50%'], [customSnapPoints]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    []
  );

  return (
    <GorhomBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onClose={onClose}
      backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      handleIndicatorStyle={{ backgroundColor: '#D1D5DB', width: 40 }}
    >
      <BottomSheetView style={{ flex: 1, padding: 16 }}>
        {children}
      </BottomSheetView>
    </GorhomBottomSheet>
  );
}
