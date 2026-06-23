import { StyleSheet, Text, View } from 'react-native';

import { AppInput } from '../../src/components/AppInput';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { colors } from '../../src/constants/colors';

export default function SearchScreen() {
  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Szukaj</Text>
      </View>

      <AppInput label="Wyszukaj zawody" placeholder="Wpisz nazwę zawodów..." />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 40,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
});