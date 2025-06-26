import React from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox  from 'expo-checkbox';
import useMedicalForm from './useMedicalForm';
import DatePickerInput from './DatePickerInput';
import CounterInput from './CounterInput';
import ImagePickerInput from './ImagePickerInput';
import VideoPickerInput from './VideoPickerInput';


const MedicalForm = () => {
    const {
        formData,
        governorates,
        cities,
        handleInputChange,
        handleCheckboxChange,
        handleNestedCheckboxChange,
        handleGovernorateChange,
        handleSubmit,
    } = useMedicalForm();

    const genders = ['M', 'F'];
    const occurrences = ['quotidienne', 'hebdomadaire', 'mensuelle'];



    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            <Text style={styles.header}>Formulaire Médical pour l'Épilepsie</Text>

            {/* Section 1: Informations de base */}
            <Text style={styles.sectionHeader}>1. Informations de base</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom complet"
                value={formData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
            />


            <DatePickerInput
                style={styles.input}
                placeholder="Date de naissance "
                value={formData.birthDate}
                onChange={(date) => handleInputChange('birthDate', date)}
                label="Date de naissance"
            />

            <View>
                <Text style={styles.sectionHeader}>Sexe</Text>
                {genders.map((genderOption) => (
                    <View key={genderOption} style={styles.checkboxContainer}>
                        <Checkbox
                            value={formData.gender === genderOption}
                            onValueChange={() => handleInputChange('gender', genderOption)}
                            tintColors={{ true: '#007AFF', false: '#ccc' }}
                        />
                        <Text style={styles.checkboxLabel}>{genderOption}</Text>
                    </View>
                ))}
            </View>

            <DatePickerInput
                style={styles.input}
                placeholder="Date de la première crise"
                value={formData.firstSeizureDate}
                onChange={(date) => handleInputChange('firstSeizureDate', date)}
                label="Date de la première crise"
            />


            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.isFirstSeizure}
                    onValueChange={(value) => handleCheckboxChange('isFirstSeizure', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Est-ce la première crise ?</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Numéro de CIN (parent/patient)"
                value={formData.cinNumber}
                onChangeText={(text) => handleInputChange('cinNumber', text)}
                keyboardType="numeric"
            />
            {/* Region Dropdown */}
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Région</Text>
                <Picker
                    selectedValue={formData.Region}
                    onValueChange={(value) => handleGovernorateChange(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner une région" value="" />
                    {governorates.map(gov => (
                        <Picker.Item key={gov.id} label={gov.name} value={gov.id.toString()} />
                    ))}
                </Picker>
            </View>

            {/* City Dropdown */}
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Ville</Text>
                <Picker
                    selectedValue={formData.Ville}
                    onValueChange={(value) => handleInputChange('Ville', value)}
                    style={styles.picker}
                    enabled={formData.Region !== ''}
                >
                    <Picker.Item label="Sélectionner une ville" value="" />
                    {cities.map(city => (
                        <Picker.Item key={city.id} label={city.name} value={city.id.toString()} />
                    ))}
                </Picker>
            </View>


            <TextInput
                style={styles.input}
                placeholder="Adresse complète"
                value={formData.address}
                onChangeText={(text) => handleInputChange('address', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Numéro de téléphone"
                value={formData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                keyboardType="phone-pad"
            />

            {/* Section 2: Historique des crises */}
            <Text style={styles.sectionHeader}>2. Historique des crises</Text>
            <CounterInput
                label="Nombre total de crises"
                value={Number(formData.seizureFrequency) || 0}
                onChange={val => handleInputChange('seizureFrequency', val.toString())}
            />


            <DatePickerInput
                style={styles.input}
                placeholder="Date de la dernière crise"
                value={formData.lastSeizureDate}
                onChange={(date) => handleInputChange('lastSeizureDate', date)}
                label="Date de la dernière crise"
            />

            <View>
                <Text style={styles.sectionHeader}>Fréquence des crises</Text>
                {occurrences.map((occ) => (
                    <View key={occ} style={styles.checkboxContainer}>
                        <Checkbox
                            value={formData.seizureOccurrence[occ] || false}
                            onValueChange={(newValue) => handleNestedCheckboxChange('seizureOccurrence', occ, newValue)}
                            tintColors={{ true: '#007AFF', false: '#ccc' }}
                        />
                        <Text style={styles.checkboxLabel}>{occ}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionHeader}>
                Durée moyenne d'une crise  (en minutes) :
            </Text>
            <CounterInput
                value={Number(formData.seizureDuration) || 0}
                onChange={(newVal) => handleInputChange('seizureDuration', newVal.toString())}
            />




            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.hasAura}
                    onValueChange={(value) => handleCheckboxChange('hasAura', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Y a-t-il un signe avant-coureur des crises (Aura) ?</Text>
            </View>
            {formData.hasAura && (
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Décrivez l'aura (sensations, durée, etc.)"
                    value={formData.auraDescription}
                    onChangeText={(text) => handleInputChange('auraDescription', text)}
                    multiline
                />
            )}

            <Text style={styles.subSectionHeader}>Type de crises (si connu):</Text>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.seizureTypes.tonicClonic}
                    onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'tonicClonic', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Tonico-clonique généralisée (perte de conscience, convulsions)</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.seizureTypes.absence}
                    onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'absence', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Absence (regard fixe, absence de réponse)</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.seizureTypes.focal}
                    onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'focal', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Focale (partielle)</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.seizureTypes.myoclonic}
                    onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'myoclonic', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Myoclonique (sursauts)</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.seizureTypes.atonic}
                    onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'atonic', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Atonique (chute soudaine)</Text>
            </View>

            {/* Section 3: Pendant la crise */}
            <Text style={styles.sectionHeader}>3. Pendant la crise</Text>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.lossOfConsciousness}
                    onValueChange={(value) => handleCheckboxChange('lossOfConsciousness', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Perte de conscience ?</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.bodyStiffening}
                    onValueChange={(value) => handleCheckboxChange('bodyStiffening', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Raidissement du corps ?</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.jerkingMovements}
                    onValueChange={(value) => handleCheckboxChange('jerkingMovements', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Mouvements saccadés ?</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.eyeDeviation}
                    onValueChange={(value) => handleCheckboxChange('eyeDeviation', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Déviation des yeux (d'un côté) ?</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.incontinence}
                    onValueChange={(value) => handleCheckboxChange('incontinence', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Incontinence (urine/selles) ?</Text>
            </View>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    value={formData.tongueBiting}
                    onValueChange={(value) => handleCheckboxChange('tongueBiting', value)}
                    tintColors={{ true: '#007AFF', false: '#ccc' }}
                />
                <Text style={styles.checkboxLabel}>Morsure de la langue ?</Text>
            </View>
            {formData.tongueBiting && (
                <View style={styles.radioContainer}>
                    <Text style={styles.radioLabel}>Partie de la langue mordue :</Text>
                    <View style={styles.radioOption}>
                        <Checkbox
                            value={formData.tongueBitingLocation === 'side'}
                            onValueChange={() => handleInputChange('tongueBitingLocation', 'side')}
                            tintColors={{ true: '#007AFF', false: '#ccc' }}
                        />
                        <Text style={styles.radioOptionLabel}>Côté</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <Checkbox
                            value={formData.tongueBitingLocation === 'tip'}
                            onValueChange={() => handleInputChange('tongueBitingLocation', 'tip')}
                            tintColors={{ true: '#007AFF', false: '#ccc' }}
                        />
                        <Text style={styles.radioOptionLabel}>Bout</Text>
                    </View>
                </View>
            )}

            {/* Section 10: Autres informations */}
            <Text style={styles.sectionHeader}>10. Autres informations</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informations supplémentaires (détails importants non couverts ci-dessus)"
                multiline
                numberOfLines={4}
                value={formData.otherInformation}
                onChangeText={(text) => handleInputChange('otherInformation', text)}
            />
            {/*...avant le bouton de soumission... */}
            <ImagePickerInput
                label="Photo IRM "
                value={formData.mriPhoto}
                onChange={uri => handleInputChange('mriPhoto', uri)}
            />

            <VideoPickerInput
                label="Vidéo de crise "
                value={formData.seizureVideo}
                onChange={uri => handleInputChange('seizureVideo', uri)}
            />
            <View style={styles.submitButton}>
                <Button
                    title="Soumettre le formulaire"
                    onPress={handleSubmit}
                    color="#007AFF"
                />
            </View>
        </ScrollView>
    );
};


export default MedicalForm;