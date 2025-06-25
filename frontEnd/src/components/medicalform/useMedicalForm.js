import { useState } from 'react';

export default function useMedicalForm() {
    const [formData, setFormData] = useState({
        name: '',
        birthdate: '',
        gender: '',
        firstSeizureDate: '',
        isFirstSeizure: false,
        cin: '',
        Region: '',
        Ville: '',
        address: '',
        phone: '',
        seizureFrequency: '',
        lastSeizureDate: '',
        seizureOccurrence: '',
        seizureDuration: '',
        hasAura: false,
        auraDescription: '',
        seizureTypes: {
            tonicClonic: false,
            absence: false,
            focal: false,
            myoclonic: false,
            atonic: false
        },
        lossOfConsciousness: false,
        bodyStiffening: false,
        jerkingMovements: false,
        eyeDeviation: false,
        incontinence: false,
        tongueBiting: false,
        tongueBitingLocation: '',
        confusion: false,
        headache: false,
        fatigue: false,
        weaknessOneSide: false,
        speechDifficulty: false,
        recoveryDuration: '',
        triggers: {
            sleepDeprivation: false,
            stress: false,
            flashingLights: false,
            fever: false,
            missedMedications: false,
            alcoholDrugUse: false
        },
        usualSeizureTime: '',
        relatedToMenstrualCycle: false,
        medicalHistory: {
            brainInjury: false,
            stroke: false,
            tumor: false,
            meningitisEncephalitis: false,
            intellectualDisability: false
        },
        familyEpilepsyHistory: false,
        onMedication: false,
        medicationNames: '',
        dosage: '',
        duration: '',
        sideEffects: '',
        compliantWithTreatment: false,
        previousEEG: false,
        eegResult: '',
        previousMRI: false,
        mriResult: '',
        bloodTestsDone: false,
        canAttendSchoolWork: false,
        injuryDueToSeizures: false,
        psychosocialIssues: false,
        recentHospitalizations: false,
        otherInformation: '',
        mriPhoto: null,
        seizureVideo: null
    });

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNestedCheckboxChange = (parent, name, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [name]: value
            }
        }));
    };

    const handleSubmit = () => {
        console.log('Données du formulaire:', formData);
    };

    return {
        formData,
        handleInputChange,
        handleCheckboxChange,
        handleNestedCheckboxChange,
        handleSubmit
    };
}
// This custom hook manages the state of a medical form, allowing for input changes and submission.
// It provides functions to handle input changes, checkbox changes, and nested checkbox changes.