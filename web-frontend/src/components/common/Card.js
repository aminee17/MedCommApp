import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, SPACING } from '../../utils/theme';

/**
 * A reusable card component with consistent styling
 * 
 * @param {string} title - Optional card title
 * @param {node} children - Card content
 * @param {object} style - Additional style for the card
 * @param {object} contentStyle - Additional style for the card content
 */
const Card = ({ 
  title, 
  children, 
  style, 
  contentStyle 
}) => {
  return (
    <View style={[styles.card, style]}>
      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.light,
    borderRadius: 10,
    marginBottom: SPACING.m,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  titleContainer: {
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.lightGrey,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  content: {
    padding: SPACING.m,
  },
});

export default Card;