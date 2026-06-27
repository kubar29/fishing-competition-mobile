import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';

import { getCompetitions } from '../../src/api/competitionApi';
import { CompetitionCard } from '../../src/components/CompetitionCard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors } from '../../src/constants/colors';
import { useAuth } from '../../src/context/AuthContext';
import { Competition } from '../../src/types/competition';
import { getCompetitionsCache, saveCompetitionsCache } from '../../src/utils/competitionCache';

export default function CompetitionsScreen() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const { user } = useAuth();

  async function loadCompetitions() {
    try {
      setErrorMessage('');
      setIsLoading(true);

      const data = await getCompetitions();

      setCompetitions(data);
      await saveCompetitionsCache(data);
    } catch (error) {
      const cachedCompetitions = await getCompetitionsCache();

      if (cachedCompetitions.length > 0) {
        setCompetitions(cachedCompetitions);
        setErrorMessage('Brak połączenia z API. Wyświetlono zapisane dane.');
        return;
      }

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
      <ScreenHeader title="Zawody" />
      {isLoading && competitions.length === 0 ? (
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