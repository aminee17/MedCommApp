import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../../utils/theme';
import AnimatedButton from './AnimatedButton';

const { width: screenWidth } = Dimensions.get('window');

const AnimatedAlert = ({ 
    visible, 
    title, 
    message, 
    type = 'info', 
    onClose, 
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Annuler',
    showCancel = false 
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 50,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: COLORS.successLight,
                    borderColor: COLORS.success,
                    iconColor: COLORS.success,
                };
            case 'warning':
                return {
                    backgroundColor: COLORS.warningLight,
                    borderColor: COLORS.warning,
                    iconColor: COLORS.warning,
                };
            case 'error':
                return {
                    backgroundColor: COLORS.dangerLight,
                    borderColor: COLORS.danger,
                    iconColor: COLORS.danger,
                };
            default:
                return {
                    backgroundColor: COLORS.infoLight,
                    borderColor: COLORS.info,
                    iconColor: COLORS.info,
                };
        }
    };

    const typeStyles = getTypeStyles();

    return (
        <Animated.View
            style={[
                styles.overlay,
                { opacity: fadeAnim },
            ]}
        >
            <Animated.View
                style={[
                    styles.alertContainer,
                    {
                        backgroundColor: typeStyles.backgroundColor,
                        borderColor: typeStyles.borderColor,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim },
                        ],
                    },
                ]}
            >
                <View style={styles.content}>
                    {title && (
                        <Text style={[styles.title, { color: typeStyles.iconColor }]}>
                            {title}
                        </Text>
                    )}
                    {message && (
                        <Text style={styles.message}>
                            {message}
                        </Text>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {showCancel && (
                        <AnimatedButton
                            title={cancelText}
                            onPress={onClose}
                            variant="outline"
                            size="small"
                            style={styles.button}
                        />
                    )}
                    <AnimatedButton
                        title={confirmText}
                        onPress={onConfirm || onClose}
                        variant={type === 'error' ? 'danger' : 'primary'}
                        size="small"
                        style={[styles.button, showCancel && styles.confirmButton]}
                    />
                </View>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    alertContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 2,
        padding: SPACING.xl,
        margin: SPACING.xl,
        maxWidth: screenWidth - SPACING.xl * 2,
        minWidth: 280,
        ...SHADOWS.xl,
    },
    content: {
        marginBottom: SPACING.l,
    },
    title: {
        fontSize: TYPOGRAPHY.lg,
        fontWeight: TYPOGRAPHY.bold,
        marginBottom: SPACING.s,
        textAlign: 'center',
    },
    message: {
        fontSize: TYPOGRAPHY.base,
        color: COLORS.textPrimary,
        textAlign: 'center',
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.base,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.m,
    },
    button: {
        flex: 1,
        maxWidth: 120,
    },
    confirmButton: {
        marginLeft: SPACING.m,
    },
});

export default AnimatedAlert;