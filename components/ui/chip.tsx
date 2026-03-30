import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type ChipProps = PressableProps & {
  label: string;
  selected?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
};

export function Chip({ label, selected, icon, color, style, ...props }: ChipProps) {
  const theme = useAppTheme();
  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === 'function' ? style(state) : style;

  return (
    <Pressable
      style={(state) => [
        {
          alignSelf: 'flex-start',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.radii.pill,
          backgroundColor: selected ? theme.colors.primary : theme.colors.card,
          borderWidth: 1,
          borderColor: selected ? theme.colors.primary : theme.colors.border,
          opacity: state.pressed ? 0.88 : 1,
        },
        resolveStyle(state),
      ]}
      {...props}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon ? (
          <Ionicons
            name={icon}
            size={16}
            color={selected ? '#FFFFFF' : color ?? theme.colors.textMuted}
          />
        ) : null}
        <AppText variant="caption" color={selected ? '#FFFFFF' : theme.colors.text}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}
