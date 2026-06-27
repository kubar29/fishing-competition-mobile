import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useJudgeStart } from '../../../src/context/JudgeStartContext';

import { getCompetitionById, getCompetitionStructure, } from '../../../src/api/competitionApi';
import { generateSectorResults, getClassificationResults } from '../../../src/api/resultApi';
import { getStartsBySector } from '../../../src/api/startApi';
import { AppButton } from '../../../src/components/AppButton';
import { AppModal } from '../../../src/components/AppModal';
import { AppSelect } from '../../../src/components/AppSelect';
import { CompetitionCard } from '../../../src/components/CompetitionCard';
import { ScreenContainer } from '../../../src/components/ScreenContainer';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { StartList } from '../../../src/components/StartList';
import { colors } from '../../../src/constants/colors';
import { Competition } from '../../../src/types/competition';
import { CompetitionStructure } from '../../../src/types/competitionStructure';
import { Start } from '../../../src/types/start';
import { errorHaptic, successHaptic } from '../../../src/utils/haptics';

export default function JudgeCompetitionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [structure, setStructure] = useState<CompetitionStructure | null>(null);
  const [starts, setStarts] = useState<Start[]>([]);
    
  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSectorLocked, setIsSectorLocked] = useState(false);
  const [isGenerateModalVisible, setIsGenerateModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
  
  async function checkSectorLock() {
    if (!id || !selectedRoundId || !selectedSectorId) return;

    try {
      const results = await getClassificationResults(
        id,
        selectedRoundId,
        selectedSectorId
      );

      setIsSectorLocked(results.length > 0);
    } catch (error) {
      setIsSectorLocked(false);
    }
  }

  

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
      setJudgeStarts([]);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, [id]);

  useEffect(() => {
    loadStarts();
  }, [id, selectedRoundId, selectedSectorId]);

  useEffect(() => {
  checkSectorLock();
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

  async function handleGenerateResults() {
    if (!selectedRoundId || !selectedSectorId || isGenerating) return;

    try {
      setIsGenerating(true);
      setErrorMessage('');

      await generateSectorResults(selectedRoundId, selectedSectorId);
      await successHaptic();
      setIsSectorLocked(true);
      setIsSuccessModalVisible(true);
    } catch (error) {
      await errorHaptic();
      setErrorMessage('Nie udało się wygenerować wyników sektora.');
    } finally {
      setIsGenerating(false);
    }
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
            isDisabled={isSectorLocked}
            onStartPress={(start) => {
            const index = judgeStarts.findIndex((item) => item.id === start.id);

            setCurrentIndex(index);

            router.push({
                pathname: '/judge/start/[id]',
                params: { id: start.id.toString() },
            });
            }}
          />
          <View style={styles.generateButtonWrapper}>
            <AppButton
              title={
                isSectorLocked
                  ? 'SEKTOR ZATWIERDZONY'
                  : isGenerating
                    ? 'GENEROWANIE...'
                    : 'GENERUJ WYNIKI SEKTORA'
              }
              variant={isSectorLocked ? 'outline' : 'primary'}
              onPress={() => {
                if (!isSectorLocked) {
                  setIsGenerateModalVisible(true);
                }
              }}
            />
          </View>

          <AppModal
            visible={isGenerateModalVisible}
            title="Zatwierdzić sektor?"
            message="Po zatwierdzeniu wyniki sektora zostaną wygenerowane, a edycja startów w tym sektorze zostanie zablokowana."
            primaryButtonText="ZATWIERDŹ"
            onPrimaryPress={() => {
              setIsGenerateModalVisible(false);
              handleGenerateResults();
            }}
            secondaryButtonText="ANULUJ"
            onSecondaryPress={() => setIsGenerateModalVisible(false)}
          />

          <AppModal
            visible={isSuccessModalVisible}
            title="Sektor zatwierdzony"
            message="Wyniki sektora zostały wygenerowane. Edycja startów została zablokowana."
            primaryButtonText="OK"
            onPrimaryPress={() => setIsSuccessModalVisible(false)}
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
  generateButtonWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
});