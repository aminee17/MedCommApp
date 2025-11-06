import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 10,
        color: '#007AFF',
    },
    subSectionHeader: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 8,
        color: '#555',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkboxLabel: {
        marginLeft: 8,
        flex: 1,
        color: '#333',
    },
    radioContainer: {
        marginLeft: 10,
        marginBottom: 15,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioOptionLabel: {
        marginLeft: 8,
        color: '#333',
        fontSize: 14,
    },
    radioLabel: {
        marginBottom: 8,
        color: '#555',
    },
    submitButton: {
        marginTop: 20,
        borderRadius: 5,
        overflow: 'hidden',
    },
    
    counterButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 10,
    },
    counterButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    counterValue: {
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 50,
        textAlign: 'center',
        color: '#333',
    },
    pickerContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    
    // NEW STYLES FOR SEIZURE TYPE SELECTION
    subSection: {
        marginLeft: 15,
        marginBottom: 20,
        paddingLeft: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#007AFF',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
    },
    checkboxOption: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        padding: 5,
    },
    checkboxOptionLabel: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
        flex: 1,
        lineHeight: 20,
    },
    
    // Enhanced styles for better organization
    seizureTypeContainer: {
        marginBottom: 20,
    },
    mainTypeContainer: {
        backgroundColor: '#f0f8ff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    subtypeContainer: {
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 8,
        marginTop: 10,
    },
    
    // Additional utility styles
    required: {
        color: 'red',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        fontStyle: 'italic',
    },
    
    // File upload styles
    fileUploadContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    fileUploadText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    
    // Counter container
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    
    // Date picker styles
    datePickerContainer: {
        marginBottom: 15,
    },
    datePickerButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    datePickerText: {
        color: '#333',
        fontSize: 16,
    },
    
    // Gender checkbox group
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 8,
    },
    genderOption: {
        alignItems: 'center',
        padding: 10,
    },
    genderLabel: {
        marginTop: 5,
        fontSize: 14,
        color: '#333',
    },
    
    // Occurrence checkbox group
    occurrenceContainer: {
        marginBottom: 15,
    },
    occurrenceRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    occurrenceOption: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 10,
    },
    
    // Error styles
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    
    // Success styles
    successText: {
        color: 'green',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 10,
    },
    
    // Loading styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    
    // Section divider
    sectionDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
    
    // Selected item highlight
    selectedItem: {
        backgroundColor: '#e3f2fd',
        borderRadius: 6,
    },
    
    // Info icon styles
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoIcon: {
        marginRight: 8,
    },
    
    // Multi-select chip styles
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    chip: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    chipText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
    },
    
    // Seizure type specific styles
    seizureMainTypeSelected: {
        backgroundColor: '#e3f2fd',
        borderLeftColor: '#007AFF',
        borderLeftWidth: 4,
        paddingLeft: 11, // Adjust for border
    },
    seizureSubtypeSelected: {
        backgroundColor: '#f0f8ff',
        borderRadius: 6,
    },
});

export default styles;
