import { type DimensionValue, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

export function LoadingBlock({
  height = 120,
  width = '100%',
}: {
  height?: number;
  width?: DimensionValue;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        height,
        width,
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.skeleton,
      }}
    />
  );
}
