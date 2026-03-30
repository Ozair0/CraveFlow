import { Redirect, Stack } from 'expo-router';

import { BootScreen } from '@/components/states/boot-screen';
import { useAppState } from '@/providers/app-provider';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function AppLayout() {
  const { appState, isReady } = useAppState();

  if (!isReady || !appState) {
    return <BootScreen />;
  }

  if (!appState.session.isAuthenticated) {
    return (
      <Redirect href={appState.session.hasSeenOnboarding ? '/(auth)/welcome' : '/(auth)/onboarding'} />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" />
      <Stack.Screen name="restaurant/[id]" />
      <Stack.Screen name="track-order/[id]" />
      <Stack.Screen name="reserve/[restaurantId]" />
      <Stack.Screen name="coupons" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="bookings" />
      <Stack.Screen name="search" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="profile-edit" />
      <Stack.Screen name="addresses" />
      <Stack.Screen name="payment-methods" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="help" />
      <Stack.Screen name="legal" />
      <Stack.Screen name="about" />
    </Stack>
  );
}
