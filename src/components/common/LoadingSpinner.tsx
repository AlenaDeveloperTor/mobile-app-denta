import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { styles } from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  color?: string;
  size?: 'small' | 'large';
  style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner = ({
  color = '#007AFF',
  size = 'large',
  style,
}: LoadingSpinnerProps) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};
