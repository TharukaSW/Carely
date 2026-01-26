import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'carely:user';

export type SessionUser = {
  id?: string;
  email: string;
  fullName: string;
  role?: string;
  phone?: string;
  profileImage?: string;
  [key: string]: any;
};

export async function setUser(user: SessionUser) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<SessionUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}
