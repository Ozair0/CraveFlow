import { Pressable, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

export function SectionHeader({
  title,
  actionLabel,
  onActionPress,
}: {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <AppText variant="title">{title}</AppText>
      {actionLabel && onActionPress ? (
        <Pressable onPress={onActionPress}>
          <AppText variant="label" color={theme.colors.primary}>
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
