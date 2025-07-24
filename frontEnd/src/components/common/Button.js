import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '../../utils/theme';

/**
 * A reusable button component with consistent styling
 * 
 * @param {string} type - 'primary', 'secondary', 'danger', or 'outline'
 * @param {string} title - Button text
 * @param {function} onPress - Button press handler
 * @param {boolean} loading - Show loading indicator
 * @param {boolean} disabled - Disable button
 * @param {object} style - Additional style for the button
 * @param {object} textStyle - Additional style for the button text
 */
const Button = ({ 
  type = 'primary', 
  title, 
  onPress, 
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const getButtonStyle = () => {
    switch (type) {
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    if (type === 'outline') {
      return styles.outlineButtonText;
    }
    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' ? COLORS.primary : COLORS.light} />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: COLORS.grey,
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.light,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
  outlineButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.medium,
    fontWeight: 'bold',
  },
});

export default Button;