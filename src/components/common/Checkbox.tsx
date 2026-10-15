import React from 'react';
import {
  Pressable,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './Checkbox.styles';

export interface CheckboxProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: React.ReactNode;
  errorMessage?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  errorMessage,
  disabled = false,
  style,
  testID,
}) => {
  const handlePress = () => {
    if (!disabled) {
      onToggle(!checked);
    }
  };

  const isError = Boolean(errorMessage);

  return (
    <View style={style}>
      <View style={styles.container}>
        <Pressable
          testID={testID}
          onPress={handlePress}
          disabled={disabled}
          hitSlop={8}
          style={[
            styles.box,
            checked && styles.boxChecked,
            isError && !checked && styles.boxError,
            disabled && styles.boxDisabled,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked, disabled }}
        >
          {checked && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
        </Pressable>

        {label ? (
          <View style={styles.labelContainer}>
            {typeof label === 'string' ? (
              <Text style={styles.labelText} onPress={handlePress}>
                {label}
              </Text>
            ) : (
              label
            )}
          </View>
        ) : null}
      </View>

      {errorMessage && !checked ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
};
