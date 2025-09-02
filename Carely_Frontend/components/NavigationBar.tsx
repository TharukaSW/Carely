import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

interface NavigationBarProps {
  style?: any;
}

export default function NavigationBar({ style }: NavigationBarProps) {
  const pathname = usePathname();

  const navigateToScreen = (screenName: string) => {
    switch (screenName) {
      case 'home':
        router.push('/(tabs)');
        break;
      case 'appointments':
        router.push('/(apponintment-mgt)/appointments');
        break;
      case 'chat':
        router.push('/(communication-mgt)/chat');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
    }
  };

  const isActive = (screenName: string) => {
    switch (screenName) {
      case 'home':
        return pathname === '/(tabs)' || pathname === '/(tabs)/';
      case 'appointments':
        return pathname.includes('/apponintment-mgt/appointments');
      case 'chat':
        return pathname.includes('/communication-mgt/chat');
      case 'profile':
        return pathname.includes('/profile');
      default:
        return false;
    }
  };

  const TabButton = ({ 
    iconName, 
    label, 
    screenName, 
    onPress 
  }: { 
    iconName: keyof typeof Ionicons.glyphMap; 
    label: string; 
    screenName: string; 
    onPress: () => void; 
  }) => {
    const active = isActive(screenName);
    
    return (
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={iconName} 
          size={24} 
          color={active ? '#1593B5' : '#8CB6C1'} 
        />
        <Text style={[
          styles.tabLabel, 
          { color: active ? '#1593B5' : '#8CB6C1' }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TabButton
        iconName="home"
        label="Home"
        screenName="home"
        onPress={() => navigateToScreen('home')}
      />
      <TabButton
        iconName="calendar"
        label="Appointments"
        screenName="appointments"
        onPress={() => navigateToScreen('appointments')}
      />
      <TabButton
        iconName="chatbubbles"
        label="Chat"
        screenName="chat"
        onPress={() => navigateToScreen('chat')}
      />
      <TabButton
        iconName="person"
        label="Profile"
        screenName="profile"
        onPress={() => navigateToScreen('profile')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});
