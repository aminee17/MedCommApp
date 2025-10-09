import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { countUnreadNotifications } from '../../services/notificationService';
import { COLORS, SPACING } from '../../utils/theme';

const NotificationBell = ({ onPress, style }) => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const pulseAnim = new Animated.Value(1);

    // Fetch notification count on mount and every 30 seconds
    useEffect(() => {
        fetchNotificationCount();
        
        const interval = setInterval(() => {
            fetchNotificationCount();
        }, 30000); // 30 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    // Pulse animation when count changes
    useEffect(() => {
        if (count > 0) {
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [count]);

    const fetchNotificationCount = async () => {
        try {
            setLoading(true);
            const newCount = await countUnreadNotifications();
            setCount(newCount);
        } catch (error) {
            console.error('Error fetching notification count:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.container, style]} 
            onPress={onPress}
            disabled={loading}
        >
            <View style={styles.bellContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons 
                        name={count > 0 ? "notifications" : "notifications-outline"} 
                        size={24} 
                        color={COLORS.light} 
                    />
                </Animated.View>
                
                {count > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {count > 99 ? '99+' : count}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.xs,
    },
    bellContainer: {
        position: 'relative',
        width: 30, // Increased width to accommodate badge
        height: 30, // Increased height to accommodate badge
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: COLORS.light,
        zIndex: 1, // Ensure badge appears above the bell icon
    },
    badgeText: {
        color: COLORS.light,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default NotificationBell;