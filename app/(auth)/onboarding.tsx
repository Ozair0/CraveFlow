import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingPreview } from '@/components/cards/onboarding-preview';
import { AppText } from '@/components/ui/app-text';
import { useAppTheme } from '@/hooks/use-app-theme';
import { onboardingSlides } from '@/data/mock-data';
import { useAppState } from '@/providers/app-provider';

function HighlightedTitle({ title, accent }: { title: string; accent: string }) {
  const theme = useAppTheme();
  const parts = useMemo(() => title.split(accent), [accent, title]);

  if (parts.length < 2) {
    return (
      <AppText variant="heading" align="center">
        {title}
      </AppText>
    );
  }

  return (
    <AppText variant="heading" align="center">
      {parts[0]}
      <AppText variant="heading" color={theme.colors.primary}>
        {accent}
      </AppText>
      {parts[1]}
    </AppText>
  );
}

export default function OnboardingScreen() {
  const theme = useAppTheme();
  const { width } = useWindowDimensions();
  const { completeOnboarding } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const listRef = useRef<FlatList<(typeof onboardingSlides)[number]>>(null);

  const goToSlide = (nextIndex: number) => {
    listRef.current?.scrollToOffset({
      offset: nextIndex * width,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace('/(auth)/welcome');
  };

  const handleNext = async () => {
    if (currentIndex === onboardingSlides.length - 1) {
      await handleComplete();
      return;
    }

    goToSlide(currentIndex + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, paddingTop: 8 }}>
        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{ width: 40 }} />
          <Pressable onPress={handleComplete}>
            <AppText variant="label" color={theme.colors.textSoft}>
              Skip
            </AppText>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(nextIndex);
          }}
          renderItem={({ item }) => (
            <View
              style={{
                width,
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                flex: 1,
              }}>
              <OnboardingPreview type={item.preview} />
              <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.md }}>
                <HighlightedTitle title={item.title} accent={item.accent} />
                <AppText
                  variant="body"
                  color={theme.colors.textMuted}
                  align="center"
                  style={{ paddingHorizontal: theme.spacing.md }}>
                  {item.description}
                </AppText>
              </View>
            </View>
          )}
        />

        <View
          style={{
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {currentIndex > 0 ? (
            <Pressable
              onPress={() => goToSlide(currentIndex - 1)}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 1,
                borderColor: theme.colors.borderStrong,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.card,
              }}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 52, height: 52 }} />
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {onboardingSlides.map((slide, index) => (
              <View
                key={slide.id}
                style={{
                  width: index === currentIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 999,
                  backgroundColor:
                    index === currentIndex ? theme.colors.primary : theme.colors.borderStrong,
                }}
              />
            ))}
          </View>

          <Pressable
            onPress={handleNext}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.primary,
            }}>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
