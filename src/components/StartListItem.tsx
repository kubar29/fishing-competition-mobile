import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type StartListItemProps = {
  position: number;
  competitorName: string;
  weight: number;
  penaltyPoints: number;
  sectorPoints: number | null;
  onPress: () => void;
};

export function StartListItem({
  position,
  competitorName,
  weight,
  penaltyPoints,
  sectorPoints,
  onPress,
}: StartListItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.position}>{position}</Text>

      <Text style={styles.name} numberOfLines={1}>
        {competitorName}
      </Text>

      <Text style={styles.weight}>
        {weight == null ? '-' : `${weight} g`}
      </Text>

      <Text
        style={[
          styles.penalty,
          penaltyPoints > 0 && styles.penaltyActive,
        ]}
      >
        {penaltyPoints}
      </Text>

      <Text style={styles.points}>
        {sectorPoints == null ? '-' : sectorPoints}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  position: {
    width: 34,
    color: colors.text,
    fontWeight: '800',
    textAlign: 'center',
  },
  name: {
    flex: 1,
    color: colors.text,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  weight: {
    width: 58,
    color: colors.muted,
    textAlign: 'right',
    fontSize: 12,
  },
  points: {
    width: 42,
    color: colors.primary,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '800',
  },
  penalty: {
    width: 42,
    color: colors.muted,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },

  penaltyActive: {
    color: colors.danger,
    fontWeight: '800',
  },
});