import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserRole = async () => {
    try {
        const role = await AsyncStorage.getItem('userRole');
        return role || null;
    } catch (error) {
        console.error('Error getting user role:', error);
        return null;
    }
};

export const isNeurologue = async () => {
    const role = await getUserRole();
    return role === 'NEUROLOGUE' || role === 'NEUROLOGUE_RESIDENT';
};

export const isMedecin = async () => {
    const role = await getUserRole();
    return role === 'MEDECIN';
};