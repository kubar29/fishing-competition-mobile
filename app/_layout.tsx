import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '../src/constants/colors';
import { AuthProvider } from '../src/context/AuthContext';
import { JudgeStartProvider } from '../src/context/JudgeStartContext';

export default function RootLayout() {
  return (
  <AuthProvider>
    <JudgeStartProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          gestureEnabled: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </JudgeStartProvider>
  </AuthProvider>
);
}