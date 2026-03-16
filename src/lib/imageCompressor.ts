import * as ImageManipulator from 'expo-image-manipulator';
import { IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT, IMAGE_QUALITY } from '@/constants/app';

export async function compressImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: IMAGE_MAX_WIDTH, height: IMAGE_MAX_HEIGHT } }],
    {
      compress: IMAGE_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );
  return result.uri;
}
