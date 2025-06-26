import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';

export default function useMedicalForm() {
    const navigation = useNavigation();
    const [validationErrors, setValidationErrors] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        firstSeizureDate: '',
        isFirstSeizure: false,
        cinNumber: '',
        Region: '',
        Ville: '',
        address: '',
        phoneNumber: '',
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

    const [governorates, setGovernorates] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchGovernorates();
    }, []);

    const fetchGovernorates = async () => {
        try {
            const response = await fetch('https://medical-mobile-app.onrender.com/api/locations/governorates');
            const data = await response.json();
            setGovernorates(data);
        } catch (error) {
            console.error('Error fetching governorates:', error);
        }
    };

    const fetchCities = async (governorateId) => {
        try {
            const response = await fetch(`https://medical-mobile-app.onrender.com/api/locations/cities/${governorateId}`);
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleGovernorateChange = (governorateId) => {
        setFormData(prev => ({
            ...prev,
            Region: governorateId,
            Ville: '' // Reset city when governorate changes
        }));
        setCities([]); // Clear cities
        if (governorateId) {
            fetchCities(governorateId);
        }
    };

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

    const validateForm = () => {
        const errors = [];

        if (!formData.fullName) errors.push("Nom complet requis");
        if (!formData.birthDate) errors.push("Date de naissance requise");
        if (!formData.gender) errors.push("Genre requis");
        if (!formData.cinNumber) errors.push("Numéro CIN requis");
        if (!formData.Region) errors.push("Gouvernorat requis");
        if (!formData.Ville) errors.push("Ville requise");
        if (!formData.address) errors.push("Adresse requise");
        if (!formData.phoneNumber) errors.push("Numéro de téléphone requis");
        if (!formData.firstSeizureDate) errors.push("Date de première crise requise");
        if (!formData.seizureDuration) errors.push("Durée de la crise requise");

        // Vérifie la fréquence et l'unité
        if (formData.seizureFrequency && !formData.seizureOccurrence) {
            errors.push("Type d'occurrence des crises manquant (quotidienne, hebdomadaire...)");
        }

        return errors;
    };

    const handleSubmit = async () => {
        const errors = validateForm();

        if (errors.length > 0) {
            setValidationErrors(errors);
            alert("Veuillez corriger les erreurs suivantes :\n\n" + errors.join("\n"));
            return;
        }

        try {
            // Format dates to ISO format (YYYY-MM-DD)
            const formatDate = (dateString) => {
                if (!dateString) return null;

                // Check if it's already in ISO format
                if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    return dateString;
                }

                // Parse DD/MM/YYYY format
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }

                return null;
            };

            const requestData = {
                fullName: formData.fullName,
                birthDate: formatDate(formData.birthDate),
                gender: formData.gender,
                cinNumber: parseInt(formData.cinNumber) || 0,
                region: formData.Region ? { id: parseInt(formData.Region) } : null,
                city: formData.Ville ? { id: parseInt(formData.Ville) } : null,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                firstSeizureDate: formatDate(formData.firstSeizureDate),
                lastSeizureDate: formatDate(formData.lastSeizureDate),
                isFirstSeizure: formData.isFirstSeizure,
                seizureFrequency: formData.seizureOccurrence === 'quotidienne' ? 'DAILY' :
                    formData.seizureOccurrence === 'hebdomadaire' ? 'WEEKLY' :
                        formData.seizureOccurrence === 'mensuelle' ? 'MONTHLY' : null,
                seizureDuration: parseInt(formData.seizureDuration) || 0,
                totalSeizures: parseInt(formData.seizureFrequency) || 0,
                hasAura: formData.hasAura,
                auraDescription: formData.auraDescription || "",
                seizureTypes: formData.seizureTypes,
                lossOfConsciousness: formData.lossOfConsciousness,
                bodyStiffening: formData.bodyStiffening,
                jerkingMovements: formData.jerkingMovements,
                eyeDeviation: formData.eyeDeviation,
                incontinence: formData.incontinence,
                tongueBiting: formData.tongueBiting,
                tongueBitingLocation: formData.tongueBitingLocation || "",
                otherInformation: formData.otherInformation || "",
                mriPhoto: formData.mriPhoto,
                seizureVideo: formData.seizureVideo,
                fileSize: 0
            };

            console.log('Sending data:', requestData);

            const response = await fetch('https://medical-mobile-app.onrender.com/api/medical-forms/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                throw new Error(`Server error: ${response.status}`);
            }

            const formId = await response.json();
            console.log('Form submitted successfully with ID:', formId);
            alert('Formulaire soumis avec succès!');
            navigation.navigate('Dashboard');

        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Erreur lors de la soumission du formulaire. Veuillez réessayer.');
        }
    };



    return {
        formData,
        governorates,
        cities,
        handleInputChange,
        handleCheckboxChange,
        handleNestedCheckboxChange,
        handleGovernorateChange,
        handleSubmit
    };
}