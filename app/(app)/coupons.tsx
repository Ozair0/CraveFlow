import { router } from 'expo-router';
import { View } from 'react-native';

import { CouponCard } from '@/components/cards/service-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { getCouponOptions } from '@/lib/selectors';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

export default function CouponsScreen() {
  const theme = useAppTheme();
  const { applyCoupon } = useAppState();
  const couponOptions = getCouponOptions();

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Coupon"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View style={{ gap: 6 }}>
        <AppText variant="title">Best offers for you</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Save these codes for your next order and tap any coupon to apply it instantly.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        {couponOptions.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onApply={() => {
              applyCoupon(coupon.code);
              router.push('/(app)/(tabs)/cart');
            }}
          />
        ))}
      </View>
    </Screen>
  );
}
