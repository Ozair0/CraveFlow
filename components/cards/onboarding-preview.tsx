import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

type OnboardingPreviewProps = {
  type: 'home' | 'favorites' | 'tracking';
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        width: 230,
        borderRadius: 34,
        backgroundColor: theme.dark ? '#0E0E12' : '#FFFFFF',
        borderWidth: 5,
        borderColor: theme.dark ? '#09090B' : '#141414',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 16,
      }}>
      <View
        style={{
          alignSelf: 'center',
          width: 72,
          height: 18,
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
          backgroundColor: theme.dark ? '#000000' : '#131313',
          marginTop: -12,
          marginBottom: 14,
        }}
      />
      {children}
    </View>
  );
}

function MiniFoodCard({
  width = 88,
  height = 96,
  title,
  accent,
}: {
  width?: number;
  height?: number;
  title: string;
  accent: string;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        width,
        height,
        borderRadius: 18,
        backgroundColor: theme.colors.cardMuted,
        overflow: 'hidden',
        padding: 8,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          height: height * 0.45,
          borderRadius: 12,
          backgroundColor: accent,
        }}
      />
      <AppText variant="caption" numberOfLines={2}>
        {title}
      </AppText>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          $12.00
        </AppText>
        <Ionicons name="add-circle" size={18} color={theme.colors.primary} />
      </View>
    </View>
  );
}

function HomePreview() {
  const theme = useAppTheme();

  return (
    <PhoneFrame>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}>
        <View>
          <AppText variant="caption" color={theme.colors.textSoft}>
            Location
          </AppText>
          <AppText variant="caption">New York, USA</AppText>
        </View>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.primaryMuted,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="notifications-outline" size={16} color={theme.colors.primary} />
        </View>
      </View>
      <View
        style={{
          minHeight: 40,
          borderRadius: 20,
          backgroundColor: theme.colors.surface,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          marginBottom: 12,
        }}>
        <Ionicons name="search-outline" size={16} color={theme.colors.textSoft} />
        <AppText variant="caption" color={theme.colors.textSoft} style={{ marginLeft: 8 }}>
          Search dish...
        </AppText>
      </View>
      <View
        style={{
          borderRadius: 24,
          backgroundColor: theme.colors.primary,
          padding: 14,
          marginBottom: 12,
        }}>
        <AppText variant="caption" color="#FFF2E8">
          Weekend Offers
        </AppText>
        <AppText variant="bodyLg" color="#FFFFFF" style={{ marginTop: 2 }}>
          Get up to 30% Off
        </AppText>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {['Burger', 'Pizza', 'Noodles'].map((item) => (
          <View
            key={item}
            style={{
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: item === 'Burger' ? theme.colors.primary : theme.colors.surface,
            }}>
            <AppText variant="caption" color={item === 'Burger' ? '#FFFFFF' : theme.colors.textMuted}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MiniFoodCard title="ItaliaCrisp Pizza" accent="#F6B26B" />
        <MiniFoodCard title="Veggie Pasta" accent="#93C47D" />
      </View>
    </PhoneFrame>
  );
}

function FavoritesPreview() {
  const theme = useAppTheme();

  return (
    <PhoneFrame>
      <AppText variant="bodyLg" align="center" style={{ marginBottom: 12 }}>
        My Favorites
      </AppText>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <View style={{ flex: 1, borderBottomWidth: 2, borderBottomColor: theme.colors.primary, paddingBottom: 8 }}>
          <AppText variant="caption" color={theme.colors.primary} align="center">
            Dishes
          </AppText>
        </View>
        <View style={{ flex: 1, paddingBottom: 8 }}>
          <AppText variant="caption" color={theme.colors.textSoft} align="center">
            Restaurant
          </AppText>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        <MiniFoodCard title="Italia Pizza" accent="#F6B26B" />
        <MiniFoodCard title="ItaliaCrisp Pizza" accent="#EA9999" />
        <MiniFoodCard title="Mexican Tacos" accent="#93C47D" />
        <MiniFoodCard title="Crispy Fries" accent="#FFD966" />
      </View>
    </PhoneFrame>
  );
}

function TrackingPreview() {
  const theme = useAppTheme();

  return (
    <PhoneFrame>
      <AppText variant="bodyLg" align="center" style={{ marginBottom: 14 }}>
        Track Live Location
      </AppText>
      <View
        style={{
          height: 220,
          borderRadius: 26,
          backgroundColor: theme.colors.surface,
          overflow: 'hidden',
        }}>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.4,
          }}>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <View
              key={`row-${rowIndex}`}
              style={{
                position: 'absolute',
                top: rowIndex * 38,
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: theme.colors.border,
              }}
            />
          ))}
          {Array.from({ length: 5 }).map((_, columnIndex) => (
            <View
              key={`col-${columnIndex}`}
              style={{
                position: 'absolute',
                left: columnIndex * 46,
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: theme.colors.border,
              }}
            />
          ))}
        </View>
        <View
          style={{
            position: 'absolute',
            top: 52,
            left: 52,
            width: 80,
            height: 3,
            backgroundColor: theme.colors.secondary,
            transform: [{ rotate: '22deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 110,
            left: 112,
            width: 42,
            height: 3,
            backgroundColor: theme.colors.secondary,
            transform: [{ rotate: '-30deg' }],
          }}
        />
        {[
          { top: 46, left: 42 },
          { top: 98, left: 108 },
          { top: 132, left: 146 },
        ].map((pin, index) => (
          <View
            key={index}
            style={{
              position: 'absolute',
              top: pin.top,
              left: pin.left,
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: '#FFF3ED',
              borderWidth: 2,
              borderColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.colors.primary,
              }}
            />
          </View>
        ))}
      </View>
      <View
        style={{
          marginTop: -26,
          marginHorizontal: 12,
          borderRadius: 24,
          backgroundColor: theme.colors.card,
          padding: 14,
          ...theme.shadow.soft,
        }}>
        <AppText variant="caption" color={theme.colors.textSoft}>
          Estimated Arrival Time
        </AppText>
        <AppText variant="bodyLg" style={{ marginTop: 4 }}>
          07:55 PM - 08:00 PM
        </AppText>
      </View>
    </PhoneFrame>
  );
}

export function OnboardingPreview({ type }: OnboardingPreviewProps) {
  const theme = useAppTheme();

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
      }}>
      <View
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          borderRadius: 125,
          backgroundColor: theme.colors.primaryMuted,
          top: 30,
        }}
      />
      {type === 'home' ? <HomePreview /> : null}
      {type === 'favorites' ? <FavoritesPreview /> : null}
      {type === 'tracking' ? <TrackingPreview /> : null}
    </View>
  );
}
