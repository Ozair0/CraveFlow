import { router } from 'expo-router';
import { View } from 'react-native';

import { NotificationRow } from '@/components/cards/service-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { groupNotifications } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function NotificationsScreen() {
  const theme = useAppTheme();
  const { appState, markAllNotificationsRead, markNotificationRead } = useAppState();

  if (!appState) {
    return null;
  }

  const grouped = groupNotifications(appState.notifications);
  const unreadCount = appState.notifications.filter((notification) => notification.isNew).length;

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Notification"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
        right={
          unreadCount > 0 ? (
            <View
              style={{
                minWidth: 44,
                borderRadius: 999,
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
              }}>
              <AppText variant="caption" color="#FFFFFF">
                {`${unreadCount} NEW`}
              </AppText>
            </View>
          ) : null
        }
      />

      {appState.notifications.length === 0 ? (
        <EmptyState
          icon="notifications-outline"
          title="No notifications yet"
          description="You’ll see delivery updates, booking confirmations, and coupon alerts here."
        />
      ) : (
        <View style={{ gap: theme.spacing.xl }}>
          <View style={{ alignItems: 'flex-end' }}>
            <AppText variant="label" color={theme.colors.primary} onPress={markAllNotificationsRead}>
              Mark all as read
            </AppText>
          </View>

          {(['today', 'yesterday', 'earlier'] as const).map((groupKey) =>
            grouped[groupKey].length > 0 ? (
              <View key={groupKey} style={{ gap: 4 }}>
                <AppText variant="caption" color={theme.colors.textSoft}>
                  {groupKey === 'today' ? 'TODAY' : groupKey === 'yesterday' ? 'YESTERDAY' : 'EARLIER'}
                </AppText>
                {grouped[groupKey].map((notification) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onPress={() => markNotificationRead(notification.id)}
                  />
                ))}
              </View>
            ) : null
          )}
        </View>
      )}
    </Screen>
  );
}
