import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from './styles';

export default function FormPreviewModal({ visible, onClose, form }) {
    return (
        <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Détails du formulaire</Text>
                    {form ? (
                        <>
                            <Text style={styles.modalField}>Patient: {form.fullName}</Text>
                            <Text style={styles.modalField}>
                                Date de naissance: {form.birthDate ? new Date(form.birthDate).toLocaleDateString() : 'N/A'}
                            </Text>
                            <Text style={styles.modalField}>Genre: {form.gender}</Text>
                            <Text style={styles.modalField}>Téléphone: {form.phoneNumber}</Text>
                            <Text style={styles.modalField}>Adresse: {form.address}</Text>
                            <Text style={styles.modalField}>
                                Dernière crise: {form.lastSeizureDate ? new Date(form.lastSeizureDate).toLocaleDateString() : 'N/A'}
                            </Text>
                        </>
                    ) : null}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
