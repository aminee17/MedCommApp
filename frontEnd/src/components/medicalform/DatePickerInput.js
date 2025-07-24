import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerInput = ({ label, value, onChange, style, placeholder, formatForBackend = false }) => {
    const [showPicker, setShowPicker] = useState(false);

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

    const dateValue = parseDateString(value);

    return (
        <>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={style}>
                <Text style={{ color: value ? '#000' : '#999' }}>
                    {value ? formatDateForDisplay(parseDateString(value)) : placeholder || label}
                </Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={dateValue}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                            // Format date in ISO format for backend (YYYY-MM-DD)
                            const formattedDate = formatForBackend ? 
                                formatDateForBackend(selectedDate) : 
                                formatDateForDisplay(selectedDate);
                            onChange(formattedDate);
                        }
                    }}
                />
            )}
        </>
    );
};

export default DatePickerInput;