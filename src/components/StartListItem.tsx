import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../constants/colors';

type StartListItemProps = {
  position: number;
  competitorName: string;
  weight: number | null;
  penaltyPoints: number | null;
  previewStartPoints: number | null;
  previewPlace: number | null;
  disabled?: boolean;
  onPress: () => void;
};

export function StartListItem({
  position,
  competitorName,
  weight,
  penaltyPoints,
  previewStartPoints,
  previewPlace,
  disabled = false,
  onPress,
}: StartListItemProps) {
  return (
    <Pressable 
      style={[styles.row, disabled && styles.disabledRow]}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={styles.position}>{position}</Text>

      <Text style={styles.name} numberOfLines={1}>
        {competitorName}
      </Text>

      <Text style={styles.weight}>{weight == null ? '-' : weight}</Text>

      <Text
        style={[
          styles.penalty,
          penaltyPoints != null && penaltyPoints > 0 && styles.penaltyActive,
        ]}
      >
        {penaltyPoints == null ? '-' : penaltyPoints}
      </Text>

      <Text style={styles.points}>
        {previewStartPoints == null ? '-' : previewStartPoints}
      </Text>

      <Text style={styles.place}>
        {previewPlace == null ? '-' : previewPlace}
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
    width: 54,
    color: colors.muted,
    textAlign: 'right',
    fontSize: 12,
  },
  penalty: {
    width: 34,
    color: colors.muted,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '700',
  },
  penaltyActive: {
    color: colors.danger,
    fontWeight: '800',
  },
  points: {
    width: 42,
    color: colors.primary,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '800',
  },
  place: {
    width: 34,
    color: colors.text,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: '800',
  },
  disabledRow: {
    opacity: 0.55,
  },
});