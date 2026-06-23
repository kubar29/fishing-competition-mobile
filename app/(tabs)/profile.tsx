import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Zalogowany użytkownik</Text>
        <Text style={styles.value}>user@example.com</Text>

        <Text style={styles.label}>Rola</Text>
        <Text style={styles.value}>USER</Text>
      </View>

      <AppButton
        title="WYLOGUJ SIĘ"
        variant="outline"
        onPress={() => router.replace('/login')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 24,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 8,
  },
  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 4,
  },
});