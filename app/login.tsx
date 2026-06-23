import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { AppInput } from '../src/components/AppInput';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { colors } from '../src/constants/colors';

export default function LoginScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>FISHING</Text>
        <Text style={styles.logoAccent}>COMPETITION</Text>

        <Text style={styles.title}>Zaloguj się</Text>
        <Text style={styles.subtitle}>Witamy ponownie</Text>

        <AppInput label="E-mail" placeholder="Wpisz swój adres e-mail" />
        <AppInput label="Hasło" placeholder="Wpisz swoje hasło" secureTextEntry />

        <AppButton
          title="ZALOGUJ SIĘ"
          onPress={() => router.replace('/(tabs)/competitions')}
        />

        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>lub</Text>
          <View style={styles.divider} />
        </View>

        <AppButton
          title="ZAREJESTRUJ SIĘ"
          variant="outline"
          onPress={() => router.push('/register')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  logoAccent: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.muted,
  },
  dividerText: {
    color: colors.muted,
    marginHorizontal: 12,
    fontWeight: '600',
  },
});