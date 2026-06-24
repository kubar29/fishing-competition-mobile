import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { getCompetitionById } from '../../src/api/competitionApi';
import { CompetitionCard } from '../../src/components/CompetitionCard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';
import { Competition } from '../../src/types/competition';

type ActiveTab = 'info' | 'classification';

export default function CompetitionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadCompetition() {
    if (!id) return;

    try {
      setErrorMessage('');
      setIsLoading(true);

      const data = await getCompetitionById(id);
      setCompetition(data);
    } catch (error) {
      setErrorMessage('Nie udało się pobrać szczegółów zawodów.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCompetition();
  }, [id]);

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
        <Ionicons
          name="arrow-back"
          size={26}
          color={colors.text}
          onPress={() => router.back()}
        />

        <Text style={styles.title}>Szczegóły zawodów</Text>

        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : competition ? (
        <>
          <CompetitionCard
            name={competition.name}
            place="Fishing Competition"
            date={formatDate(competition.date)}
            day={getDay(competition.date)}
            month={getMonth(competition.date)}
          />

          <View style={styles.tabs}>
            <Text
              style={[styles.tab, activeTab === 'info' && styles.activeTab]}
              onPress={() => setActiveTab('info')}
            >
              Informacje
            </Text>

            <Text
              style={[
                styles.tab,
                activeTab === 'classification' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('classification')}
            >
              Klasyfikacja
            </Text>
          </View>

          {activeTab === 'info' ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informacje ogólne</Text>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Nazwa</Text>
                <Text style={styles.value}>{competition.name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Termin</Text>
                <Text style={styles.value}>{formatDate(competition.date)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>Dostępne</Text>
              </View>

              <Text style={styles.descriptionTitle}>Opis</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.description}>
                  Szczegółowe informacje o zawodach będą rozwijane wraz z
                  rozbudową backendu o dodatkowe pola, takie jak lokalizacja,
                  organizator i opis zawodów.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Klasyfikacja</Text>

              <Text style={styles.label}>Tura</Text>
              <View style={styles.selectPlaceholder}>
                <Text style={styles.selectText}>Wybierz turę</Text>
              </View>

              <Text style={styles.label}>Sektor</Text>
              <View style={styles.selectPlaceholder}>
                <Text style={styles.selectText}>Wybierz sektor</Text>
              </View>

              <Text style={styles.description}>
                Klasyfikacja będzie pobierana po wybraniu tury i sektora.
                Backend powinien zwracać wyniki dla wybranego competitionId,
                roundId i sectorId.
              </Text>
            </View>
          )}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 26,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    textAlign: 'center',
    color: colors.muted,
    paddingVertical: 12,
    borderRadius: 10,
    fontWeight: '700',
  },
  activeTab: {
    backgroundColor: colors.primary,
    color: '#111827',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  infoRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
  },
  label: {
    color: colors.muted,
    fontSize: 14,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  descriptionTitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 18,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  descriptionBox: {
    backgroundColor: colors.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  description: {
    color: colors.muted,
    lineHeight: 22,
    marginTop: 14,
  },
  selectPlaceholder: {
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.cardDark,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  selectText: {
    color: colors.text,
    fontWeight: '600',
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
});