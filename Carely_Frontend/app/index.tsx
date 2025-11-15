import { Redirect } from 'expo-router';

export default function Index() {
  // Always redirect to the user-mgt login page on app start
  return <Redirect href="/(user-mgt)/login" />;
}
