import {StyleSheet} from "react-native";

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        flexWrap: 'wrap', // Ensure it doesn’t overflow
    },
    logoutButton: {
        backgroundColor: '#f44336',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },

    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 60, // Give space for buttons and keyboard
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
        borderColor: '#ddd',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10,
    },
    cancelButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#555',
        fontSize: 16,
    },
    loader: {
        marginVertical: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center',
        color: '#555'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16
    },
    loginButton: {
        backgroundColor: '#2196F3',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10
    },
    backButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 10
    },
    backButtonText: {
        color: '#555',
        fontSize: 16
    },
    buttonContainer: {
        marginVertical: 10,
        width: '100%'
    }

});
export default styles;