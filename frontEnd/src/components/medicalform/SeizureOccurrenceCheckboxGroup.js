import React from 'react';
import { View, Text } from 'react-native';
import LabeledCheckbox from './LabeledCheckbox';
import styles from './styles';

export default function SeizureOccurrenceCheckboxGroup({ values, onChange, options }) {
    return (
        <View>
            <Text style={styles.sectionHeader}>Fréquence des crises</Text>
            {options.map((occ) => (
                <LabeledCheckbox
                    key={occ}
                    label={occ}
                    value={values[occ] || false}
                    onValueChange={(newValue) => onChange(occ, newValue)}
                />
            ))}
        </View>
    );
}
