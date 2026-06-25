import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AppButton } from '../../src/components/AppButton';
import { AppInput } from '../../src/components/AppInput';
import { FormSection } from '../../src/components/FormSection';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors } from '../../src/constants/colors';

export default function SearchScreen() {
  const [name, setName] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function handleSearch() {
    const trimmedName = name.trim();
    const trimmedDateFrom = dateFrom.trim();
    const trimmedDateTo = dateTo.trim();

    setErrorMessage('');

    if (!trimmedName && !trimmedDateFrom && !trimmedDateTo) {
      setErrorMessage('Wpisz przynajmniej jeden filtr.');
      return;
    }

    if (!isValidDate(trimmedDateFrom)) {
      setErrorMessage('Data od musi mieć format YYYY-MM-DD.');
      return;
    }

    if (!isValidDate(trimmedDateTo)) {
      setErrorMessage('Data do musi mieć format YYYY-MM-DD.');
      return;
    }

    if (
      trimmedDateFrom &&
      trimmedDateTo &&
      new Date(trimmedDateFrom) > new Date(trimmedDateTo)
    ) {
      setErrorMessage('Data od nie może być późniejsza niż data do.');
      return;
    }

    router.push({
      pathname: '/search-results',
      params: {
        name: trimmedName,
        dateFrom: trimmedDateFrom,
        dateTo: trimmedDateTo,
      },
    });
  }

  function clearFilters() {
    setName('');
    setDateFrom('');
    setDateTo('');
  }

  function isValidDate(value: string) {
    if (!value) return true;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(value)) {
      return false;
    }

    const date = new Date(value);

    return !Number.isNaN(date.getTime());
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Szukaj" />
      <FormSection title="Filtry">
        <AppInput
          label="Nazwa zawodów"
          placeholder="Wpisz nazwę zawodów"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.row}>
          <View style={styles.inputHalf}>
            <AppInput
              label="Data od"
              placeholder="YYYY-MM-DD"
              value={dateFrom}
              onChangeText={setDateFrom}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.inputHalf}>
            <AppInput
              label="Data do"
              placeholder="YYYY-MM-DD"
              value={dateTo}
              onChangeText={setDateTo}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </FormSection>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <AppButton title="SZUKAJ" onPress={handleSearch} />
      <AppButton
        title="WYCZYŚĆ FILTRY"
        variant="outline"
        onPress={clearFilters}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
});