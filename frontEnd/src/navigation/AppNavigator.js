import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import RoleSelection from '../screens/Auth/RoleSelection';
import MedecinAuth from '../screens/Auth/MedecinAuth';
import NeurologueLogin from '../screens/Auth/NeurologueLogin';

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
import { COLORS } from '../utils/theme';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="RoleSelection"
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
                name="NeurologueLogin" 
                component={NeurologueLogin} 
                options={{ title: 'Connexion Neurologue' }} 
            />

            <Stack.Screen
                name="AdminLogin"
                component={AdminLogin}
                options={{ title: 'Connexion Administrateur' }}
            />

            {/* Doctor Screens */}
            <Stack.Screen 
                name="DoctorDashboard" 
                component={DoctorDashboard} 
                options={({ navigation }) => ({
                    title: 'Tableau de bord',
                    headerRight: () => (
                        <NotificationBell 
                            onPress={() => navigation.navigate('Notifications')}
                            style={{ marginRight: 10 }}
                        />
                    ),
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
                    headerRight: () => (
                        <NotificationBell 
                            onPress={() => navigation.navigate('Notifications')}
                            style={{ marginRight: 10 }}
                        />
                    ),
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

            {/* Common Screens */}
            <Stack.Screen
                name="AdminDashboard"
                component={AdminDashboard}
                options={{ title: 'Tableau de bord admin' }}
            />
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