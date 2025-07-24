
import React from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox  from 'expo-checkbox';
import useMedicalForm from '../../hooks/useMedicalForm';
import DatePickerInput from './DatePickerInput';
import CounterInput from './CounterInput';
import ImagePickerInput from './ImagePickerInput';
import VideoPickerInput from './VideoPickerInput';
import LabeledCheckbox from "./LabeledCheckbox";
import styles from './styles';
import GenderCheckboxGroup from "./GenderCheckboxGroup";
import SeizureOccurrenceCheckboxGroup from "./SeizureOccurrenceCheckboxGroup";


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



            <GenderCheckboxGroup
                value={formData.gender}
                onChange={(val) => handleInputChange('gender', val)}
                options={genders}
            />

            <DatePickerInput
                style={styles.input}
                placeholder="Date de la première crise"
                value={formData.firstSeizureDate}
                onChange={(date) => handleInputChange('firstSeizureDate', date)}
                label="Date de la première crise"
            />

            <LabeledCheckbox
                label="Est-ce la première crise ?"
                value={formData.isFirstSeizure}
                onValueChange={(value) => handleCheckboxChange('isFirstSeizure', value)}
            />


            <TextInput
                style={styles.input}
                placeholder="Numéro de CIN (parent/patient)"
                value={formData.cinNumber}
                onChangeText={(text) => handleInputChange('cinNumber', text)}
                keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Région</Text>
                <Picker
                    selectedValue={formData.governorate_id}
                    onValueChange={(value) => handleGovernorateChange(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Sélectionner une région" value="" />
                    {governorates.map(gov => (
                        <Picker.Item key={gov.id} label={gov.name} value={gov.id.toString()} />
                    ))}
                </Picker>
            </View>
            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Ville</Text>
                <Picker
                    selectedValue={formData.city_id}
                    onValueChange={(value) => handleInputChange('city_id', value)}
                    style={styles.picker}
                    enabled={formData.governorate_id !== ''}
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


            <Text style={styles.sectionHeader}>2. Historique des crises</Text>
            <CounterInput
                label="Nombre total de crises"
                value={Number(formData.totalSeizures) || 0}
                onChange={val => handleInputChange('totalSeizures', val.toString())}
            />




            <DatePickerInput
                style={styles.input}
                placeholder="Date de la dernière crise"
                value={formData.lastSeizureDate}
                onChange={(date) => handleInputChange('lastSeizureDate', date)}
                label="Date de la dernière crise"
            />

            <SeizureOccurrenceCheckboxGroup
                values={formData.seizureOccurrence}
                onChange={(name, val) => handleNestedCheckboxChange('seizureOccurrence', name, val)}
                options={occurrences}
            />

            <Text style={styles.sectionHeader}>
                Durée moyenne d'une crise  (en minutes) :
            </Text>
            <CounterInput
                value={Number(formData.seizureDuration) || 0}
                onChange={(newVal) => handleInputChange('seizureDuration', newVal.toString())}
            />




            <LabeledCheckbox
                label="Y a-t-il un signe avant-coureur des crises (Aura) ?"
                value={formData.hasAura}
                onValueChange={(value) => handleCheckboxChange('hasAura', value)}
            />
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
            <LabeledCheckbox
                label="Tonico-clonique généralisée (perte de conscience, convulsions)"
                value={formData.seizureTypes.tonicClonic}
                onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'tonicClonic', value)}
            />
            <LabeledCheckbox
                label="Absence (regard fixe, absence de réponse)"
                value={formData.seizureTypes.absence}
                onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'absence', value)}
            />

            <LabeledCheckbox
                label="Focale (partielle)"
                value={formData.seizureTypes.focal}
                onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'focal', value)}
            />

            <LabeledCheckbox
                label="Myoclonique (sursauts)"
                value={formData.seizureTypes.myoclonic}
                onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'myoclonic', value)}
            />

            <LabeledCheckbox
                label="Atonique (chute soudaine)"
                value={formData.seizureTypes.atonic}
                onValueChange={(value) => handleNestedCheckboxChange('seizureTypes', 'atonic', value)}
            />



            <Text style={styles.sectionHeader}>3. Pendant la crise</Text>
            <LabeledCheckbox
                label="Perte de conscience ?"
                value={formData.lossOfConsciousness}
                onValueChange={(value) => handleCheckboxChange('lossOfConsciousness', value)}
            />

            <LabeledCheckbox
                label="Raidissement du corps ?"
                value={formData.bodyStiffening}
                onValueChange={(value) => handleCheckboxChange('bodyStiffening', value)}
            />

            <LabeledCheckbox
                label="Mouvements saccadés ?"
                value={formData.jerkingMovements}
                onValueChange={(value) => handleCheckboxChange('jerkingMovements', value)}
            />

            <LabeledCheckbox
                label="Déviation des yeux (d'un côté) ?"
                value={formData.eyeDeviation}
                onValueChange={(value) => handleCheckboxChange('eyeDeviation', value)}
            />

            <LabeledCheckbox
                label="Incontinence (urine/selles) ?"
                value={formData.incontinence}
                onValueChange={(value) => handleCheckboxChange('incontinence', value)}
            />

            <LabeledCheckbox
                label="Morsure de la langue ?"
                value={formData.tongueBiting}
                onValueChange={(value) => handleCheckboxChange('tongueBiting', value)}
            />

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


            <Text style={styles.sectionHeader}>10. Autres informations</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informations supplémentaires (détails importants non couverts ci-dessus)"
                multiline
                numberOfLines={4}
                value={formData.otherInformation}
                onChangeText={(text) => handleInputChange('otherInformation', text)}
            />

            <ImagePickerInput
                label="Photo IRM "
                value={formData.mriPhoto}
                onChange={file => handleInputChange('mriPhoto', file)}
            />

            <VideoPickerInput
                label="Vidéo de crise "
                value={formData.seizureVideo}
                onChange={file => handleInputChange('seizureVideo', file)}
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
