import React from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { IMG_ASPECT } from "./imageMap";
import type { ImageSourcePropType } from "react-native";

interface ZoomModalProps {
  visible: boolean;
  imageNumber: number | null;
  source: ImageSourcePropType | undefined;
  onClose: () => void;
}

export default function ZoomModal({
  visible,
  imageNumber,
  source,
  onClose,
}: ZoomModalProps) {
  const { width: SW } = useWindowDimensions();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.closeWrap}>
          <Pressable
            onPress={onClose}
            accessibilityLabel="Close zoom view"
            accessibilityRole="button"
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={colors.onPrimary} />
          </Pressable>
        </View>
        <View style={styles.captionWrap}>
          <Text style={styles.caption}>
            Pinch to zoom · Image {imageNumber}
          </Text>
        </View>
        <ReactNativeZoomableView
          maxZoom={4}
          minZoom={1}
          initialZoom={1}
          bindToBorders
          style={styles.zoom}
        >
          {source && (
            <Image
              source={source}
              style={{ width: SW, height: SW * IMG_ASPECT }}
              resizeMode="contain"
            />
          )}
        </ReactNativeZoomableView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.92)" },
  closeWrap: { position: "absolute", top: 50, right: 16, zIndex: 10 },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  captionWrap: { position: "absolute", top: 56, left: 0, right: 0, zIndex: 10 },
  caption: {
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  zoom: { flex: 1, justifyContent: "center", alignItems: "center" },
});
