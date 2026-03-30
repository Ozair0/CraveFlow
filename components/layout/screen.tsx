import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/use-app-theme';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  keyboardAware?: boolean;
};

export function Screen({
  children,
  scroll = true,
  style,
  contentContainerStyle,
  keyboardAware = false,
}: ScreenProps) {
  const theme = useAppTheme();

  const content = scroll ? (
    <ScrollView
      bounces={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.xxl + 80,
        },
        contentContainerStyle,
      ]}>
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
        },
        contentContainerStyle,
      ]}>
      {children}
    </View>
  );

  const wrapped = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.flex}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.flex, { backgroundColor: theme.colors.background }, style]}>
      {wrapped}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 16,
  },
});
