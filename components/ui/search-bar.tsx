import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type SearchBarProps = {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
  onFilterPress?: () => void;
};

export function SearchBar({
  value,
  placeholder = 'Search dishes, restaurants...',
  onChangeText,
  onFilterPress,
}: SearchBarProps) {
  const theme = useAppTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.sm, alignItems: 'center' }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.sm,
          borderRadius: theme.radii.pill,
          backgroundColor: theme.colors.card,
          paddingHorizontal: theme.spacing.md,
          minHeight: 54,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textSoft} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSoft}
          style={{
            flex: 1,
            fontSize: theme.typography.body,
            color: theme.colors.text,
            fontFamily: 'Urbanist_500Medium',
          }}
        />
      </View>
      {onFilterPress ? (
        <Pressable
          onPress={onFilterPress}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
          }}>
          <Ionicons name="options-outline" size={22} color="#FFFFFF" />
        </Pressable>
      ) : null}
    </View>
  );
}
