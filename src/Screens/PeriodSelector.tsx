import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Period = 'today' | 'weekly' | '30days';

interface PeriodSelectorProps {
  initialSelected?: Period;
  onSelect: (period: Period) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  initialSelected = 'today', 
  onSelect 
}) => {
  const [selected, setSelected] = useState<Period>(initialSelected);

  const handlePress = (period: Period) => {
    setSelected(period);
    onSelect(period);
  };

  const buttons: { label: string; value: Period }[] = [
    { label: 'Today', value: 'today' },
    { label: 'Weekly', value: 'weekly' },
    { label: '30 Days', value: '30days' },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((btn) => {
        const isSelected = selected === btn.value;
        return (
          <TouchableOpacity
            key={btn.value}
            style={[styles.button, isSelected && styles.selectedButton]}
            onPress={() => handlePress(btn.value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>
              {btn.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PeriodSelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
    backgroundColor: '#fff',
    width: '100%',

  },
  button: {
    flex: 1, // makes buttons take equal space
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#e6e6e6',
    borderColor: '#ccc',
  },
  text: {
    color: '#555',
    fontSize: 16,
    fontWeight: '400',
  },
  selectedText: {
    fontWeight: '600',
    color: '#000',
  },
});
