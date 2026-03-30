import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppTextField } from '@/components/forms/app-text-field';
import { PageHeader } from '@/components/layout/page-header';
import { Screen } from '@/components/layout/screen';
import { IconButton } from '@/components/ui/icon-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { useAppTheme } from '@/hooks/use-app-theme';
import { useAppState } from '@/providers/app-provider';

const profileSchema = z.object({
  name: z.string().min(2, 'Enter your full name.'),
  email: z.string().email('Enter a valid email address.'),
  phone: z.string().min(10, 'Enter a valid phone number.'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfileEditScreen() {
  const theme = useAppTheme();
  const { appState, updateProfile } = useAppState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: appState?.session.user.name ?? '',
      email: appState?.session.user.email ?? '',
      phone: appState?.session.user.phone ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);
    await updateProfile(values);
    setIsSubmitting(false);
    router.back();
  });

  return (
    <Screen keyboardAware contentContainerStyle={{ gap: theme.spacing.lg }}>
      <PageHeader
        title="Edit Profile"
        centered
        left={<IconButton name="arrow-back" onPress={() => router.back()} filled={false} />}
      />

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <AppTextField
            label="Full Name"
            placeholder="Enter your full name"
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

      <PrimaryButton label="Save Changes" onPress={onSubmit} loading={isSubmitting} />
    </Screen>
  );
}
