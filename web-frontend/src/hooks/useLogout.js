// hooks/useLogout.js
import { useNavigation } from '@react-navigation/native';
import { logout } from '../services/authService';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLogout = () => {
    const navigation = useNavigation();

    const handleLogout = async (showConfirmation = true) => {
        // If confirmation is requested, show alert
        if (showConfirmation) {
            Alert.alert(
                'Déconnexion',
                'Êtes-vous sûr de vouloir vous déconnecter ?',
                [
                    { text: 'Annuler', style: 'cancel' },
                    { 
                        text: 'Déconnecter', 
                        style: 'destructive',
                        onPress: () => performLogout()
                    }
                ]
            );
        } else {
            // Direct logout without confirmation
            await performLogout();
        }
    };

    const performLogout = async () => {
        try {
            console.log('Starting logout process...');
            
            // Call backend logout if available
            try {
                await logout();
                console.log('Backend logout successful');
            } catch (backendError) {
                console.warn('Backend logout failed, continuing with frontend cleanup:', backendError);
            }
            
            // Clear all local storage
            await AsyncStorage.multiRemove([
                'authToken',
                'refreshToken', 
                'userData',
                'userName',
                'userId',
                'userRole',
                'doctorId',
                'neurologistId'
            ]);
            
            console.log('Storage cleared, navigating to role selection...');
            
            // Use reset to clear navigation history and go to RoleSelection
            navigation.reset({
                index: 0,
                routes: [{ name: 'RoleSelection' }]
            });
            
        } catch (error) {
            console.error('Logout error:', error);
            // Even if there's an error, try to navigate to login
            navigation.reset({
                index: 0,
                routes: [{ name: 'RoleSelection' }]
            });
        }
    };

    return handleLogout;
};