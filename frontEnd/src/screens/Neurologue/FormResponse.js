import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    TouchableOpacity, 
    StyleSheet,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePickerInput from '../../components/medicalform/DatePickerInput';
import { submitFormResponse } from '../../services/neurologueService';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '../../utils/theme';

const FormResponse = ({ route, navigation }) => {
    const { formId } = route.params;
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        formId: formId,
        responseType: 'DIAGNOSIS',
        diagnosis: '',
        recommendations: '',
        treatmentSuggestions: '',
        medicationChanges: '',
        followUpInstructions: '',
        requiresSupervision: false,
        urgencyLevel: 'LOW',
        followUpRequired: false,
        followUpDate: null,
        supervisionDoctorId: null
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.diagnosis.trim()) {
            Alert.alert('Erreur', 'Veuillez fournir un diagnostic');
            return;
        }

        try {
            setLoading(true);
            await submitFormResponse(formData);
            Alert.alert(
                'Succès', 
                'Votre réponse a été envoyée avec succès',
                [{ text: 'OK', onPress: () => navigation.navigate('NeurologueDashboard') }]
            );
        } catch (error) {
            console.error('Error submitting response:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de l\'envoi de votre réponse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.mainContainer}>
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                >
                    <Text style={styles.header}>Réponse au formulaire #{formId}</Text>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Type de réponse</Text>
                        <View style={styles.cardContent}>
                            <Picker
                                selectedValue={formData.responseType}
                                onValueChange={(value) => handleInputChange('responseType', value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Diagnostic" value="DIAGNOSIS" />
                                <Picker.Item label="Recommandation" value="RECOMMENDATION" />
                                <Picker.Item label="Demande de supervision" value="SUPERVISION_REQUEST" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Diagnostic</Text>
                        <View style={styles.cardContent}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Entrez votre diagnostic"
                                value={formData.diagnosis}
                                onChangeText={(text) => handleInputChange('diagnosis', text)}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Recommandations</Text>
                        <View style={styles.cardContent}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Entrez vos recommandations"
                                value={formData.recommendations}
                                onChangeText={(text) => handleInputChange('recommendations', text)}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Suggestions de traitement</Text>
                        <View style={styles.cardContent}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Entrez vos suggestions de traitement"
                                value={formData.treatmentSuggestions}
                                onChangeText={(text) => handleInputChange('treatmentSuggestions', text)}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Changements de médication</Text>
                        <View style={styles.cardContent}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Entrez les changements de médication"
                                value={formData.medicationChanges}
                                onChangeText={(text) => handleInputChange('medicationChanges', text)}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Instructions de suivi</Text>
                        <View style={styles.cardContent}>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Entrez les instructions de suivi"
                                value={formData.followUpInstructions}
                                onChangeText={(text) => handleInputChange('followUpInstructions', text)}
                                multiline
                            />
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Niveau d'urgence</Text>
                        <View style={styles.cardContent}>
                            <Picker
                                selectedValue={formData.urgencyLevel}
                                onValueChange={(value) => handleInputChange('urgencyLevel', value)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Faible" value="LOW" />
                                <Picker.Item label="Moyen" value="MEDIUM" />
                                <Picker.Item label="Élevé" value="HIGH" />
                                <Picker.Item label="Critique" value="CRITICAL" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Options supplémentaires</Text>
                        <View style={styles.cardContent}>
                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.checkbox,
                                        formData.followUpRequired && styles.checkboxChecked
                                    ]}
                                    onPress={() => handleInputChange('followUpRequired', !formData.followUpRequired)}
                                />
                                <Text style={styles.checkboxLabel}>Suivi requis</Text>
                            </View>

                            {formData.followUpRequired && (
                                <View style={styles.datePickerContainer}>
                                    <DatePickerInput
                                        label="Date de suivi"
                                        value={formData.followUpDate}
                                        onChange={(date) => handleInputChange('followUpDate', date)}
                                        formatForBackend={true} // Use ISO format for backend
                                    />
                                </View>
                            )}

                            <View style={styles.checkboxContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.checkbox,
                                        formData.requiresSupervision && styles.checkboxChecked
                                    ]}
                                    onPress={() => handleInputChange('requiresSupervision', !formData.requiresSupervision)}
                                />
                                <Text style={styles.checkboxLabel}>Nécessite une supervision</Text>
                            </View>
                        </View>
                    </View>
                    
                    {/* Extra space at bottom for fixed button */}
                    <View style={{ height: 60 }} />
                </ScrollView>
                
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.light} />
                        ) : (
                            <Text style={styles.submitButtonText}>Envoyer la réponse</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGrey,
    },
    mainContainer: {
        flex: 1,
        position: 'relative',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: SPACING.m,
    },
    header: {
        fontSize: SIZES.xlarge,
        fontWeight: 'bold',
        marginBottom: SPACING.l,
        textAlign: 'center',
        color: COLORS.dark,
    },
    card: {
        backgroundColor: COLORS.light,
        borderRadius: 10,
        marginBottom: SPACING.m,
        ...SHADOWS.small,
        overflow: 'hidden',
    },
    sectionTitle: {
        fontSize: SIZES.medium,
        fontWeight: 'bold',
        color: COLORS.primary,
        padding: SPACING.m,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    cardContent: {
        padding: SPACING.m,
    },
    picker: {
        backgroundColor: COLORS.light,
        marginHorizontal: -8, // Fix for Android picker padding
    },
    textArea: {
        backgroundColor: COLORS.light,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: SPACING.m,
        fontSize: SIZES.medium,
        minHeight: 100,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.s,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 4,
        marginRight: SPACING.m,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
    },
    checkboxLabel: {
        fontSize: SIZES.medium,
        color: COLORS.dark,
    },
    datePickerContainer: {
        marginVertical: SPACING.m,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20, // Moved up more from bottom edge
        left: 0,
        right: 0,
        backgroundColor: COLORS.light,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.l,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        ...SHADOWS.medium,
    },
    submitButton: {
        backgroundColor: COLORS.secondary,
        borderRadius: 8,
        padding: SPACING.m,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: COLORS.light,
        fontSize: SIZES.medium,
        fontWeight: 'bold',
    },
});

export default FormResponse;