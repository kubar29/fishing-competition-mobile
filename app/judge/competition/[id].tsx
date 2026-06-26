import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useJudgeStart } from '../../../src/context/JudgeStartContext';

import { getCompetitionById, getCompetitionStructure, } from '../../../src/api/competitionApi';
import { getStartsBySector } from '../../../src/api/startApi';
import { AppSelect } from '../../../src/components/AppSelect';
import { CompetitionCard } from '../../../src/components/CompetitionCard';
import { ScreenContainer } from '../../../src/components/ScreenContainer';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { StartList } from '../../../src/components/StartList';
import { colors } from '../../../src/constants/colors';
import { Competition } from '../../../src/types/competition';
import { CompetitionStructure } from '../../../src/types/competitionStructure';
import { Start } from '../../../src/types/start';

export default function JudgeCompetitionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [structure, setStructure] = useState<CompetitionStructure | null>(null);
  const [starts, setStarts] = useState<Start[]>([]);
    
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const {starts: judgeStarts, setStarts: setJudgeStarts, setCurrentIndex, } = useJudgeStart();

  const selectedRound = structure?.rounds.find(
    (round) => round.id === selectedRoundId
  );

  const selectedSector = selectedRound?.sectors.find(
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

  async function loadInitialData() {
    if (!id) return;

    try {
      setErrorMessage('');
      setIsLoading(true);

      const [competitionData, structureData] = await Promise.all([
        getCompetitionById(id),
        getCompetitionStructure(id),
      ]);

      setCompetition(competitionData);
      setStructure(structureData);

      const firstRound = structureData.rounds[0];
      const firstSector = firstRound?.sectors[0];

      if (firstRound) {
        setSelectedRoundId(firstRound.id);
      }

      if (firstSector) {
        setSelectedSectorId(firstSector.id);
      }
    } catch (error) {
      setErrorMessage('Nie udało się pobrać danych panelu sędziego.');
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStarts() {
    if (!id || !selectedRoundId || !selectedSectorId) return;

    try {
      const data = await getStartsBySector(
        Number(id),
        selectedRoundId,
        selectedSectorId
      );

      setStarts(data);
      setJudgeStarts(data);
    } catch (error) {
      setStarts([]);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    loadStarts();
  }, [id, selectedRoundId, selectedSectorId]);

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
        title="Panel sędziego"
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

          <StartList
            starts={judgeStarts}
            onStartPress={(start) => {
            const index = judgeStarts.findIndex((item) => item.id === start.id);

            setCurrentIndex(index);

            router.push({
                pathname: '/judge/start/[id]',
                params: { id: start.id.toString() },
            });
            }}
          />
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
  },
});