import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const DatePickerInput = ({ label, value, onChange, style, placeholder, formatForBackend = true }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [textValue, setTextValue] = useState('');

    function parseDateString(dateString) {
        if (!dateString) return new Date();
        
        // Handle ISO format (YYYY-MM-DD)
        if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            return new Date(dateString);
        }
        
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/');
        if (!day || !month || !year) return new Date();
        return new Date(`${year}-${month}-${day}`);
    }

    // Format date for display (DD/MM/YYYY)
    function formatDateForDisplay(date) {
        if (!date) return '';
        return date.toLocaleDateString('fr-FR');
    }
    
    // Format date for backend (YYYY-MM-DD)
    function formatDateForBackend(date) {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const dateValue = useMemo(() => parseDateString(value), [value]);

    useEffect(() => {
        if (!value) {
            setTextValue('');
        } else {
            try {
                const d = parseDateString(value);
                setTextValue(formatDateForDisplay(d));
            } catch {
                setTextValue('');
            }
        }
    }, [value]);

    return (
        <>
            <View style={[{ position: 'relative' }, style]}>
                <TextInput
                    value={textValue}
                    onChangeText={setTextValue}
                    placeholder={placeholder || label}
                    keyboardType="numbers-and-punctuation"
                    onFocus={() => setShowPicker(true)}
                    onBlur={() => {
                        // Try to parse manual text input on blur
                        if (!textValue) {
                            onChange('');
                            return;
                        }
                        let d;
                        // Accept DD/MM/YYYY
                        if (/^\d{2}\/\d{2}\/\d{4}$/.test(textValue)) {
                            const [day, month, year] = textValue.split('/');
                            d = new Date(`${year}-${month}-${day}`);
                        } else if (/^\d{4}-\d{2}-\d{2}$/.test(textValue)) {
                            d = new Date(textValue);
                        }
                        if (d && !isNaN(d.getTime())) {
                            const out = formatForBackend ? formatDateForBackend(d) : formatDateForDisplay(d);
                            onChange(out);
                            setTextValue(formatDateForDisplay(d));
                        }
                    }}
                    style={{ color: textValue ? '#000' : '#999' }}
                />
                <TouchableOpacity
                    onPress={() => setShowPicker(true)}
                    style={{ position: 'absolute', right: 8, top: '50%', marginTop: -12 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="calendar" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            const out = formatForBackend ? formatDateForBackend(selectedDate) : formatDateForDisplay(selectedDate);
                            onChange(out);
                            setTextValue(formatDateForDisplay(selectedDate));
                        }
                    }}
                />
            )}
        </>
    );
};

export default DatePickerInput;