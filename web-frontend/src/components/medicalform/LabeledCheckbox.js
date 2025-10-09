import React from 'react';
import { View, Text } from 'react-native';
import Checkbox from 'expo-checkbox';
import styles from './styles';

export default function LabeledCheckbox({ label, value, onValueChange }) {
    return (
        <View style={styles.checkboxContainer}>
            <Checkbox
                value={value}
                onValueChange={onValueChange}
                tintColors={{ true: '#007AFF', false: '#ccc' }}
            />
            <Text style={styles.checkboxLabel}>{label}</Text>
        </View>
    );
}
