import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types';
import { CATEGORIES } from '../../data/mockData';

interface Props {
  category: Category;
  selected?: boolean;
  onPress: () => void;
  showCount?: number;
}

export default function CategoryChip({ category, selected = false, onPress, showCount }: Props) {
  const cat = CATEGORIES.find(c => c.id === category)!;

  return (
    <TouchableOpacity
      style={[styles.chip, selected && { backgroundColor: cat.color, borderColor: cat.color }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Ionicons
        name={cat.icon as any}
        size={14}
        color={selected ? '#fff' : cat.color}
        style={styles.icon}
      />
      <Text style={[styles.label, selected && styles.selectedLabel]}>{cat.label}</Text>
      {showCount !== undefined && (
        <View style={[styles.badge, { backgroundColor: selected ? 'rgba(255,255,255,0.3)' : cat.color + '22' }]}>
          <Text style={[styles.badgeText, { color: selected ? '#fff' : cat.color }]}>{showCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginRight: 8,
  },
  icon: { marginRight: 5 },
  label: { fontSize: 13, fontWeight: '600', color: '#555' },
  selectedLabel: { color: '#fff' },
  badge: {
    marginLeft: 6,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: { fontSize: 11, fontWeight: '700' },
});
