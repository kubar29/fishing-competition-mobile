import { Modal, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { AppButton } from './AppButton';

type AppModalProps = {
  visible: boolean;
  title: string;
  message: string;
  primaryButtonText: string;
  onPrimaryPress: () => void;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
};

export function AppModal({
  visible,
  title,
  message,
  primaryButtonText,
  onPrimaryPress,
  secondaryButtonText,
  onSecondaryPress,
}: AppModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <AppButton title={primaryButtonText} onPress={onPrimaryPress} />

          {secondaryButtonText && onSecondaryPress ? (
            <AppButton
              title={secondaryButtonText}
              variant="outline"
              onPress={onSecondaryPress}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 22,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  secondaryText: {
    color: colors.muted,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 8,
  },
});