import { View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  centered?: boolean;
};

export function PageHeader({
  title,
  subtitle,
  left,
  right,
  centered,
}: PageHeaderProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.lg,
        minHeight: 44,
      }}>
      <View style={{ width: 44, alignItems: 'flex-start' }}>{left}</View>
      <View style={{ flex: 1, alignItems: centered ? 'center' : 'flex-start' }}>
        <AppText variant="title" align={centered ? 'center' : 'left'}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="caption" color={theme.colors.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <View style={{ width: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}
