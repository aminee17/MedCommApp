import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelection() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenue !</Text>
            <Text style={styles.subtitle}>Sélectionnez votre rôle</Text>

            <TouchableOpacity 
                style={[styles.roleButton, styles.doctorButton]}
                onPress={() => navigation.navigate('MedecinAuth')}
            >
                <Text style={styles.buttonText}>Je suis médecin</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.roleButton, styles.neurologueButton]}
                onPress={() => navigation.navigate('NeurologueLogin')}
            >
                <Text style={styles.buttonText}>Je suis neurologue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.roleButton, styles.adminButton]}
                onPress={() => navigation.navigate('AdminLogin')}
            >
                <Text style={styles.buttonText}>Je suis administrateur</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
        color: '#555',
        textAlign: 'center',
    },
    roleButton: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    doctorButton: {
        backgroundColor: '#2196F3',
    },
    neurologueButton: {
        backgroundColor: '#9C27B0',
    },
    adminButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});