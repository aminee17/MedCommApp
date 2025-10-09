import React, { useRef, useEffect, useState } from 'react';
import { Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../utils/theme';

const FloatingActionButton = ({ 
  icon = 'add',
  onPress,
  actions = [],
  style,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const actionAnims = useRef(actions.map(() => new Animated.Value(0))).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);

    Animated.parallel([
      Animated.spring(rotateAnim, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.stagger(50, 
        actionAnims.map(anim => 
          Animated.spring(anim, {
            toValue,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={[styles.container, style]}>
      {actions.map((action, index) => {
        const translateY = actionAnims[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0, -(60 * (index + 1))],
        });

        const opacity = actionAnims[index];

        return (
          <Animated.View
            key={index}
            style={[
              styles.actionButton,
              {
                transform: [{ translateY }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.actionButtonInner, { backgroundColor: action.color || COLORS.secondary }]}
              onPress={() => {
                action.onPress();
                toggleMenu();
              }}
            >
              <Ionicons name={action.icon} size={20} color={COLORS.textInverse} />
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      <TouchableOpacity
        onPress={actions.length > 0 ? toggleMenu : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        {...props}
      >
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotation },
              ],
            },
          ]}
        >
          <Ionicons name={icon} size={24} color={COLORS.textInverse} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  actionButton: {
    position: 'absolute',
    bottom: 0,
  },
  actionButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
});

export default FloatingActionButton;