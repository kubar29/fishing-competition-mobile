import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

type CompetitionCardProps = {
  name: string;
  place: string;
  date: string;
  day: string;
  month: string;
  onPress?: () => void;
};

export function CompetitionCard({
  name,
  place,
  date,
  day,
  month,
  onPress,
}: CompetitionCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>{day}</Text>
        <Text style={styles.dateMonth}>{month}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.place}>{place}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  dateBadge: {
    width: 48,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateDay: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  dateMonth: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  place: {
    color: colors.muted,
    marginTop: 4,
  },
  date: {
    color: colors.muted,
    marginTop: 2,
  },
  arrow: {
    color: colors.text,
    fontSize: 32,
  },
});