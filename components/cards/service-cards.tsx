import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Switch, View } from 'react-native';

import { formatCurrency, formatGuestLabel } from '@/lib/format';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { Booking, Coupon, NotificationItem, Order } from '@/types/app';

import { AppText } from '../ui/app-text';
import { PrimaryButton } from '../ui/primary-button';

export function OrderCard({
  order,
  onPrimaryPress,
  onSecondaryPress,
  primaryLabel,
  secondaryLabel,
}: {
  order: Order;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}) {
  const theme = useAppTheme();
  const leadItem = order.items[0];

  return (
    <View
      style={{
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.card,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
        ...theme.shadow.soft,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Order ID : {order.id}
        </AppText>
        <View
          style={{
            backgroundColor: theme.colors.primaryMuted,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}>
          <AppText variant="caption" color={theme.colors.primary}>
            {order.activeBadgeLabel}
          </AppText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <Image
          source={leadItem?.image}
          style={{ width: 96, height: 86, borderRadius: 18 }}
          contentFit="cover"
        />
        <View style={{ flex: 1, gap: 6 }}>
          <AppText variant="label">{leadItem?.name}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {order.restaurantName}
          </AppText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color={theme.colors.warning} />
            <AppText variant="caption">{formatCurrency(leadItem?.unitPrice ?? 0)}</AppText>
            <AppText variant="caption" color={theme.colors.textSoft}>
              • Qty: {leadItem?.quantity ?? 0}
            </AppText>
          </View>
          <AppText variant="label">{formatCurrency(order.total)}</AppText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        {secondaryLabel && onSecondaryPress ? (
          <PrimaryButton label={secondaryLabel} variant="outline" onPress={onSecondaryPress} style={{ flex: 1 }} />
        ) : null}
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

export function CouponCard({
  coupon,
  onApply,
}: {
  coupon: Coupon;
  onApply: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onApply}
      style={{
        flexDirection: 'row',
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.card,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <View
        style={{
          width: 56,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: coupon.accent,
        }}>
        <AppText
          variant="caption"
          color="#FFFFFF"
          style={{ transform: [{ rotate: '-90deg' }], width: 100, textAlign: 'center' }}>
          {coupon.code}
        </AppText>
      </View>
      <View style={{ flex: 1, padding: theme.spacing.md, gap: 6 }}>
        <AppText variant="label">{coupon.code}</AppText>
        <AppText variant="body">{coupon.title}</AppText>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {coupon.progressText}
        </AppText>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="caption" color={theme.colors.textSoft}>
            {coupon.expiryText}
          </AppText>
          <AppText variant="label" color={theme.colors.primary}>
            Apply
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

export function BookingCard({
  booking,
  onPrimaryPress,
  primaryLabel,
  onSecondaryPress,
  secondaryLabel,
  onToggleReminder,
}: {
  booking: Booking;
  primaryLabel: string;
  onPrimaryPress: () => void;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  onToggleReminder?: () => void;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        borderRadius: theme.radii.lg,
        backgroundColor: theme.colors.card,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="caption" color={theme.colors.primary}>
          {booking.status === 'upcoming' ? 'Upcoming Booking' : booking.status === 'completed' ? 'Completed Booking' : 'Cancelled Booking'}
        </AppText>
        {booking.status === 'upcoming' && onToggleReminder ? (
          <Switch value={booking.reminderEnabled} onValueChange={onToggleReminder} />
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        <Image source={booking.image} style={{ width: 88, height: 88, borderRadius: 18 }} />
        <View style={{ flex: 1, gap: 6 }}>
          <AppText variant="label">{booking.restaurantName}</AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {booking.address}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {booking.distanceLabel}
          </AppText>
          <AppText variant="caption" color={theme.colors.textMuted}>
            {formatGuestLabel(booking.guests)}
          </AppText>
          <AppText variant="label">{booking.bookingDateLabel}</AppText>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        {secondaryLabel && onSecondaryPress ? (
          <PrimaryButton label={secondaryLabel} variant="outline" onPress={onSecondaryPress} style={{ flex: 1 }} />
        ) : null}
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

export function NotificationRow({
  notification,
  onPress,
}: {
  notification: NotificationItem;
  onPress: () => void;
}) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: notification.isNew ? theme.colors.primaryMuted : theme.colors.surface,
        }}>
        <Ionicons
          name={notification.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={notification.isNew ? theme.colors.primary : theme.colors.textMuted}
        />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
          <AppText variant="label" style={{ flex: 1 }}>
            {notification.title}
          </AppText>
          <AppText variant="caption" color={theme.colors.textSoft}>
            {notification.timeLabel}
          </AppText>
        </View>
        <AppText variant="caption" color={theme.colors.textMuted}>
          {notification.body}
        </AppText>
      </View>
    </Pressable>
  );
}
