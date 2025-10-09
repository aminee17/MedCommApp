import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES, SHADOWS, SPACING } from '../../utils/theme';

/**
 * A reusable header component with consistent styling
 * 
 * @param {string} title - Header title
 * @param {boolean} showBack - Show back button
 * @param {function} onBack - Custom back handler (optional)
 * @param {node} rightComponent - Component to show on the right side
 */
const Header = ({ 
  title, 
  showBack = false, 
  onBack, 
  rightComponent 
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
      
      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    ...SHADOWS.small,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: SPACING.m,
    padding: SPACING.xs,
  },
  backButtonText: {
    color: COLORS.light,
    fontSize: SIZES.xlarge,
    fontWeight: 'bold',
  },
  title: {
    color: COLORS.light,
    fontSize: SIZES.large,
    fontWeight: 'bold',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;