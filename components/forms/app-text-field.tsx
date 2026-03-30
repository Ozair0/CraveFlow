import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

import { AppText } from '../ui/app-text';

type AppTextFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function AppTextField({
  label,
  value,
  placeholder,
  onChangeText,
  error,
  keyboardType,
  autoCapitalize = 'none',
  secureTextEntry,
  icon = 'ellipse-outline',
}: AppTextFieldProps) {
  const theme = useAppTheme();
  const [showSecureValue, setShowSecureValue] = useState(false);

  return (
    <View style={{ gap: 8 }}>
      <AppText variant="caption" color={theme.colors.textMuted}>
        {label}
      </AppText>
      <View
        style={{
          minHeight: 58,
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: error ? theme.colors.danger : theme.colors.border,
          backgroundColor: theme.colors.card,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.md,
          gap: theme.spacing.sm,
        }}>
        <Ionicons name={icon} size={18} color={theme.colors.textSoft} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSoft}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secureTextEntry && !showSecureValue}
          style={{
            flex: 1,
            fontSize: theme.typography.body,
            color: theme.colors.text,
            fontFamily: 'Urbanist_500Medium',
          }}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setShowSecureValue((current) => !current)}>
            <Ionicons
              name={showSecureValue ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.colors.textSoft}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <AppText variant="caption" color={theme.colors.danger}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
