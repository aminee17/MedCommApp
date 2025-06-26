import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../medicalform/styles';
const Dashboard = () => {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        fetchForms();
    }, []);

    const fetchForms = async () => {
        try {
            const response = await fetch('https://medical-mobile-app.onrender.com/api/medical-forms/doctor');
            const data = await response.json();
            setForms(data);
        } catch (error) {
            console.error('Error fetching forms:', error);
        }
    };

    const handleFormPress = (form) => {
        setSelectedForm(form);
        setModalVisible(true);
    };

    const renderFormItem = ({ item }) => (
        <TouchableOpacity
            style={styles.formCard}
            onPress={() => handleFormPress(item)}
        >
            <Text style={styles.patientName}>{item.fullName  || 'N/A'}</Text>
            <Text style={styles.formDate}>
                Date: {item.submissionDate ? new Date(item.submissionDate).toLocaleDateString() : 'N/A'}
            </Text>
            <Text style={styles.formStatus}>
                Status: {item.status || 'En attente'}
                {/* Action buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => alert('Fonctionnalité à venir')}
                    >
                        <Text style={styles.actionButtonText}>Voir réponses</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.chatButton]}
                        onPress={() => alert('Chat à venir')}
                    >
                        <Text style={styles.actionButtonText}>💬</Text>
                    </TouchableOpacity>
                </View>
            </Text>
        </TouchableOpacity>
    );

    const FormPreviewModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Détails du formulaire</Text>
                    {selectedForm && (
                        <>
                            <Text style={styles.modalField}>Patient: {selectedForm.fullName}</Text>
                            <Text style={styles.modalField}>Date de naissance: {selectedForm.birthDate ? new Date(selectedForm.birthDate).toLocaleDateString() : 'N/A'}</Text>
                            <Text style={styles.modalField}>Genre: {selectedForm.gender}</Text>
                            <Text style={styles.modalField}>Téléphone: {selectedForm.phoneNumber}</Text>
                            <Text style={styles.modalField}>Adresse: {selectedForm.address}</Text>
                            <Text style={styles.modalField}>
                                Dernière crise: {selectedForm.lastSeizureDate ? new Date(selectedForm.lastSeizureDate).toLocaleDateString() : 'N/A'}
                            </Text>
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tableau de bord</Text>
                <TouchableOpacity
                    style={styles.newFormButton}
                    onPress={() => navigation.navigate('MedicalForm')}
                >
                    <Text style={styles.newFormButtonText}>+ Nouveau formulaire</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={forms}
                renderItem={renderFormItem}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}

                contentContainerStyle={styles.formList}
            />
            <FormPreviewModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        paddingBottom: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    newFormButton: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginTop: 15,
    },
    newFormButtonText: {
        color: '#007AFF',
        fontWeight: 'bold',
    },
    formList: {
        padding: 10,
    },
    formCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    patientName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    formDate: {
        color: '#666',
    },
    formStatus: {
        color: '#007AFF',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: 350,
        maxHeight:  600,
        alignSelf: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalField: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 15,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default Dashboard;