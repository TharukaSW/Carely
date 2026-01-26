import { Stack } from 'expo-router';

export default function AppointmentLayout() {
  return (
    <Stack>
      <Stack.Screen name="appointments" options={{ title: 'Appointments' }} />
      <Stack.Screen name="choose-doctor" options={{ title: 'Choose Doctor' }} />
      <Stack.Screen name="doctor-details" options={{ title: 'Doctor Details' }} />
    </Stack>
  );
}