import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type QuantityStepperProps = {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export function QuantityStepper({ value, onDecrease, onIncrease }: QuantityStepperProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.pill,
        padding: 6,
        gap: 10,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <Pressable
        onPress={onDecrease}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.surface,
        }}>
        <Ionicons name="remove" size={18} color={theme.colors.text} />
      </Pressable>
      <AppText variant="label">{String(value).padStart(2, '0')}</AppText>
      <Pressable
        onPress={onIncrease}
        style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primary,
        }}>
        <Ionicons name="add" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}
