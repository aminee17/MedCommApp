

export default function validateMedicalForm(formData) {
    const errors = [];

    if (!formData.fullName) errors.push("Nom complet requis");
    if (!formData.gender) errors.push("Genre requis");
    if (!formData.cinNumber) errors.push("Numéro CIN requis");
    if (!formData.governorate_id) errors.push("Gouvernorat requis");
    if (!formData.city_id) errors.push("Ville requise");
    if (!formData.address) errors.push("Adresse requise");
    if (!formData.phoneNumber) errors.push("Numéro de téléphone requis");
    if (!formData.seizureDuration) errors.push("Durée de la crise requise");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push("Format d'email invalide");
    }

    if (formData.seizureFrequency && !formData.seizureOccurrence) {
        errors.push("Type d'occurrence des crises manquant (quotidienne, hebdomadaire...)");
    }

    return errors;
}
