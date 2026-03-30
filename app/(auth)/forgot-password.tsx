import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { AppTextField } from '@/components/forms/app-text-field';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { AppText } from '@/components/ui/app-text';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';

const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const theme = useAppTheme();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: 'julia@craveflow.app',
    },
  });

  const onSubmit = handleSubmit(async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSubmitting(false);
    setSent(true);
  });

  return (
    <Screen keyboardAware contentContainerStyle={{ gap: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
      <PageHeader
        title=""
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      {!sent ? (
        <>
          <View style={{ gap: 8 }}>
            <AppText variant="display">Forgot Password</AppText>
            <AppText variant="body" color={theme.colors.textMuted}>
              Enter your email and we&apos;ll send a reset link to get you back in quickly.
            </AppText>
          </View>

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

          <PrimaryButton label="Send Reset Link" onPress={onSubmit} loading={isSubmitting} />
        </>
      ) : (
        <View
          style={{
            borderRadius: theme.radii.xl,
            backgroundColor: theme.colors.card,
            padding: theme.spacing.xl,
            gap: theme.spacing.md,
            marginTop: theme.spacing.xl,
            ...theme.shadow.card,
          }}>
          <AppText variant="heading">Check your inbox</AppText>
          <AppText variant="body" color={theme.colors.textMuted}>
            We sent a secure reset link. Return to sign in once you&apos;ve updated your password.
          </AppText>
          <PrimaryButton label="Back to Sign In" onPress={() => router.replace('/(auth)/sign-in')} />
        </View>
      )}
    </Screen>
  );
}
