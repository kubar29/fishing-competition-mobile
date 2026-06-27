import { FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { Start } from '../types/start';
import { StartListItem } from './StartListItem';

type StartListProps = {
  starts: Start[];
  isDisabled?: boolean;
  onStartPress: (start: Start) => void;
};

type StartPreview = Start & {
  previewSectorPoints: number | null;
  previewStartPoints: number | null;
  previewPlace: number | null;
};

function calculatePreview(starts: Start[]): StartPreview[] {

  const startsWithWeight = starts.filter((start) => start.weight != null);
  const startsWithoutWeight = starts.filter((start) => start.weight == null);

  const sortedByWeight = [...startsWithWeight].sort((a, b) => {
    if (b.weight !== a.weight) {
      return b.weight - a.weight;
    }

    return a.position - b.position;
  });

  const withSectorPoints = sortedByWeight.map((start, index, array) => {
    const sameWeightStarts = array.filter((item) => item.weight === start.weight);

    const firstIndex = array.findIndex((item) => item.weight === start.weight);
    const lastIndex = firstIndex + sameWeightStarts.length - 1;

    const sectorPoints = (firstIndex + 1 + lastIndex + 1) / 2;

    return {
      ...start,
      previewSectorPoints: sectorPoints,
      previewStartPoints: sectorPoints + start.penaltyPoints,
      previewPlace: null,
    };
  });

  const sortedByStartPoints = [...withSectorPoints].sort((a, b) => {
    if (a.previewStartPoints !== b.previewStartPoints) {
      return a.previewStartPoints - b.previewStartPoints;
    }

    return a.position - b.position;
  });

  const withPlaces = sortedByStartPoints.map((start, index, array) => {
    const firstIndex = array.findIndex(
      (item) => item.previewStartPoints === start.previewStartPoints
    );

    return {
      ...start,
      previewPlace: firstIndex + 1,
    };
  });

  const withoutWeight = startsWithoutWeight.map((start) => ({
    ...start,
    previewSectorPoints: null,
    previewStartPoints: null,
    previewPlace: null,
  }));

  return [...withPlaces, ...withoutWeight];
}

export function StartList({ starts, isDisabled = false, onStartPress }: StartListProps) {
  const previewStarts = calculatePreview(starts);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, styles.positionColumn]}>St.</Text>
        <Text style={[styles.headerText, styles.nameColumn]}>Zawodnik</Text>
        <Text style={[styles.headerText, styles.weightColumn]}>Waga</Text>
        <Text style={[styles.headerText, styles.penaltyColumn]}>PK</Text>
        <Text style={[styles.headerText, styles.pointsColumn]}>Pkt.</Text>
        <Text style={[styles.headerText, styles.placeColumn]}>M.</Text>
      </View>

      <FlatList
        data={previewStarts}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Brak zawodników dla wybranej tury i sektora.
          </Text>
        }
        renderItem={({ item }) => (
          <StartListItem
            position={item.position}
            competitorName={`${item.competitor.name} ${item.competitor.surname}`}
            weight={item.weight}
            penaltyPoints={item.penaltyPoints}
            previewStartPoints={item.previewStartPoints}
            previewPlace={item.previewPlace}
            disabled={isDisabled}
            onPress={() => onStartPress(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  headerText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  positionColumn: {
    width: 34,
    textAlign: 'center',
  },
  nameColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  weightColumn: {
    width: 54,
    textAlign: 'right',
  },
  penaltyColumn: {
    width: 34,
    textAlign: 'right',
  },
  pointsColumn: {
    width: 42,
    textAlign: 'right',
  },
  placeColumn: {
    width: 34,
    textAlign: 'right',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
  },
});