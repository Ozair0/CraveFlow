import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';
import { PrimaryButton } from '../ui/primary-button';

type EmptyStateProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        alignItems: 'center',
        padding: theme.spacing.xl,
        marginTop: theme.spacing.xxl,
      }}>
      <View
        style={{
          width: 74,
          height: 74,
          borderRadius: 37,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primaryMuted,
          marginBottom: theme.spacing.md,
        }}>
        <Ionicons name={icon} size={28} color={theme.colors.primary} />
      </View>
      <AppText variant="title" align="center">
        {title}
      </AppText>
      <AppText
        variant="body"
        color={theme.colors.textMuted}
        align="center"
        style={{ marginTop: theme.spacing.sm }}>
        {description}
      </AppText>
      {actionLabel && onActionPress ? (
        <PrimaryButton
          label={actionLabel}
          onPress={onActionPress}
          fullWidth={false}
          style={{ marginTop: theme.spacing.lg }}
        />
      ) : null}
    </View>
  );
}
