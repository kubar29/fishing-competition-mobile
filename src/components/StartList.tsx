import { FlatList, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';
import { Start } from '../types/start';
import { StartListItem } from './StartListItem';

type StartListProps = {
  starts: Start[];
  onStartPress: (start: Start) => void;
};

export function StartList({ starts, onStartPress }: StartListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text style={[styles.headerText, styles.positionColumn]}>St.</Text>
      <Text style={[styles.headerText, styles.nameColumn]}>Zawodnik</Text>
      <Text style={[styles.headerText, styles.weightColumn]}>Waga</Text>
      <Text style={[styles.headerText, styles.penaltyColumn]}>PK</Text>
      <Text style={[styles.headerText, styles.pointsColumn]}>Pkt.</Text>
    </View>

      <FlatList
        data={[...starts].sort((a, b) => {
          if (a.sectorPoints == null && b.sectorPoints == null) return 0;
          if (a.sectorPoints == null) return 1;
          if (b.sectorPoints == null) return -1;

          return a.sectorPoints - b.sectorPoints;
        })}
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
            sectorPoints={item.sectorPoints}
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
    width: 58,
    textAlign: 'right',
  },
  pointsColumn: {
    width: 42,
    textAlign: 'right',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 24,
  },
  penaltyColumn: {
    width: 42,
    textAlign: 'center',
  },
});