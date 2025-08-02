import React, { useEffect, useRef } from 'react';
import { Animated, Modal, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AnimatedModal = ({ 
    visible, 
    onClose, 
    children, 
    animationType = 'slide',
    style 
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(screenHeight)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        if (visible) {
            const animations = [
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ];

            if (animationType === 'slide') {
                animations.push(
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    })
                );
            } else if (animationType === 'scale') {
                animations.push(
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    })
                );
            }

            Animated.parallel(animations).start();
        } else {
            const animations = [
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ];

            if (animationType === 'slide') {
                animations.push(
                    Animated.timing(slideAnim, {
                        toValue: screenHeight,
                        duration: 200,
                        useNativeDriver: true,
                    })
                );
            } else if (animationType === 'scale') {
                animations.push(
                    Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 200,
                        useNativeDriver: true,
                    })
                );
            }

            Animated.parallel(animations).start();
        }
    }, [visible, animationType]);

    const getContentTransform = () => {
        if (animationType === 'slide') {
            return [{ translateY: slideAnim }];
        } else if (animationType === 'scale') {
            return [{ scale: scaleAnim }];
        }
        return [];
    };

    return (
        <Modal
            transparent
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <Animated.View
                style={[
                    styles.overlay,
                    { opacity: fadeAnim },
                ]}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.content,
                        style,
                        {
                            transform: getContentTransform(),
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        margin: SPACING.xl,
        maxWidth: screenWidth - SPACING.xl * 2,
        maxHeight: screenHeight * 0.8,
        ...SHADOWS.xl,
    },
});

export default AnimatedModal;