import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';

import { useAppTheme } from '@/hooks/use-app-theme';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSoft,
        tabBarLabelStyle: {
          fontFamily: 'Urbanist_500Medium',
          fontSize: theme.typography.caption,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 12,
          height: 72,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={theme.dark ? 50 : 85}
            tint={theme.dark ? 'dark' : 'light'}
            style={{
              flex: 1,
              borderRadius: theme.radii.lg,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.dark ? 'rgba(24,24,28,0.92)' : 'rgba(255,255,255,0.92)',
            }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => <Ionicons name="compass-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => <Ionicons name="bag-handle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
