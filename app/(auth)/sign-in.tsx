import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { startTransition, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, View } from 'react-native';
import { z } from 'zod';

import { AppTextField } from '@/components/forms/app-text-field';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

const signInSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInScreen() {
  const theme = useAppTheme();
  const { signIn } = useAppState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: 'julia@craveflow.app',
      password: 'delivery123',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    await signIn({ email: values.email });
    setIsSubmitting(false);
    startTransition(() => router.replace('/(app)/(tabs)'));
  });

  return (
    <Screen keyboardAware contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
      <PageHeader
        title=""
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <View style={{ gap: 8 }}>
        <AppText variant="display">Welcome Back</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Sign in to continue ordering your favorite meals.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Email Address"
              placeholder="Enter your email"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              keyboardType="email-address"
              icon="mail-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Password"
              placeholder="Enter your password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
              icon="lock-closed-outline"
            />
          )}
        />
      </View>

      <Pressable onPress={() => router.push('/(auth)/forgot-password')} style={{ alignSelf: 'flex-end' }}>
        <AppText variant="label" color={theme.colors.primary}>
          Forgot Password?
        </AppText>
      </Pressable>

      <PrimaryButton
        label="Sign In"
        onPress={onSubmit}
        loading={isSubmitting}
        icon={<Ionicons name="log-in-outline" size={18} color="#FFFFFF" />}
      />

      <View
        style={{
          borderRadius: theme.radii.lg,
          backgroundColor: theme.colors.primaryMuted,
          padding: theme.spacing.md,
        }}>
        <AppText variant="caption" color={theme.colors.textMuted}>
          Demo-ready flow: any valid email and password with 6+ characters will work.
        </AppText>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        <AppText variant="body" color={theme.colors.textMuted}>
          New here?
        </AppText>
        <Pressable onPress={() => router.replace('/(auth)/sign-up')}>
          <AppText variant="label" color={theme.colors.primary}>
            Create an account
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
