import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicalForm from './src/components/medicalform/MedicalForm';
import Dashboard from './src/components/dashboard/Dashboard';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Dashboard">
                <Stack.Screen 
                    name="Dashboard" 
                    component={Dashboard}
                    options={{ headerShown: false }}
                />
                <Stack.Screen 
                    name="MedicalForm" 
                    component={MedicalForm}
                    options={{ 
                        title: 'Nouveau Formulaire',
                        headerStyle: {
                            backgroundColor: '#007AFF',
                        },
                        headerTintColor: '#fff',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}