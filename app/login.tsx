import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../src/components/AppButton';
import { AppInput } from '../src/components/AppInput';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { colors } from '../src/constants/colors';
import { useAuth } from '../src/context/AuthContext';

export default function LoginScreen() {
  const { login, user } = useAuth();


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)/competitions');
    }
  }, [user]);

  async function handleLogin() {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      await login(email, password);

      router.replace('/(tabs)/competitions');
    } catch (error) {
      setErrorMessage('Nieprawidłowy e-mail lub hasło.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>FISHING</Text>
        <Text style={styles.logoAccent}>COMPETITION</Text>

        <Text style={styles.title}>Zaloguj się</Text>
        <Text style={styles.subtitle}>Witamy ponownie</Text>

        <AppInput
          label="E-mail"
          placeholder="Wpisz swój adres e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          
        />

        <AppInput
          label="Hasło"
          placeholder="Wpisz swoje hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {isSubmitting ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <AppButton title="ZALOGUJ SIĘ" onPress={handleLogin} />
        )}

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
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
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