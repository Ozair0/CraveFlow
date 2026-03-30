import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type SegmentOption = {
  label: string;
  value: string;
};

type SegmentedControlProps = {
  value: string;
  options: SegmentOption[];
  onChange: (value: string) => void;
};

export function SegmentedControl({ value, options, onChange }: SegmentedControlProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={{
              paddingBottom: theme.spacing.sm,
              marginRight: theme.spacing.xl,
              borderBottomWidth: 2,
              borderBottomColor: active ? theme.colors.primary : 'transparent',
            }}>
            <AppText variant="caption" color={active ? theme.colors.primary : theme.colors.textSoft}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
