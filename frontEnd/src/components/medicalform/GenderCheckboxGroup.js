import React from 'react';
import { View, Text } from 'react-native';
import LabeledCheckbox from './LabeledCheckbox';
import styles from './styles';

export default function GenderCheckboxGroup({ value, onChange, options }) {
    return (
        <View>
            <Text style={styles.sectionHeader}>Sexe</Text>
            {options.map((option) => (
                <LabeledCheckbox
                    key={option}
                    label={option}
                    value={value === option}
                    onValueChange={() => onChange(option)}
                />
            ))}
        </View>
    );
}
