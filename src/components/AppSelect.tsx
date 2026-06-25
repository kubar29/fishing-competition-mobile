import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors } from '../constants/colors';

type Option = {
  label: string;
  value: number;
};

type AppSelectProps = {
  label: string;
  value: string;
  selectedValue: number | null;
  options: Option[];
  onSelect: (value: number) => void;
};

export function AppSelect({
  label,
  value,
  selectedValue,
  options,
  onSelect,
}: AppSelectProps) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <Pressable
          style={styles.select}
          onPress={() => setVisible(true)}
        >
          <Text style={styles.value}>{value}</Text>

          <Ionicons
            name="chevron-down"
            size={18}
            color={colors.text}
          />
        </Pressable>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <View style={styles.modal}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.option}
                onPress={() => {
                  onSelect(option.value);
                  setVisible(false);
                }}
              >
                <View style={styles.optionContent}>
                    <Text
                        style={[
                        styles.optionText,
                        option.value === selectedValue && styles.selectedOptionText,
                        ]}
                    >
                        {option.label}
                    </Text>

                    {option.value === selectedValue && (
                        <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                        />
                    )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 6,
  },
  select: {
    height: 46,
    backgroundColor: colors.cardDark,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  value: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: '800',
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});