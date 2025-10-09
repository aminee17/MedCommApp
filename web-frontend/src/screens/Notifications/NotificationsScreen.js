import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from '../../services/notificationService';
import { COLORS, SPACING, SIZES, SHADOWS } from '../../utils/theme';
import { isNeurologue, isMedecin } from '../../utils/userUtils';

const NotificationsScreen = ({ navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    // Get user role when component mounts
    useEffect(() => {
        const getUserRoleAsync = async () => {
            const isUserNeurologue = await isNeurologue();
            const isUserMedecin = await isMedecin();
            
            if (isUserNeurologue) {
                setUserRole('NEUROLOGUE');
            } else if (isUserMedecin) {
                setUserRole('MEDECIN');
            }
        };
        
        getUserRoleAsync();
    }, []);

    // Fetch notifications when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            setError('Impossible de charger les notifications. Veuillez réessayer.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            // Update local state to mark all as read
            setNotifications(prevNotifications => 
                prevNotifications.map(notification => ({
                    ...notification,
                    isRead: true
                }))
            );
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleNotificationPress = async (notification) => {
        try {
            // Mark as read in the backend
            if (!notification.isRead) {
                await markNotificationAsRead(notification.notificationId);
                
                // Update local state
                setNotifications(prevNotifications => 
                    prevNotifications.map(n => 
                        n.notificationId === notification.notificationId 
                            ? { ...n, isRead: true } 
                            : n
                    )
                );
            }
            
            // Navigate based on notification type and user role
            if (userRole === 'NEUROLOGUE') {
                // Neurologue navigation
                if (notification.notificationType === 'NEW_FORM' && notification.relatedId) {
                    // Navigate directly with formId
                    navigation.navigate('NeurologueFormDetails', { formId: notification.relatedId });
                }
            } else if (userRole === 'MEDECIN') {
                // Medecin navigation
                if (notification.notificationType === 'UPDATE' && notification.relatedId) {
                    navigation.navigate('ViewResponse', { formId: notification.relatedId });
                }
            }
        } catch (error) {
            console.error('Error handling notification press:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'NEW_FORM':
                return 'document-text';
            case 'UPDATE':
                return 'chatbubble-ellipses';
            case 'SUPERVISION_REQUEST':
                return 'alert-circle';
            case 'REMINDER':
                return 'calendar';
            case 'ALERT':
                return 'warning';
            default:
                return 'notifications';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'NEW_FORM':
                return COLORS.primary;
            case 'UPDATE':
                return COLORS.success;
            case 'SUPERVISION_REQUEST':
                return COLORS.warning;
            case 'REMINDER':
                return COLORS.secondary;
            case 'ALERT':
                return COLORS.danger;
            default:
                return COLORS.grey;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) {
            return 'À l\'instant';
        } else if (diffMins < 60) {
            return `Il y a ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleDateString('fr-FR');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            await deleteNotification(notificationId);
            // Update local state to remove the deleted notification
            setNotifications(prevNotifications => 
                prevNotifications.filter(n => n.notificationId !== notificationId)
            );
        } catch (error) {
            console.error('Error deleting notification:', error);
            Alert.alert('Erreur', 'Impossible de supprimer la notification.');
        }
    };
    
    const renderRightActions = (notificationId) => {
        return (
            <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(notificationId)}
            >
                <Ionicons name="trash-outline" size={24} color="white" />
                <Text style={styles.deleteText}>Supprimer</Text>
            </TouchableOpacity>
        );
    };

    const renderNotificationItem = ({ item }) => (
        <Swipeable
            renderRightActions={() => renderRightActions(item.notificationId)}
            rightThreshold={40}
        >
            <TouchableOpacity 
                style={[
                    styles.notificationItem, 
                    !item.isRead && styles.unreadNotification
                ]} 
                onPress={() => handleNotificationPress(item)}
            >
                <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.notificationType) }]}>
                    <Ionicons name={getNotificationIcon(item.notificationType)} size={20} color={COLORS.light} />
                </View>
                
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
                    <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
                </View>
                
                {!item.isRead && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                
                {notifications.length > 0 && (
                    <TouchableOpacity 
                        style={styles.markAllButton} 
                        onPress={handleMarkAllAsRead}
                    >
                        <Text style={styles.markAllText}>Tout marquer comme lu</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={50} color={COLORS.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="notifications-off" size={50} color={COLORS.grey} />
                    <Text style={styles.emptyText}>Aucune notification</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.notificationId.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[COLORS.primary]}
                        />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    header: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.light,
    },
    markAllButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.m,
        borderRadius: 20,
    },
    markAllText: {
        color: COLORS.light,
        fontSize: SIZES.small,
    },
    listContent: {
        padding: SPACING.s,
    },
    notificationItem: {
        backgroundColor: COLORS.light,
        borderRadius: 10,
        marginBottom: SPACING.s,
        padding: SPACING.m,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    unreadNotification: {
        backgroundColor: '#F0F8FF', // Light blue background for unread
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 2,
    },
    notificationMessage: {
        fontSize: SIZES.small,
        color: COLORS.grey,
        marginBottom: 4,
    },
    notificationTime: {
        fontSize: SIZES.small,
        color: COLORS.grey,
        fontStyle: 'italic',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.primary,
        marginLeft: SPACING.s,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    errorText: {
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.danger,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.l,
    },
    emptyText: {
        marginTop: SPACING.m,
        fontSize: SIZES.medium,
        color: COLORS.grey,
        textAlign: 'center',
    },
    // Swipe to delete styles
    deleteButton: {
        backgroundColor: COLORS.danger,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    deleteText: {
        color: 'white',
        fontSize: SIZES.small,
        marginTop: 5,
    },
});

export default NotificationsScreen;