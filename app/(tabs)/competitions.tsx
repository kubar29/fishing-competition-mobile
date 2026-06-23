import { StyleSheet, Text, View } from 'react-native';

import { CompetitionCard } from '../../src/components/CompetitionCard';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';

export default function CompetitionsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Zawody</Text>
        <Text style={styles.subtitle}>Nadchodzące i dostępne zawody</Text>
      </View>

      <CompetitionCard
        name="Mistrzostwa Okręgu"
        place="Kanał Żerański"
        date="12.06.2026"
        day="12"
        month="CZE"
      />

      <CompetitionCard
        name="Puchar Prezesa Koła"
        place="Zalew Grodzisk"
        date="18.06.2026"
        day="18"
        month="CZE"
      />

      <CompetitionCard
        name="Grand Prix Mazowsza"
        place="Rzeka Wisła"
        date="25.06.2026"
        day="25"
        month="CZE"
      />
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
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
});