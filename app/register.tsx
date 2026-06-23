import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { AppInput } from '../src/components/AppInput';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { colors } from '../src/constants/colors';

export default function RegisterScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>FISHING</Text>
        <Text style={styles.logoAccent}>COMPETITION</Text>

        <Text style={styles.title}>Zarejestruj się</Text>
        <Text style={styles.subtitle}>Utwórz nowe konto</Text>

        <AppInput label="Imię" placeholder="Wpisz swoje imię" />
        <AppInput label="Nazwisko" placeholder="Wpisz swoje nazwisko" />
        <AppInput label="E-mail" placeholder="Wpisz swój adres e-mail" />
        <AppInput label="Hasło" placeholder="Wpisz swoje hasło" secureTextEntry />

        <AppButton
          title="ZAREJESTRUJ SIĘ"
          onPress={() => router.replace('/(tabs)/competitions')}
        />

        <Text style={styles.loginText}>
          Masz już konto?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/login')}>
            Zaloguj się
          </Text>
        </Text>
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
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginText: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 16,
  },
  loginLink: {
    color: colors.blue,
    fontWeight: '700',
  },
});
