import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { OrderCard } from '@/components/cards/service-cards';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { EmptyState } from '@/components/states/empty-state';
import { IconButton } from '@/components/ui/icon-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getOrderGroups } from '@/lib/selectors';
import { useAppState } from '@/providers/app-provider';

export default function OrdersScreen() {
  const theme = useAppTheme();
  const { appState, cancelOrder, reorder } = useAppState();
  const [status, setStatus] = useState<'active' | 'completed' | 'cancelled'>('active');

  if (!appState) {
    return null;
  }

  const orders = getOrderGroups(appState, status);

  return (
    <Screen contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="My Orders"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <SegmentedControl
        value={status}
        onChange={(value) => setStatus(value as typeof status)}
        options={[
          { label: 'Active', value: 'active' },
          { label: 'Completed', value: 'completed' },
          { label: 'Cancelled', value: 'cancelled' },
        ]}
      />

      {orders.length === 0 ? (
        <EmptyState
          icon="receipt-outline"
          title={`No ${status} orders`}
          description="Your order history will appear here once you start placing meals."
          actionLabel="Browse Dishes"
          onActionPress={() => router.replace('/(app)/(tabs)/explore')}
        />
      ) : (
        <View style={{ gap: theme.spacing.md }}>
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              primaryLabel={
                status === 'active' ? 'Track Order' : status === 'completed' ? 'Reorder' : 'Reorder'
              }
              secondaryLabel={status === 'active' ? 'Cancel' : undefined}
              onPrimaryPress={() => {
                if (status === 'active') {
                  router.push({ pathname: '/(app)/track-order/[id]', params: { id: order.id } });
                  return;
                }

                reorder(order.id);
                router.push('/(app)/(tabs)/cart');
              }}
              onSecondaryPress={status === 'active' ? () => cancelOrder(order.id) : undefined}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}
