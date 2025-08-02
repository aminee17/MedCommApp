import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/theme';

const AnimatedLoading = ({ 
    visible = true, 
    message = 'Chargement...', 
    size = 'large',
    overlay = false 
}) => {
    const spinAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Spin animation
            const spinAnimation = Animated.loop(
                Animated.timing(spinAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            );

            // Pulse animation for dots
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ])
            );

            spinAnimation.start();
            pulseAnimation.start();

            return () => {
                spinAnimation.stop();
                pulseAnimation.stop();
            };
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (!visible) return null;

    const LoadingContent = () => (
        <Animated.View
            style={[
                styles.container,
                overlay && styles.overlay,
                { opacity: fadeAnim },
            ]}
        >
            <View style={styles.loadingContent}>
                <Animated.View
                    style={[
                        styles.spinner,
                        styles[size],
                        { transform: [{ rotate: spin }] },
                    ]}
                >
                    <View style={[styles.spinnerRing, styles[`${size}Ring`]]} />
                </Animated.View>
                
                <View style={styles.dotsContainer}>
                    {[0, 1, 2].map((index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    transform: [
                                        {
                                            scale: pulseAnim.interpolate({
                                                inputRange: [1, 1.2],
                                                outputRange: [1, 1.2],
                                            }),
                                        },
                                    ],
                                    opacity: pulseAnim.interpolate({
                                        inputRange: [1, 1.2],
                                        outputRange: [0.6, 1],
                                    }),
                                },
                            ]}
                        />
                    ))}
                </View>
                
                {message && (
                    <Text style={[styles.message, styles[`${size}Text`]]}>
                        {message}
                    </Text>
                )}
            </View>
        </Animated.View>
    );

    return <LoadingContent />;
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9998,
    },
    loadingContent: {
        alignItems: 'center',
    },
    spinner: {
        marginBottom: SPACING.m,
    },
    small: {
        width: 24,
        height: 24,
    },
    medium: {
        width: 32,
        height: 32,
    },
    large: {
        width: 48,
        height: 48,
    },
    spinnerRing: {
        borderRadius: 9999,
        borderWidth: 3,
        borderColor: COLORS.greyLight,
        borderTopColor: COLORS.primary,
    },
    smallRing: {
        width: 24,
        height: 24,
    },
    mediumRing: {
        width: 32,
        height: 32,
    },
    largeRing: {
        width: 48,
        height: 48,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginBottom: SPACING.m,
        gap: SPACING.xs,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    message: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontWeight: TYPOGRAPHY.medium,
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
});

export default AnimatedLoading;