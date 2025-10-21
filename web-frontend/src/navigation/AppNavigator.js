import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/theme';

// Auth Screens
import RoleSelection from '../screens/Auth/RoleSelection';
import MedecinAuth from '../screens/Auth/MedecinAuth';
import DoctorRegistration from '../screens/Auth/DoctorRegistration';
import NeurologueLogin from '../screens/Auth/NeurologueLogin';
import AdminRegistration from '../screens/Auth/AdminRegistration';

// Doctor Screens
import DoctorDashboard from '../components/doctorDashboard/doctorDashboard';
import MedicalForm from '../components/medicalform/MedicalForm';
import ViewResponseScreen from '../screens/Doctor/ViewResponseScreen';
import DoctorChat from '../screens/Doctor/Chat';

// Neurologue Screens
import NeurologueDashboard from '../screens/Neurologue/NeurologueDashboard';
import NeurologueFormDetails from '../screens/Neurologue/NeurologueFormDetails';
import FormResponse from '../screens/Neurologue/FormResponse';
import NeurologueChat from '../screens/Neurologue/Chat';
import AdminLogin from '../screens/Auth/AdminLogin';
import AdminDashboard from "../components/adminDashboard/adminDashboard";

// Common Screens
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';

// Components
import NotificationBell from '../components/common/NotificationBell';


const Stack = createNativeStackNavigator();

// Custom header with logout button
const createHeaderRight = (navigation, handleLogout) => () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <NotificationBell 
            onPress={() => navigation.navigate('Notifications')}
            style={{ marginRight: 10 }}
        />
        <TouchableOpacity
            onPress={() => handleLogout(true)} // true = show confirmation
            style={{ 
                padding: 8,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                marginLeft: 10
            }}
        >
            <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
    </View>
);

const AppNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRouteName, setInitialRouteName] = useState('RoleSelection');

    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userId = await AsyncStorage.getItem('userId');
            const userRole = await AsyncStorage.getItem('userRole');

            console.log('Auth check - Token:', !!token, 'UserID:', userId, 'Role:', userRole);

            if (token && userId && userRole) {
                // User is authenticated, set the appropriate initial route
                switch (userRole) {
                    case 'ADMIN':
                        setInitialRouteName('AdminDashboard');
                        break;
                    case 'NEUROLOGUE':
                    case 'NEUROLOGUE_RESIDENT':
                        setInitialRouteName('NeurologueDashboard');
                        break;
                    case 'MEDECIN':
                        setInitialRouteName('DoctorDashboard');
                        break;
                    default:
                        setInitialRouteName('RoleSelection');
                }
            } else {
                setInitialRouteName('RoleSelection');
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setInitialRouteName('RoleSelection');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.primary,
                },
                headerTintColor: COLORS.light,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {/* Auth Screens */}
            <Stack.Screen 
                name="RoleSelection" 
                component={RoleSelection} 
                options={{ title: 'Sélection du rôle' }} 
            />
            <Stack.Screen 
                name="MedecinAuth"
                component={MedecinAuth}
                options={{ title: 'Connexion Médecin' }} 
            />
            <Stack.Screen 
                name="DoctorRegistration"
                component={DoctorRegistration}
                options={{ title: 'Inscription Médecin' }} 
            />
            <Stack.Screen 
                name="NeurologueLogin" 
                component={NeurologueLogin} 
                options={{ title: 'Connexion Neurologue' }} 
            />

            <Stack.Screen
                name="AdminLogin"
                component={AdminLogin}
                options={{ title: 'Connexion Administrateur' }}
            />
            <Stack.Screen
                name="AdminRegistration"
                component={AdminRegistration}
                options={{ title: 'Inscription Administrateur' }}
            />

            {/* Doctor Screens */}
            <Stack.Screen 
                name="DoctorDashboard" 
                component={DoctorDashboard} 
                options={({ navigation }) => ({
                    title: 'Tableau de bord',
                    headerRight: createHeaderRight(navigation, () => {
                        // This will be passed to the component and used properly
                        navigation.setParams({ forceLogout: Date.now() });
                    })
                })}
            />
            <Stack.Screen 
                name="MedicalForm" 
                component={MedicalForm} 
                options={{ title: 'Formulaire Médical' }} 
            />
            <Stack.Screen 
                name="ViewResponse" 
                component={ViewResponseScreen} 
                options={{ title: 'Réponse du Neurologue' }} 
            />

            {/* Neurologue Screens */}
            <Stack.Screen 
                name="NeurologueDashboard" 
                component={NeurologueDashboard} 
                options={({ navigation }) => ({
                    title: 'Tableau de bord',
                    headerRight: createHeaderRight(navigation, () => {
                        navigation.setParams({ forceLogout: Date.now() });
                    })
                })}
            />
            <Stack.Screen 
                name="NeurologueFormDetails" 
                component={NeurologueFormDetails} 
                options={{ title: 'Détails du Formulaire' }} 
            />
            <Stack.Screen 
                name="FormResponse" 
                component={FormResponse} 
                options={{ title: 'Réponse au Formulaire' }} 
            />
            <Stack.Screen 
                name="NeurologueChat" 
                component={NeurologueChat} 
                options={{ title: 'Discussion' }} 
            />
            <Stack.Screen 
                name="DoctorChat" 
                component={DoctorChat} 
                options={{ title: 'Discussion' }} 
            />

            {/* Admin Screens */}
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboard}
                options={({ navigation }) => ({
                    title: 'Tableau de bord admin',
                    headerRight: createHeaderRight(navigation, () => {
                        navigation.setParams({ forceLogout: Date.now() });
                    })
                })}
            />

            {/* Common Screens */}
            <Stack.Screen 
                name="Notifications" 
                component={NotificationsScreen} 
                options={({ navigation }) => ({ 
                    title: 'Notifications',
                    headerRight: () => (
                        <TouchableOpacity 
                            onPress={async () => {
                                try {
                                    const { markAllNotificationsAsRead } = require('../services/notificationService');
                                    await markAllNotificationsAsRead();
                                    navigation.goBack();
                                } catch (error) {
                                    console.error('Error marking all as read:', error);
                                }
                            }} 
                            style={{ marginRight: 10 }}
                        >
                            <Ionicons name="checkmark-done" size={24} color={COLORS.light} />
                        </TouchableOpacity>
                    ),
                })} 
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;