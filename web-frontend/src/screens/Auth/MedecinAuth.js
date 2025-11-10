import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useMedecinAuth from '../../hooks/useMedecinAuth';
import { COLORS, SPACING, SIZES, SHADOWS, GRADIENTS } from '../../utils/theme';
import { Button, Input, Card } from '../../components/common';
import { LinearGradient } from 'expo-linear-gradient';

export default function MedecinAuth({ navigation }) {
    const [showLogin, setShowLogin] = useState(false);
    const { email, setEmail, password, setPassword, handleLogin, loading } = useMedecinAuth(navigation);

    if (showLogin) {
        return (
            <LinearGradient colors={GRADIENTS.auth} style={styles.container}>
                <Card style={styles.card}>
                    <Text style={styles.title}>Connexion Médecin</Text>
                    
                    <Input
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Entrez votre email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    
                    <Input
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Entrez votre mot de passe"
                        secureTextEntry
                    />
                    
                    <Button
                        title="Se connecter"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                    />
                    
                    <Button
                        title="Retour"
                        onPress={() => setShowLogin(false)}
                        type="outline"
                        style={styles.button}
                    />
                </Card>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={GRADIENTS.auth} style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>Espace Médecin</Text>
                <Text style={styles.subtitle}>Choisissez une option :</Text>

                <Button
                    title="Se connecter"
                    onPress={() => setShowLogin(true)}
                    style={styles.button}
                />

                <Button
                    title="Demander la création de compte"
                    onPress={() => navigation.navigate('DoctorRegistration')}
                    type="secondary"
                    style={styles.button}
                />
            </Card>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    card: {
        padding: SPACING.l,
    },
    title: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.m,
        textAlign: 'center',
        color: COLORS.dark,
    },
    subtitle: {
        fontSize: SIZES.large,
        marginBottom: SPACING.xl,
        textAlign: 'center',
        color: COLORS.grey,
    },
    button: {
        marginVertical: SPACING.s,
    },
});