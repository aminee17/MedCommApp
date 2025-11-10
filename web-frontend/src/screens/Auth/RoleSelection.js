import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS, BORDER_RADIUS, GRADIENTS, SIZES } from '../../utils/theme';


export default function RoleSelection() {
    const navigation = useNavigation();

    return (
        <LinearGradient colors={GRADIENTS.hero} style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Bienvenue !</Text>
                <Text style={styles.subtitle}>Sélectionnez votre rôle</Text>

                <TouchableOpacity 
                    style={[styles.roleCard, styles.doctorCard]}
                    onPress={() => navigation.navigate('MedecinAuth')}
                >
                    <Text style={styles.cardTitle}>Médecin</Text>
                    <Text style={styles.cardSubtitle}>Accédez à vos patients et formulaires</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.roleCard, styles.neurologueCard]}
                    onPress={() => navigation.navigate('NeurologueLogin')}
                >
                    <Text style={styles.cardTitle}>Neurologue</Text>
                    <Text style={styles.cardSubtitle}>Consultez les cas et analyses</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.roleCard, styles.adminCard]}
                    onPress={() => navigation.navigate('AdminLogin')}
                >
                    <Text style={styles.cardTitle}>Admin</Text>
                    <Text style={styles.cardSubtitle}>Gérez les utilisateurs et l’accès</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.l,
    },
    content: {
        width: '100%',
        maxWidth: 540,
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
        color: COLORS.primaryDark,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        marginBottom: SPACING.xl,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    roleCard: {
        width: '100%',
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.xl,
        alignItems: 'flex-start',
        marginVertical: SPACING.s,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.small,
    },
    doctorCard: {
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primary,
    },
    neurologueCard: {
        borderLeftWidth: 6,
        borderLeftColor: COLORS.teal,
    },
    adminCard: {
        borderLeftWidth: 6,
        borderLeftColor: COLORS.primaryDark,
    },
    cardTitle: {
        fontSize: SIZES.xlarge,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
    },
});