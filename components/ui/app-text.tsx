import { type TextProps, Text } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';
import { fontFamilies } from '@/theme/tokens';

type TextVariant = 'display' | 'heading' | 'title' | 'body' | 'bodyLg' | 'caption' | 'label';

type AppTextProps = TextProps & {
  variant?: TextVariant;
  color?: string;
  align?: 'auto' | 'left' | 'center' | 'right' | 'justify';
  weight?: keyof typeof fontFamilies;
};

const variantStyleMap: Record<TextVariant, { sizeKey: keyof ReturnType<typeof useAppTheme>['typography']; lineHeight: number; defaultWeight: keyof typeof fontFamilies }> = {
  display: { sizeKey: 'display', lineHeight: 42, defaultWeight: 'extrabold' },
  heading: { sizeKey: 'heading', lineHeight: 32, defaultWeight: 'bold' },
  title: { sizeKey: 'title', lineHeight: 28, defaultWeight: 'bold' },
  body: { sizeKey: 'body', lineHeight: 22, defaultWeight: 'regular' },
  bodyLg: { sizeKey: 'bodyLg', lineHeight: 24, defaultWeight: 'medium' },
  caption: { sizeKey: 'caption', lineHeight: 16, defaultWeight: 'medium' },
  label: { sizeKey: 'body', lineHeight: 20, defaultWeight: 'semibold' },
};

export function AppText({
  variant = 'body',
  color,
  style,
  weight,
  align,
  ...props
}: AppTextProps) {
  const theme = useAppTheme();
  const variantStyle = variantStyleMap[variant];

  return (
    <Text
      style={[
        {
          color: color ?? theme.colors.text,
          fontSize: theme.typography[variantStyle.sizeKey],
          lineHeight: variantStyle.lineHeight,
          fontFamily: fontFamilies[weight ?? variantStyle.defaultWeight],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    />
  );
}
