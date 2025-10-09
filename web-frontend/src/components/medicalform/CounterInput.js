import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const CounterInput = ({ value, onChange, label, unit }) => {
    const increase = () => onChange(value + 1);
    const decrease = () => {
        if (value > 0) onChange(value - 1);
    };

    return (
        <View style={{ marginBottom: 15 }}>
            {label && <Text style={{ marginBottom: 4, color: '#555' }}>{label}</Text>}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={decrease} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>
                    {value} {unit}
                </Text>
                <TouchableOpacity onPress={increase} style={styles.counterButton}>
                    <Text style={styles.counterButtonText}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CounterInput;