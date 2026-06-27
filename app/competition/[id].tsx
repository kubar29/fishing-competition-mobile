import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { ActivityIndicator, FlatList, StyleSheet, Text, View, } from 'react-native';

import { getCompetitionById, getCompetitionStructure } from '../../src/api/competitionApi';
import { CompetitionCard } from '../../src/components/CompetitionCard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';
import { Competition } from '../../src/types/competition';

import { getClassificationResults } from '../../src/api/resultApi';
import { AppSelect } from '../../src/components/AppSelect';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { CompetitionStructure } from '../../src/types/competitionStructure';
import { ClassificationResult } from '../../src/types/result';

type ActiveTab = 'info' | 'classification';

export default function CompetitionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState<ActiveTab>('info');
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);
  const [structure, setStructure] = useState<CompetitionStructure | null>(null);
  const [results, setResults] = useState<ClassificationResult[]>([]);

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

  async function loadStructure() {
    if (!id) return;

    try {
      const data = await getCompetitionStructure(id);

      setStructure(data);

      if (data.rounds.length > 0) {
        const firstRound = data.rounds[0];

        setSelectedRoundId(firstRound.id);

        if (firstRound.sectors.length > 0) {
          setSelectedSectorId(firstRound.sectors[0].id);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    loadCompetition();
    loadStructure();
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
  async function loadResults() {
    if (!id || !selectedRoundId || !selectedSectorId) return;

    try {
      const data = await getClassificationResults(
        id,
        selectedRoundId,
        selectedSectorId
      );
      setResults(data);
    } catch (error) {
      console.log('RESULTS ERROR', error);
    }
  }

  useEffect(() => {
    loadResults();
  }, [id, selectedRoundId, selectedSectorId]);

  const selectedRound =
    structure?.rounds.find((round) => round.id === selectedRoundId);

  const selectedSector =
    selectedRound?.sectors.find(
      (sector) => sector.id === selectedSectorId
    );

  const roundOptions =
    structure?.rounds.map((round) => ({
      label: round.name,
      value: round.id,
    })) ?? [];

  const sectorOptions =
    selectedRound?.sectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
    })) ?? [];
  
  return (
    <ScreenContainer>
      <ScreenHeader
        title="Szczegóły zawodów"
        showBack
        onBack={() => router.back()}
      />

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
              style={[
                styles.tab, 
                activeTab === 'info' && styles.activeTab]}
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
            <View style={[styles.card, styles.classificationCard]}>
              <View style={styles.filtersRow}>
                <AppSelect
                  label="Tura"
                  value={selectedRound?.name ?? '-'}
                  selectedValue={selectedRoundId}
                  options={roundOptions}
                  onSelect={(roundId) => {
                    setSelectedRoundId(roundId);

                    const round = structure?.rounds.find(
                      (item) => item.id === roundId
                    );

                    if (round?.sectors.length) {
                      setSelectedSectorId(round.sectors[0].id);
                    }
                  }}
                />

                <AppSelect
                  label="Sektor"
                  value={selectedSector?.name ?? '-'}
                  selectedValue={selectedSectorId}
                  options={sectorOptions}
                  onSelect={(sectorId) => setSelectedSectorId(sectorId)}
                />
              </View>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.placeColumn]}>
                  M.
                </Text>
                <Text style={[styles.tableHeaderText, styles.nameColumn]}>
                  Zawodnik
                </Text>
                <Text style={[styles.tableHeaderText, styles.weightColumn]}>
                  Waga
                </Text>
                <Text style={[styles.tableHeaderText, styles.pointsColumn]}>
                  Pkt.
                </Text>
              </View>

              <FlatList
                data={results}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.resultsList}
                ListEmptyComponent={
                  <Text style={styles.description}>
                    Brak zatwierdzonych wyników dla wybranej tury i sektora.
                  </Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.placeColumn]}>
                      {item.placeInSector}.
                    </Text>

                    <Text
                      style={[
                        styles.tableCell,
                        styles.nameColumn,
                        styles.competitorName,
                      ]}
                      numberOfLines={1}
                    >
                      {item.start.competitor.name} {item.start.competitor.surname}
                    </Text>

                    <Text style={[styles.tableCell, styles.weightColumn]}>
                      {item.start.weight} g
                    </Text>

                    <Text style={[styles.tableCell, styles.pointsColumn]}>
                      {item.finalPoints}
                    </Text>
                  </View>
                )}
              />
            </View>
          )}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
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
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 10,
  },
  place: {
    width: 34,
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
  resultDetails: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 13,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  table: {
    marginTop: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.cardDark,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 11,
    paddingHorizontal: 8,
  },
  tableCell: {
    color: colors.text,
    fontSize: 12,
  },
  competitorName: {
    fontWeight: '700',
  },
  placeColumn: {
    width: 34,
    textAlign: 'center',
  },
  nameColumn: {
    flex: 1,
    paddingHorizontal: 6,
  },
  weightColumn: {
    width: 70,
    textAlign: 'right',
  },
  pointsColumn: {
    width: 44,
    textAlign: 'right',
  },
  classificationCard: {
    flex: 1,
    minHeight: 360,
  },
  resultsList: {
    flex: 1,
  },

});