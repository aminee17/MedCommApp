import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import useLocations from './useLocations';
import validateMedicalForm from '../utils/validateMedicalForm';
import { submitMedicalForm } from '../services/medicalFormService';
import initialMedicalFormState from '../constants/initialMedicalFormState';


export default function useMedicalForm() {
    const navigation = useNavigation();
    const { governorates, cities, fetchCities } = useLocations();
    const [validationErrors, setValidationErrors] = useState([]);
    const [formData, setFormData] = useState(initialMedicalFormState);

    const handleGovernorateChange = (governorateId) => {
        setFormData(prev => ({
            ...prev,
            governorate_id: governorateId,
            city_id: '' // Reset city when governorate changes
        }));
        if (governorateId) {
            fetchCities(governorateId);
        }
    };



    const updateField = (name, value, isNested = false, parentKey = '') => {
        setFormData(prev => {
            if (isNested) {
                return {
                    ...prev,
                    [parentKey]: {
                        ...prev[parentKey],
                        [name]: value
                    }
                };
            } else {
                return {
                    ...prev,
                    [name]: value
                };
            }
        });
    };



    const handleSubmit = async () => {
        const errors = validateMedicalForm(formData);

        if (errors.length > 0)
        {
            setValidationErrors(errors);
            alert("Veuillez corriger les erreurs suivantes :\n\n" + errors.join("\n"));
            return;
        }
        try
        {
            const formId = await submitMedicalForm(formData);
            alert('Formulaire soumis avec succès!', [
                { text: 'OK', onPress: () => navigation.navigate('DoctorDashboard') }
            ]);
        }
        catch (error)
        {
            console.error('Error submitting form:', error);
            alert('Erreur lors de la soumission du formulaire. Veuillez réessayer.');
        }
    };

    const handleInputChange = (field, value) => {
        updateField(field, value);
    };

    const handleCheckboxChange = (field, value) => {
        updateField(field, value);
    };

    const handleNestedCheckboxChange = (parentKey, field, value) => {
        updateField(field, value, true, parentKey);
    };

    return {
        formData,
        governorates,
        cities,
        updateField,
        handleGovernorateChange,
        handleSubmit,
        handleInputChange,
        handleCheckboxChange,
        handleNestedCheckboxChange
    };
}
