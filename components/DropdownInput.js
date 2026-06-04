import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '../theme/theme';

export default function DropdownInput({ label, value, placeholder, options, onSelect, searchable = false, searchPlaceholder = 'Search options' }) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedOptions = useMemo(() => {
    return options.map((option) => (typeof option === 'string' ? { label: option, value: option } : option));
  }, [options]);

  const selectedLabel = useMemo(() => {
    return normalizedOptions.find((option) => option.value === value)?.label || value;
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      return normalizedOptions;
    }

    return normalizedOptions.filter((option) => option.label.toLowerCase().includes(keyword));
  }, [normalizedOptions, query]);

  const handleSelect = (option) => {
    onSelect(option.value);
    setQuery('');
    setVisible(false);
  };

  const handleClose = () => {
    setQuery('');
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setVisible(true)} style={({ pressed }) => [styles.select, pressed && styles.pressed]}>
        <Text style={[styles.value, !value && styles.placeholder]}>{value ? selectedLabel : placeholder}</Text>
        <Text style={styles.chevron}>v</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <Pressable style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {searchable ? (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={searchPlaceholder}
                placeholderTextColor="#8B98AA"
                autoCapitalize="words"
                style={styles.searchInput}
              />
            ) : null}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<Text style={styles.emptyText}>No options found.</Text>}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelect(item)} style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}>
                  <Text style={[styles.optionText, item.value === value && styles.selectedText]}>{item.label}</Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    ...typography.label,
    color: colors.text,
  },
  select: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  value: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: '#8B98AA',
  },
  chevron: {
    ...typography.label,
    color: colors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 18, 41, 0.58)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '72%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    ...shadows.soft,
  },
  sheetTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  searchInput: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: '#F8FAFF',
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    color: colors.text,
    marginBottom: spacing.md,
    ...typography.body,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2FA',
  },
  optionPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  optionText: {
    ...typography.body,
    color: colors.text,
  },
  selectedText: {
    color: colors.primary,
    fontWeight: '800',
  },
  emptyText: {
    ...typography.body,
    color: colors.mutedText,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
});
