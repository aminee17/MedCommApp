import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet, StatusBar } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../utils/theme';

const AnimatedHeader = ({ 
  title, 
  subtitle, 
  rightComponent,
  scrollY,
  children,
  style,
  ...props 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const titleOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  }) : 1;

  const subtitleOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : 1;

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={[styles.container, style]}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: COLORS.primary }]} />
        
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.titleContainer}>
            <Animated.Text 
              style={[
                styles.title,
                { opacity: titleOpacity }
              ]}
            >
              {title}
            </Animated.Text>
            {subtitle && (
              <Animated.Text 
                style={[
                  styles.subtitle,
                  { opacity: subtitleOpacity }
                ]}
              >
                {subtitle}
              </Animated.Text>
            )}
          </View>
          
          {rightComponent && (
            <View style={styles.rightComponent}>
              {rightComponent}
            </View>
          )}
        </Animated.View>
        
        {children}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: SPACING.sectionSpacing,
    ...SHADOWS.lg,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.l,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: TYPOGRAPHY.xxxl,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textInverse,
    letterSpacing: TYPOGRAPHY.letterSpacing.wide,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.lg,
    color: COLORS.textInverse,
    opacity: 0.9,
    marginTop: SPACING.xs,
    fontWeight: TYPOGRAPHY.regular,
  },
  rightComponent: {
    alignItems: 'flex-end',
  },
});

export default AnimatedHeader;