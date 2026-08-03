import { ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { styles } from './Card.styles';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.card, style]}>{children}</View>;
};
