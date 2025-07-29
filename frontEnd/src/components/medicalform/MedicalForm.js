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
            
            <LabeledCheckbox
                label="Est-ce la première crise ?"
                value={formData.isFirstSeizure}
                onValueChange={(value) => handleCheckboxChange('isFirstSeizure', value)}
            />

            <DatePickerInput
                style={styles.input}
                placeholder="Date de la première crise"
                value={formData.firstSeizureDate}
                onChange={(date) => handleInputChange('firstSeizureDate', date)}
                label="Date de la première crise"
            />

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

            <Text style={styles.subSectionHeader}>
                Durée moyenne d'une crise (en minutes) :
            </Text>
            <CounterInput
                value={Number(formData.seizureDuration) || 0}
                onChange={(newVal) => handleInputChange('seizureDuration', newVal.toString())}
            />




            <LabeledCheckbox
                label="Y a-t-il un signe qui annonce la crise ?"
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
            <View style={styles.radioContainer}>
                <View style={styles.radioOption}>
                    <Checkbox
                        value={formData.seizureType === 'generalizedTonicClonic'}
                        onValueChange={() => handleInputChange('seizureType', 'generalizedTonicClonic')}
                        tintColors={{ true: '#007AFF', false: '#ccc' }}
                    />
                    <Text style={styles.radioOptionLabel}>Généralisée Tonico-clonique</Text>
                </View>
                <View style={styles.radioOption}>
                    <Checkbox
                        value={formData.seizureType === 'generalizedOther'}
                        onValueChange={() => handleInputChange('seizureType', 'generalizedOther')}
                        tintColors={{ true: '#007AFF', false: '#ccc' }}
                    />
                    <Text style={styles.radioOptionLabel}>Généralisée autre (tonique, clonique, myoclonique, atonique)</Text>
                </View>
                <View style={styles.radioOption}>
                    <Checkbox
                        value={formData.seizureType === 'absence'}
                        onValueChange={() => handleInputChange('seizureType', 'absence')}
                        tintColors={{ true: '#007AFF', false: '#ccc' }}
                    />
                    <Text style={styles.radioOptionLabel}>Absence</Text>
                </View>
                <View style={styles.radioOption}>
                    <Checkbox
                        value={formData.seizureType === 'focalWithLossOfConsciousness'}
                        onValueChange={() => handleInputChange('seizureType', 'focalWithLossOfConsciousness')}
                        tintColors={{ true: '#007AFF', false: '#ccc' }}
                    />
                    <Text style={styles.radioOptionLabel}>Focale avec perte de connaissance</Text>
                </View>
                <View style={styles.radioOption}>
                    <Checkbox
                        value={formData.seizureType === 'focalWithoutLossOfConsciousness'}
                        onValueChange={() => handleInputChange('seizureType', 'focalWithoutLossOfConsciousness')}
                        tintColors={{ true: '#007AFF', false: '#ccc' }}
                    />
                    <Text style={styles.radioOptionLabel}>Focale sans perte de connaissance</Text>
                </View>
            </View>



            <Text style={styles.subSectionHeader}>Pendant la crise</Text>
            <LabeledCheckbox
                label="Perte de connaissance"
                value={formData.lossOfConsciousness}
                onValueChange={(value) => handleCheckboxChange('lossOfConsciousness', value)}
            />

            <LabeledCheckbox
                label="Chute progressive"
                value={formData.progressiveFall}
                onValueChange={(value) => handleCheckboxChange('progressiveFall', value)}
            />

            <LabeledCheckbox
                label="Chute brusque"
                value={formData.suddenFall}
                onValueChange={(value) => handleCheckboxChange('suddenFall', value)}
            />

            <LabeledCheckbox
                label="Raidissement du corps"
                value={formData.bodyStiffening}
                onValueChange={(value) => handleCheckboxChange('bodyStiffening', value)}
            />

            <LabeledCheckbox
                label="Secousses cloniques"
                value={formData.clonicJerks}
                onValueChange={(value) => handleCheckboxChange('clonicJerks', value)}
            />

            <LabeledCheckbox
                label="Automatismes"
                value={formData.automatisms}
                onValueChange={(value) => handleCheckboxChange('automatisms', value)}
            />

            <LabeledCheckbox
                label="Déviation des yeux (d'un côté)"
                value={formData.eyeDeviation}
                onValueChange={(value) => handleCheckboxChange('eyeDeviation', value)}
            />

            <LabeledCheckbox
                label="Arrêt de l'activité en cours"
                value={formData.activityStop}
                onValueChange={(value) => handleCheckboxChange('activityStop', value)}
            />

            <LabeledCheckbox
                label="Troubles sensitifs"
                value={formData.sensitiveDisorders}
                onValueChange={(value) => handleCheckboxChange('sensitiveDisorders', value)}
            />

            <LabeledCheckbox
                label="Troubles sensoriels"
                value={formData.sensoryDisorders}
                onValueChange={(value) => handleCheckboxChange('sensoryDisorders', value)}
            />

            <LabeledCheckbox
                label="Incontinence (urine/selles)"
                value={formData.incontinence}
                onValueChange={(value) => handleCheckboxChange('incontinence', value)}
            />

            <LabeledCheckbox
                label="Morsure latérale de la langue"
                value={formData.lateralTongueBiting}
                onValueChange={(value) => handleCheckboxChange('lateralTongueBiting', value)}
            />


            <Text style={styles.subSectionHeader}>Autres informations</Text>
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