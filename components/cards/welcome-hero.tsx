import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

export function WelcomeHero() {
  const theme = useAppTheme();

  return (
    <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
      <View
        style={{
          position: 'absolute',
          top: -18,
          width: 210,
          height: 210,
          borderRadius: 105,
          backgroundColor: theme.colors.primaryMuted,
        }}
      />
      <View
        style={{
          width: '100%',
          borderRadius: 34,
          overflow: 'hidden',
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          alignItems: 'center',
          ...theme.shadow.card,
        }}>
        <View
          style={{
            alignSelf: 'stretch',
            minHeight: 300,
            borderRadius: 28,
            backgroundColor: theme.dark ? '#1A1A20' : '#FFF6F0',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <Image
            source="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              backgroundColor: 'rgba(17,17,17,0.82)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}>
            <AppText variant="caption" color="#FFFFFF">
              #Fresh
            </AppText>
          </View>
          <View
            style={{
              position: 'absolute',
              top: 64,
              right: 18,
              backgroundColor: theme.colors.primary,
              width: 36,
              height: 36,
              borderRadius: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="sparkles" size={16} color="#FFFFFF" />
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 90,
              left: 16,
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}>
            <AppText variant="caption" color="#FFFFFF">
              #Delicious
            </AppText>
          </View>
          <View style={{ position: 'absolute', bottom: 18, flexDirection: 'row', gap: 10 }}>
            {[
              'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1565299585323-38174c4a6471?auto=format&fit=crop&w=500&q=80',
              'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80',
            ].map((uri) => (
              <Image
                key={uri}
                source={uri}
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: theme.colors.card,
                }}
                contentFit="cover"
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
