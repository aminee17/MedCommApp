const initialMedicalFormState = {
    // Patient Info
    fullName: '',
    birthDate: '',
    gender: '',
    cinNumber: '',
    governorate_id: '',
    city_id: '',
    address: '',
    phoneNumber: '',

    // Seizure History
    firstSeizureDate: '',
    lastSeizureDate: '',
    isFirstSeizure: false,
    totalSeizures: '',
    seizureDuration: '',
    seizureFrequency: '',
    seizureOccurrence: '',

    // Characteristics
    hasAura: false,
    auraDescription: '',
    seizureType: '', // Single choice instead of seizureTypes object

    // "Pendant la crise" symptoms
    lossOfConsciousness: false,
    progressiveFall: false,
    suddenFall: false,
    bodyStiffening: false,
    clonicJerks: false,
    automatisms: false,
    eyeDeviation: false,
    activityStop: false,
    sensitiveDisorders: false,
    sensoryDisorders: false,
    incontinence: false,
    lateralTongueBiting: false,

    // Miscellaneous
    otherInformation: '',
    mriPhoto: null,
    seizureVideo: null
};

export default initialMedicalFormState;