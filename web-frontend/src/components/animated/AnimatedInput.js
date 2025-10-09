import React, { useRef, useState } from 'react';
import { Animated, TextInput, View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../../utils/theme';

const AnimatedInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    multiline = false,
    secureTextEntry = false,
    style,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const focusAnim = useRef(new Animated.Value(0)).current;
    const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

    const handleFocus = () => {
        setIsFocused(true);
        Animated.parallel([
            Animated.timing(focusAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(labelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        Animated.timing(focusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();

        if (!value) {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const borderColor = focusAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.border, COLORS.primary],
    });

    const labelTop = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [16, -8],
    });

    const labelFontSize = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [TYPOGRAPHY.base, TYPOGRAPHY.sm],
    });

    const labelColor = labelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [COLORS.textSecondary, isFocused ? COLORS.primary : COLORS.textSecondary],
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.inputContainer,
                    { borderColor },
                    error && styles.errorBorder,
                ]}
            >
                {label && (
                    <Animated.Text
                        style={[
                            styles.label,
                            {
                                top: labelTop,
                                fontSize: labelFontSize,
                                color: labelColor,
                            },
                        ]}
                    >
                        {label}
                    </Animated.Text>
                )}
                <TextInput
                    style={[
                        styles.input,
                        multiline && styles.multilineInput,
                        label && styles.inputWithLabel,
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={!label ? placeholder : ''}
                    placeholderTextColor={COLORS.textSecondary}
                    multiline={multiline}
                    secureTextEntry={secureTextEntry}
                    {...props}
                />
            </Animated.View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.l,
    },
    inputContainer: {
        position: 'relative',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
        ...SHADOWS.sm,
    },
    label: {
        position: 'absolute',
        left: SPACING.m,
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.xs,
        fontWeight: TYPOGRAPHY.medium,
        zIndex: 1,
    },
    input: {
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.m,
        fontSize: TYPOGRAPHY.base,
        color: COLORS.textPrimary,
        minHeight: 52,
    },
    inputWithLabel: {
        paddingTop: SPACING.l,
    },
    multilineInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    errorBorder: {
        borderColor: COLORS.danger,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: TYPOGRAPHY.sm,
        marginTop: SPACING.xs,
        marginLeft: SPACING.m,
    },
});

export default AnimatedInput;