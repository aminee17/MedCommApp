import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerInput = ({ label, value, onChange, style, placeholder }) => {
    const [showPicker, setShowPicker] = useState(false);

    function parseDateString(dateString) {
        if (!dateString) return new Date();
        const [day, month, year] = dateString.split('/');
        if (!day || !month || !year) return new Date();
        return new Date(`${year}-${month}-${day}`);
    }


    const dateValue = parseDateString(value);

    return (
        <>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={style}>
                <Text style={{ color: value ? '#000' : '#999' }}>
                    {value || placeholder || label}
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
                            const formattedDate = selectedDate.toLocaleDateString('fr-FR');
                            onChange(formattedDate);
                        }
                    }}
                />
            )}
        </>
    );
};

export default DatePickerInput;
