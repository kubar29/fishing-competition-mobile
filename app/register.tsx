import axios from 'axios';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { registerUser } from '../src/api/authApi';
import { AppButton } from '../src/components/AppButton';
import { AppInput } from '../src/components/AppInput';
import { AppModal } from '../src/components/AppModal';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { colors } from '../src/constants/colors';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleRegister() {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    setErrorMessage('');

    if (isSubmitting) return;

    if (!trimmedFirstName || !trimmedLastName || !trimmedEmail || !password) {
      setErrorMessage('Uzupełnij wszystkie pola.');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMessage('Wpisz poprawny adres e-mail.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Hasło musi mieć minimum 8 znaków.');
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser({
        name: `${trimmedFirstName} ${trimmedLastName}`,
        email: trimmedEmail,
        password,
        role: 'USER',
      });

      setIsSuccessModalVisible(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setErrorMessage('Konto z takim adresem e-mail już istnieje.');
          return;
        }

        if (!error.response) {
          setErrorMessage('Brak połączenia z serwerem.');
          return;
        }
      }

      setErrorMessage('Nie udało się utworzyć konta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>FISHING</Text>
        <Text style={styles.logoAccent}>COMPETITION</Text>

        <Text style={styles.title}>Zarejestruj się</Text>
        <Text style={styles.subtitle}>Utwórz nowe konto</Text>

        <AppInput
          label="Imię"
          placeholder="Wpisz swoje imię"
          value={firstName}
          onChangeText={setFirstName}
        />

        <AppInput
          label="Nazwisko"
          placeholder="Wpisz swoje nazwisko"
          value={lastName}
          onChangeText={setLastName}
        />

        <AppInput
          label="E-mail"
          placeholder="Wpisz swój adres e-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <AppInput
          label="Hasło"
          placeholder="Wpisz swoje hasło"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        {isSubmitting ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <AppButton title="ZAREJESTRUJ SIĘ" onPress={handleRegister} />
        )}
        
        <Text style={styles.loginText}>
          Masz już konto?{' '}
          <Text style={styles.loginLink} onPress={() => router.push('/login')}>
            Zaloguj się
          </Text>
        </Text>
      </View>
      <AppModal
        visible={isSuccessModalVisible}
        title="Rejestracja zakończona"
        message="Twoje konto zostało utworzone pomyślnie. Możesz teraz przejść do logowania."
        primaryButtonText="PRZEJDŹ DO LOGOWANIA"
        onPrimaryPress={() => {
          setIsSuccessModalVisible(false);
          router.replace('/login');
        }}
      />
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
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
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