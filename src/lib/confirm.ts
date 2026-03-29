import { Alert } from 'react-native';

export function confirmAction(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmLabel = 'Confirm',
) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
