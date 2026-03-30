import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  View,
} from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from './app-text';

type ButtonVariant = 'solid' | 'outline' | 'ghost';

type PrimaryButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  variant = 'solid',
  icon,
  loading,
  style,
  disabled,
  fullWidth = true,
  ...props
}: PrimaryButtonProps) {
  const theme = useAppTheme();
  const isSolid = variant === 'solid';
  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === 'function' ? style(state) : style;

  return (
    <Pressable
      disabled={disabled || loading}
      style={(state) => [
        {
          minHeight: 56,
          borderRadius: theme.radii.pill,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: theme.spacing.sm,
          paddingHorizontal: theme.spacing.xl,
          backgroundColor: isSolid
            ? theme.colors.primary
            : variant === 'outline'
              ? 'transparent'
              : theme.colors.primaryMuted,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: variant === 'outline' ? theme.colors.borderStrong : 'transparent',
          opacity: disabled ? 0.5 : state.pressed ? 0.88 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        resolveStyle(state),
      ]}
      {...props}>
      {loading ? (
        <ActivityIndicator color={isSolid ? '#FFFFFF' : theme.colors.primary} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            minWidth: 0,
            flexShrink: 1,
          }}>
          {icon}
          <AppText
            variant="label"
            color={isSolid ? '#FFFFFF' : variant === 'ghost' ? theme.colors.text : theme.colors.text}
            numberOfLines={1}
            style={{ flexShrink: 1 }}
          >
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}
