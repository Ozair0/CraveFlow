import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { WelcomeHero } from '@/components/cards/welcome-hero';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';

function HighlightedHeadline() {
  const theme = useAppTheme();

  return (
    <AppText variant="heading" align="center">
      Discover{' '}
      <AppText variant="heading" color={theme.colors.primary}>
        Delicious Food
      </AppText>
      {'\n'}
      Delivered to Your Door
    </AppText>
  );
}

export default function WelcomeScreen() {
  const theme = useAppTheme();

  return (
    <Screen scroll contentContainerStyle={{ paddingBottom: theme.spacing.xxl, justifyContent: 'space-between' }}>
      <View>
        <WelcomeHero />
        <HighlightedHeadline />
        <AppText
          variant="body"
          color={theme.colors.textMuted}
          align="center"
          style={{ marginTop: theme.spacing.md, paddingHorizontal: theme.spacing.md }}>
          Explore a variety of delicious foods, pick your favorite dishes, and enjoy fast delivery.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.lg, marginTop: theme.spacing.xxl }}>
        <PrimaryButton label="Let's Get Started" onPress={() => router.push('/(auth)/sign-up')} />
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
          <AppText variant="body" color={theme.colors.textMuted}>
            Already have an account?
          </AppText>
          <Pressable onPress={() => router.push('/(auth)/sign-in')}>
            <AppText variant="label" color={theme.colors.primary}>
              Sign In
            </AppText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
