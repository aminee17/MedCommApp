import React from 'react';
import { StatusBar } from 'react-native';
import { COLORS } from '../utils/theme';

// ThemeProvider wraps the entire app to provide consistent theming
const ThemeProvider = ({ children }) => {
  return (
    <>
      <StatusBar 
        backgroundColor={COLORS.primary} 
        barStyle="light-content" 
      />
      {children}
    </>
  );
};

export default ThemeProvider;