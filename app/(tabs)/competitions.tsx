import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { getCompetitions } from '../../src/api/competitionApi';
import { CompetitionCard } from '../../src/components/CompetitionCard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';
import { Competition } from '../../src/types/competition';

export default function CompetitionsScreen() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadCompetitions() {
    try {
      setErrorMessage('');
      setIsLoading(true);

      const data = await getCompetitions();
      setCompetitions(data);
    } catch (error) {
      setErrorMessage('Nie udało się pobrać zawodów.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCompetitions();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('pl-PL');
  }

  function getDay(date: string) {
    return new Date(date).getDate().toString();
  }

  function getMonth(date: string) {
    return new Date(date)
      .toLocaleDateString('pl-PL', { month: 'short' })
      .toUpperCase();
  }

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Zawody</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <FlatList
          data={competitions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Brak zawodów do wyświetlenia.</Text>
          }
          renderItem={({ item }) => (
            <CompetitionCard
              name={item.name}
              place="Fishing Competition"
              date={formatDate(item.date)}
              day={getDay(item.date)}
              month={getMonth(item.date)}
              onPress={() => router.push(`/competition/${item.id}`)}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    marginBottom: 28,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
  },
});