import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import type { UserProfile } from '@/types/app';

import { AppText } from '../ui/app-text';

export function ProfileHeader({ user }: { user: UserProfile }) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        borderRadius: theme.radii.xl,
        backgroundColor: theme.colors.card,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        ...theme.shadow.card,
      }}>
      <Image
        source={user.avatar}
        style={{ width: 72, height: 72, borderRadius: 36 }}
        contentFit="cover"
      />
      <View style={{ flex: 1 }}>
        <AppText variant="title">{user.name}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {user.email}
        </AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {user.locationLabel}
        </AppText>
      </View>
    </View>
  );
}

export function MenuRow({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.card,
        borderRadius: theme.radii.lg,
        padding: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.primaryMuted,
        }}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label">{title}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={theme.colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSoft} />
    </Pressable>
  );
}
