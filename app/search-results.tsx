import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';

import { getCompetitions } from '../src/api/competitionApi';
import { CompetitionCard } from '../src/components/CompetitionCard';
import { ScreenContainer } from '../src/components/ScreenContainer';
import { ScreenHeader } from '../src/components/ScreenHeader';
import { colors } from '../src/constants/colors';
import { useAuth } from '../src/context/AuthContext';
import { Competition } from '../src/types/competition';

export default function SearchResultsScreen() {
  const { name, dateFrom, dateTo } = useLocalSearchParams<{
    name?: string;
    dateFrom?: string;
    dateTo?: string;
  }>();
  const { user } = useAuth();

  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadCompetitions() {
    try {
      setErrorMessage('');
      setIsLoading(true);

      const data = await getCompetitions();
      setCompetitions(data);
    } catch (error) {
      setErrorMessage('Nie udało się pobrać wyników wyszukiwania.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCompetitions();
  }, []);

  useEffect(() => {
    let data = [...competitions];

    if (name) {
      data = data.filter((competition) =>
        competition.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (dateFrom) {
      data = data.filter(
        (competition) => new Date(competition.date) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      data = data.filter(
        (competition) => new Date(competition.date) <= new Date(dateTo)
      );
    }

    setFilteredCompetitions(data);
  }, [competitions, name, dateFrom, dateTo]);

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
      <ScreenHeader
        title="Wyniki wyszukiwania"
        showBack
        onBack={() => router.back()}
      />

      <Text style={styles.summary}>
        Wyniki dla wybranych filtrów
      </Text>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : (
        <FlatList
          data={filteredCompetitions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>Nie znaleziono zawodów.</Text>
          }
          renderItem={({ item }) => (
            <CompetitionCard
              name={item.name}
              place="Fishing Competition"
              date={formatDate(item.date)}
              day={getDay(item.date)}
              month={getMonth(item.date)}
              onPress={() => {
                if (user?.role === 'JUDGE') {
                  router.push({
                    pathname: '/judge/competition/[id]',
                    params: { id: item.id.toString() },
                  });
                  return;
                }

                router.push({
                  pathname: '/competition/[id]',
                  params: { id: item.id.toString() },
                });
              }}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summary: {
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 20,
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