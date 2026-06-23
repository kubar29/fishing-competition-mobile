import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
};

export function AppButton({
  title,
  onPress,
  variant = 'primary',
}: AppButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, isPrimary ? styles.primary : styles.outline]}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.outlineText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#111827',
  },
  outlineText: {
    color: colors.white,
  },
});