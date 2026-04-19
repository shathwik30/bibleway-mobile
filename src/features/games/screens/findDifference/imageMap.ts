import type { ImageSourcePropType } from "react-native";

/*
 * Static require() map for every level. React Native requires assets to be
 * declared as literal string arguments to require(), so we can't build this
 * programmatically. Keeping it in its own file so the main game logic stays
 * readable and the 60 require() calls live alongside their purpose.
 */

export const IMG1_MAP: Record<number, ImageSourcePropType> = {
  1: require("../../../../assets/find-the-difference/lvl1_img1.png"),
  2: require("../../../../assets/find-the-difference/lvl2_img1.png"),
  3: require("../../../../assets/find-the-difference/lvl3_img1.png"),
  4: require("../../../../assets/find-the-difference/lvl4_img1.png"),
  5: require("../../../../assets/find-the-difference/lvl5_img1.png"),
  6: require("../../../../assets/find-the-difference/lvl6_img1.png"),
  7: require("../../../../assets/find-the-difference/lvl7_img1.png"),
  8: require("../../../../assets/find-the-difference/lvl8_img1.png"),
  9: require("../../../../assets/find-the-difference/lvl9_img1.png"),
  10: require("../../../../assets/find-the-difference/lvl10_img1.png"),
  11: require("../../../../assets/find-the-difference/lvl11_img1.png"),
  12: require("../../../../assets/find-the-difference/lvl12_img1.png"),
  13: require("../../../../assets/find-the-difference/lvl13_img1.png"),
  14: require("../../../../assets/find-the-difference/lvl14_img1.png"),
  15: require("../../../../assets/find-the-difference/lvl15_img1.png"),
  16: require("../../../../assets/find-the-difference/lvl16_img1.png"),
  17: require("../../../../assets/find-the-difference/lvl17_img1.png"),
  18: require("../../../../assets/find-the-difference/lvl18_img1.png"),
  19: require("../../../../assets/find-the-difference/lvl19_img1.png"),
  20: require("../../../../assets/find-the-difference/lvl20_img1.png"),
  21: require("../../../../assets/find-the-difference/lvl21_img1.png"),
  22: require("../../../../assets/find-the-difference/lvl22_img1.png"),
  23: require("../../../../assets/find-the-difference/lvl23_img1.png"),
  24: require("../../../../assets/find-the-difference/lvl24_img1.png"),
  25: require("../../../../assets/find-the-difference/lvl25_img1.png"),
  26: require("../../../../assets/find-the-difference/lvl26_img1.png"),
  27: require("../../../../assets/find-the-difference/lvl27_img1.png"),
  28: require("../../../../assets/find-the-difference/lvl28_img1.png"),
  29: require("../../../../assets/find-the-difference/lvl29_img1.png"),
  30: require("../../../../assets/find-the-difference/lvl30_img1.png"),
};

export const IMG2_MAP: Record<number, ImageSourcePropType> = {
  1: require("../../../../assets/find-the-difference/lvl1_img2.png"),
  2: require("../../../../assets/find-the-difference/lvl2_img2.png"),
  3: require("../../../../assets/find-the-difference/lvl3_img2.png"),
  4: require("../../../../assets/find-the-difference/lvl4_img2.png"),
  5: require("../../../../assets/find-the-difference/lvl5_img2.png"),
  6: require("../../../../assets/find-the-difference/lvl6_img2.png"),
  7: require("../../../../assets/find-the-difference/lvl7_img2.png"),
  8: require("../../../../assets/find-the-difference/lvl8_img2.png"),
  9: require("../../../../assets/find-the-difference/lvl9_img2.png"),
  10: require("../../../../assets/find-the-difference/lvl10_img2.png"),
  11: require("../../../../assets/find-the-difference/lvl11_img2.png"),
  12: require("../../../../assets/find-the-difference/lvl12_img2.png"),
  13: require("../../../../assets/find-the-difference/lvl13_img2.png"),
  14: require("../../../../assets/find-the-difference/lvl14_img2.png"),
  15: require("../../../../assets/find-the-difference/lvl15_img2.png"),
  16: require("../../../../assets/find-the-difference/lvl16_img2.png"),
  17: require("../../../../assets/find-the-difference/lvl17_img2.png"),
  18: require("../../../../assets/find-the-difference/lvl18_img2.png"),
  19: require("../../../../assets/find-the-difference/lvl19_img2.png"),
  20: require("../../../../assets/find-the-difference/lvl20_img2.png"),
  21: require("../../../../assets/find-the-difference/lvl21_img2.png"),
  22: require("../../../../assets/find-the-difference/lvl22_img2.png"),
  23: require("../../../../assets/find-the-difference/lvl23_img2.png"),
  24: require("../../../../assets/find-the-difference/lvl24_img2.png"),
  25: require("../../../../assets/find-the-difference/lvl25_img2.png"),
  26: require("../../../../assets/find-the-difference/lvl26_img2.png"),
  27: require("../../../../assets/find-the-difference/lvl27_img2.png"),
  28: require("../../../../assets/find-the-difference/lvl28_img2.png"),
  29: require("../../../../assets/find-the-difference/lvl29_img2.png"),
  30: require("../../../../assets/find-the-difference/lvl30_img2.png"),
};

export const IMG_ASPECT = 1024 / 1536;
