import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { getStartById, updateStart } from '../../../src/api/startApi';
import { AppButton } from '../../../src/components/AppButton';
import { AppModal } from '../../../src/components/AppModal';
import { ScreenContainer } from '../../../src/components/ScreenContainer';
import { ScreenHeader } from '../../../src/components/ScreenHeader';
import { colors } from '../../../src/constants/colors';
import { useJudgeStart } from '../../../src/context/JudgeStartContext';
import { Start } from '../../../src/types/start';
import { errorHaptic, successHaptic } from '../../../src/utils/haptics';

export default function JudgeStartScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { starts, currentIndex, setCurrentIndex, setStarts } = useJudgeStart();

  const [start, setStart] = useState<Start | null>(null);
  const [weight, setWeight] = useState('');
  const [penaltyPoints, setPenaltyPoints] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  const currentStart = starts[currentIndex];

  async function loadStart() {
    if (!id) return;

    try {
      setErrorMessage('');
      setIsLoading(true);

      const data = await getStartById(id);

      setStart(data);
      setWeight(data.weight == null ? '' : String(data.weight));
      setPenaltyPoints(data.penaltyPoints ?? 0);
    } catch (error) {
      setErrorMessage('Nie udało się pobrać danych startu.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStart();
  }, [id]);

  function handlePreviousStart() {
    if (currentIndex <= 0) return;

    const previousIndex = currentIndex - 1;
    const previousStart = starts[previousIndex];

    setCurrentIndex(previousIndex);

    router.replace({
      pathname: '/judge/start/[id]',
      params: { id: previousStart.id.toString() },
    });
  }

  function handleNextStart() {
    if (currentIndex >= starts.length - 1) return;

    const nextIndex = currentIndex + 1;
    const nextStart = starts[nextIndex];

    setCurrentIndex(nextIndex);

    router.replace({
      pathname: '/judge/start/[id]',
      params: { id: nextStart.id.toString() },
    });
  }

  function handleConfirmSave() {
      setErrorMessage('');

      const parsedWeight = Number(weight);

      if (weight.trim() === '') {
          setErrorMessage('Wpisz wagę zawodnika.');
          return;
      }

      if (Number.isNaN(parsedWeight) || parsedWeight < 0) {
          setErrorMessage('Waga musi być liczbą większą lub równą 0.');
          return;
      }

      if (parsedWeight % 5 !== 0) {
          setErrorMessage('Waga musi być podana z dokładnością do 5 gramów.');
          return;
      }

      setIsConfirmModalVisible(true);
    }

    async function handleSave() {
    if (!start || isSubmitting) return;

    const parsedWeight = Number(weight);

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const updatedStart = await updateStart(start.id.toString(), {
        weight: parsedWeight,
        penaltyPoints,
      });

      await successHaptic();

      setStart(updatedStart);

      setStarts((previousStarts) =>
        previousStarts.map((item) =>
          item.id === updatedStart.id ? updatedStart : item
        )
      );

      setIsSuccessModalVisible(true);
    } catch (error) {
      await errorHaptic();
      setErrorMessage('Nie udało się zapisać startu.');
    } finally {
      setIsSubmitting(false);
    }
  }
  function incrementPenalty() {
    setPenaltyPoints((previous) => previous + 1);
  }

  function decrementPenalty() {
    setPenaltyPoints((previous) => Math.max(0, previous - 1));
  }

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Karta startu"
        showBack
        onBack={() => router.back()}
      />

      {isLoading ? (
        <ActivityIndicator color={colors.primary} />
      ) : errorMessage && !start ? (
        <Text style={styles.error}>{errorMessage}</Text>
      ) : start ? (
        <>
          <View style={styles.playerCard}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={currentIndex <= 0 ? colors.muted : colors.text}
              onPress={handlePreviousStart}
            />

            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>
                {start.competitor.name} {start.competitor.surname}
              </Text>
              <Text style={styles.playerDetails}>
                Stanowisko {start.position} • Sektor {start.sector.name}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={28}
              color={
                currentIndex >= starts.length - 1 ? colors.muted : colors.text
              }
              onPress={handleNextStart}
            />
          </View>

          <Text style={styles.weightLabel}>Waga zawodnika</Text>

            <View style={styles.weightBox}>
            <TextInput
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.muted}
                cursorColor={colors.primary}
                selectionColor={colors.primary}
                style={styles.weightInput}
            />
            <Text style={styles.weightUnit}>g</Text>
            </View>

          <Text style={styles.label}>Punkty karne</Text>

          <View style={styles.penaltyRow}>
            <Pressable style={styles.penaltyButton} onPress={decrementPenalty}>
                <Text style={styles.penaltyButtonText}>−</Text>
            </Pressable>

            <Text style={styles.penaltyValue}>{penaltyPoints}</Text>

            <Pressable style={styles.penaltyButton} onPress={incrementPenalty}>
                <Text style={styles.penaltyButtonText}>+</Text>
            </Pressable>
          </View>

          {isSubmitting ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <AppButton title="ZAPISZ START" onPress={handleConfirmSave}/>
          )}

          <AppButton
            title="ANULUJ"
            variant="outline"
            onPress={() => router.back()}
          />
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <AppModal
            visible={isConfirmModalVisible}
            title="Potwierdź zapis"
            message="Czy na pewno chcesz zapisać dane startu zawodnika?"
            primaryButtonText="ZAPISZ"
            onPrimaryPress={() => {
                setIsConfirmModalVisible(false);
                handleSave();
            }}
            secondaryButtonText="ANULUJ"
            onSecondaryPress={() => setIsConfirmModalVisible(false)}
          />

          <AppModal
            visible={isSuccessModalVisible}
            title="Start zapisany"
            message="Dane zawodnika zostały zapisane pomyślnie."
            primaryButtonText="OK"
            onPrimaryPress={() => setIsSuccessModalVisible(false)}
          />
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 28,
  },

  playerInfo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  playerName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },

  playerDetails: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },

  weightLabel: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },

  weightBox: {
    width: '72%',
    height: 88,
    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.primary,

    marginBottom: 32,
  },

  weightInput: {
    minWidth: 120,

    color: colors.text,
    fontSize: 38,
    fontWeight: '800',
    textAlign: 'center',
  },

  weightUnit: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 6,
  },

  label: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  penaltyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
    marginBottom: 32,
  },

  penaltyButton: {
    width: 70,
    height: 70,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  penaltyButtonText: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '800',
    lineHeight: 36,
  },

  penaltyValue: {
    width: 70,

    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    textAlign: 'center',
  },

  error: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 16,
  },
});