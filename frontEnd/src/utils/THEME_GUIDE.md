# Theme Guide for Medical Mobile App

This guide explains how to use the theme system to maintain a consistent, appealing, and sophisticated look across the entire application.

## Theme Constants

All theme constants are defined in `src/utils/theme.js`:

- `COLORS`: Color palette for the entire app
- `FONTS`: Font styles
- `SIZES`: Font and element sizes
- `SHADOWS`: Shadow styles for elevation
- `SPACING`: Consistent spacing values
- `BUTTON_STYLES`: Pre-defined button styles

## Common Components

We've created reusable components that automatically use the theme:

### Button

```jsx
import { Button } from '../components/common';

// Usage
<Button 
  type="primary" // or "secondary", "danger", "outline"
  title="Submit" 
  onPress={handleSubmit}
  loading={isLoading}
  disabled={!isValid}
/>
```

### Card

```jsx
import { Card } from '../components/common';

// Usage
<Card title="Patient Information">
  <Text>Content goes here</Text>
</Card>
```

### Header

```jsx
import { Header } from '../components/common';

// Usage
<Header 
  title="Patient Details"
  showBack={true}
  rightComponent={<Button title="Edit" type="outline" />}
/>
```

### Input

```jsx
import { Input } from '../components/common';

// Usage
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  keyboardType="email-address"
  error={emailError}
/>
```

## Styling Guidelines

1. **Always use theme constants** for colors, spacing, and shadows
2. **Use common components** whenever possible
3. **For custom styles**, import theme constants:

```jsx
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../utils/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey,
    padding: SPACING.m,
    ...SHADOWS.small,
  }
});
```

## Screen Structure

For consistent screen layout:

1. Use `Header` component for screen headers
2. Use `Card` components to group related content
3. Place action buttons at the bottom of the screen
4. Use consistent spacing between elements

## Adding New Screens

When adding new screens:

1. Import theme constants and common components
2. Follow the styling guidelines
3. Add the screen to AppNavigator.js with appropriate options

## Customizing the Theme

To modify the theme:

1. Edit `src/utils/theme.js` to change colors, sizes, etc.
2. All components using the theme will automatically update