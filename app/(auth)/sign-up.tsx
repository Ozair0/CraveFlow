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

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Enter your full name.'),
    email: z.string().email('Enter a valid email address.'),
    phone: z.string().min(10, 'Enter a valid phone number.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const theme = useAppTheme();
  const { signUp } = useAppState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: 'Julia Morris',
      email: 'julia@craveflow.app',
      phone: '+1 (212) 555-0182',
      password: 'delivery123',
      confirmPassword: 'delivery123',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    await signUp({
      name: values.name,
      email: values.email,
      phone: values.phone,
    });
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
        <AppText variant="display">Create Account</AppText>
        <AppText variant="body" color={theme.colors.textMuted}>
          Set up your account to save favorites, track orders, and book tables.
        </AppText>
      </View>

      <View style={{ gap: theme.spacing.md }}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Full Name"
              placeholder="Enter your name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              autoCapitalize="words"
              icon="person-outline"
            />
          )}
        />
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
          name="phone"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Phone Number"
              placeholder="Enter your phone number"
              value={value}
              onChangeText={onChange}
              error={errors.phone?.message}
              keyboardType="phone-pad"
              icon="call-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Password"
              placeholder="Create a password"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              secureTextEntry
              icon="lock-closed-outline"
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <AppTextField
              label="Confirm Password"
              placeholder="Confirm your password"
              value={value}
              onChangeText={onChange}
              error={errors.confirmPassword?.message}
              secureTextEntry
              icon="checkmark-circle-outline"
            />
          )}
        />
      </View>

      <PrimaryButton
        label="Create Account"
        onPress={onSubmit}
        loading={isSubmitting}
        icon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        <AppText variant="body" color={theme.colors.textMuted}>
          Already have an account?
        </AppText>
        <Pressable onPress={() => router.replace('/(auth)/sign-in')}>
          <AppText variant="label" color={theme.colors.primary}>
            Sign In
          </AppText>
        </Pressable>
      </View>
    </Screen>
  );
}
