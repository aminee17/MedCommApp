import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../utils/theme';

/**
 * A reusable input component with consistent styling
 * 
 * @param {string} label - Input label
 * @param {string} value - Input value
 * @param {function} onChangeText - Text change handler
 * @param {string} placeholder - Input placeholder
 * @param {boolean} multiline - Enable multiline input
 * @param {string} error - Error message
 * @param {object} style - Additional style for the container
 * @param {object} inputStyle - Additional style for the input
 * @param {object} props - Additional TextInput props
 */
const Input = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  error,
  style,
  inputStyle,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          inputStyle
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        placeholderTextColor={COLORS.grey}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: SIZES.medium,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.light,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.m,
    fontSize: SIZES.medium,
    color: COLORS.dark,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: COLORS.danger,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: SIZES.small,
    marginTop: SPACING.xs,
  },
});

export default Input;