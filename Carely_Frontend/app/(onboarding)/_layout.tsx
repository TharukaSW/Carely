import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Add all onboarding screens to the stack */}
      {/* Example: <Stack.Screen name="get-start" /> */}
      {/* Example: <Stack.Screen name="select-role" /> */}
      {/* Example: <Stack.Screen name="onboarding_one" /> */}
      {/* Example: <Stack.Screen name="onboarding_two" /> */}
      {/* Example: <Stack.Screen name="onboarding_three" /> */}
    </Stack>
  );
}
