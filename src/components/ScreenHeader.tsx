import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type ScreenHeaderProps = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
};

export function ScreenHeader({ title, showBack = false, onBack} : ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? (
        <Ionicons
          name="arrow-back"
          size={26}
          color={colors.text}
          onPress={onBack}
        />
      ) : (
        <View style={styles.sideSpacer} />
      )}

      <Text style={styles.title}>{title}</Text>

      <View style={styles.sideSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideSpacer: {
    width: 26,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
});