import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Profil" />

      <View style={styles.card}>
        <Text style={styles.label}>Użytkownik</Text>
        <Text style={styles.value}>{user?.name ?? 'Brak danych'}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email ?? 'Brak danych'}</Text>

        <Text style={styles.label}>Rola</Text>
        <Text style={styles.value}>{user?.role ?? 'Brak danych'}</Text>
      </View>

      <AppButton title="WYLOGUJ SIĘ" variant="outline" onPress={handleLogout} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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