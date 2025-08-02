import React, { useRef } from 'react';
import { Animated, PanGestureHandler, State } from 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS } from '../../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const SwipeableCard = ({ 
  children,
  onSwipeLeft,
  onSwipeRight,
  leftAction = { icon: 'checkmark', color: COLORS.success, label: 'Complete' },
  rightAction = { icon: 'chatbubble', color: COLORS.info, label: 'Chat' },
  style,
  ...props 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      if (translationX > SWIPE_THRESHOLD && onSwipeRight) {
        // Swipe right action
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onSwipeRight();
          // Reset position
          translateX.setValue(0);
          opacity.setValue(1);
        });
      } else if (translationX < -SWIPE_THRESHOLD && onSwipeLeft) {
        // Swipe left action
        Animated.parallel([
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onSwipeLeft();
          // Reset position
          translateX.setValue(0);
          opacity.setValue(1);
        });
      } else {
        // Snap back
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const leftActionOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      {/* Right Action (appears on left swipe) */}
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.rightAction,
          { opacity: rightActionOpacity }
        ]}
      >
        <View style={[styles.actionButton, { backgroundColor: rightAction.color }]}>
          <Ionicons name={rightAction.icon} size={24} color={COLORS.textInverse} />
        </View>
      </Animated.View>

      {/* Left Action (appears on right swipe) */}
      <Animated.View 
        style={[
          styles.actionContainer, 
          styles.leftAction,
          { opacity: leftActionOpacity }
        ]}
      >
        <View style={[styles.actionButton, { backgroundColor: leftAction.color }]}>
          <Ionicons name={leftAction.icon} size={24} color={COLORS.textInverse} />
        </View>
      </Animated.View>

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View
          style={[
            styles.card,
            {
              transform: [{ translateX }],
              opacity,
            },
          ]}
          {...props}
        >
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.s,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.cardPadding,
    marginHorizontal: SPACING.screenPadding,
    ...SHADOWS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  leftAction: {
    right: SPACING.screenPadding,
  },
  rightAction: {
    left: SPACING.screenPadding,
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
});

export default SwipeableCard;