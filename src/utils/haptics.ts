import * as Haptics from 'expo-haptics';

export function successHaptic() {
  return Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Success
  );
}

export function errorHaptic() {
  return Haptics.notificationAsync(
    Haptics.NotificationFeedbackType.Error
  );
}

export function lightHaptic() {
  return Haptics.impactAsync(
    Haptics.ImpactFeedbackStyle.Light
  );
}