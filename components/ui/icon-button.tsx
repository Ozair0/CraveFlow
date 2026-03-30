import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type IconButtonProps = PressableProps & {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  filled?: boolean;
  elevated?: boolean;
};

export function IconButton({
  name,
  size = 20,
  color,
  filled = true,
  elevated,
  style,
  ...props
}: IconButtonProps) {
  const theme = useAppTheme();
  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === 'function' ? style(state) : style;
  const shouldElevate = elevated ?? filled;

  return (
    <Pressable
      hitSlop={10}
      style={(state) => [
        {
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: filled ? theme.colors.card : 'transparent',
          borderWidth: filled ? 0 : 1,
          borderColor: theme.colors.border,
          opacity: state.pressed ? 0.8 : 1,
        },
        shouldElevate ? theme.shadow.soft : null,
        resolveStyle(state),
      ]}
      {...props}>
      <Ionicons name={name} size={size} color={color ?? theme.colors.text} />
    </Pressable>
  );
}
