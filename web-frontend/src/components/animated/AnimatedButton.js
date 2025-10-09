import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../../utils/theme';

const AnimatedButton = ({ 
    title, 
    onPress, 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    style,
    textStyle 
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];
        
        if (disabled) {
            baseStyle.push(styles.disabled);
        } else {
            baseStyle.push(styles[variant]);
        }
        
        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`${size}Text`]];
        
        if (disabled) {
            baseStyle.push(styles.disabledText);
        } else {
            baseStyle.push(styles[`${variant}Text`]);
        }
        
        return baseStyle;
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            activeOpacity={1}
        >
            <Animated.View
                style={[
                    getButtonStyle(),
                    style,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <Text style={[getTextStyle(), textStyle]}>{title}</Text>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    
    // Sizes
    small: {
        paddingHorizontal: SPACING.l,
        paddingVertical: SPACING.s,
        minHeight: 36,
    },
    medium: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.m,
        minHeight: 48,
    },
    large: {
        paddingHorizontal: SPACING.xxl,
        paddingVertical: SPACING.l,
        minHeight: 56,
    },
    
    // Variants
    primary: {
        backgroundColor: COLORS.primary,
    },
    secondary: {
        backgroundColor: COLORS.secondary,
    },
    accent: {
        backgroundColor: COLORS.accent,
    },
    success: {
        backgroundColor: COLORS.success,
    },
    warning: {
        backgroundColor: COLORS.warning,
    },
    danger: {
        backgroundColor: COLORS.danger,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        backgroundColor: COLORS.greyLight,
    },
    
    // Text styles
    text: {
        fontWeight: TYPOGRAPHY.semibold,
        textAlign: 'center',
    },
    smallText: {
        fontSize: TYPOGRAPHY.sm,
    },
    mediumText: {
        fontSize: TYPOGRAPHY.base,
    },
    largeText: {
        fontSize: TYPOGRAPHY.lg,
    },
    
    // Text variants
    primaryText: {
        color: COLORS.textInverse,
    },
    secondaryText: {
        color: COLORS.textInverse,
    },
    accentText: {
        color: COLORS.textInverse,
    },
    successText: {
        color: COLORS.textInverse,
    },
    warningText: {
        color: COLORS.textInverse,
    },
    dangerText: {
        color: COLORS.textInverse,
    },
    outlineText: {
        color: COLORS.primary,
    },
    ghostText: {
        color: COLORS.primary,
    },
    disabledText: {
        color: COLORS.textSecondary,
    },
});

export default AnimatedButton;