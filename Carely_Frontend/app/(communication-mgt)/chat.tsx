import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from '../../components/NavigationBar';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  
  const chats = [
    {
      id: 1,
      name: 'Dr. Saman Silva',
      role: 'Cardiologist',
      lastMessage: 'Your test results look good. Continue with your current medication.',
      time: '2 hours ago',
      unread: 1,
      avatar: '👨‍⚕️'
    },
    {
      id: 2,
      name: 'Family Care Group',
      role: 'Family Members',
      lastMessage: 'Mom: How are you feeling today?',
      time: '5 hours ago',
      unread: 3,
      avatar: '👨‍👩‍👧‍👦'
    },
    {
      id: 3,
      name: 'Nurse Kamala',
      role: 'Home Care Nurse',
      lastMessage: 'I will visit you tomorrow at 10 AM for your regular checkup.',
      time: '1 day ago',
      unread: 0,
      avatar: '👩‍⚕️'
    },
    {
      id: 4,
      name: 'Emergency Support',
      role: 'Emergency Services',
      lastMessage: 'Emergency contact available 24/7',
      time: '3 days ago',
      unread: 0,
      avatar: '🚨'
    }
  ];

  const ChatItem = ({ chat }: { chat: any }) => (
    <TouchableOpacity style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{chat.avatar}</Text>
        {chat.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCount}>{chat.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <Text style={styles.chatRole}>{chat.role}</Text>
        <Text style={styles.lastMessage} numberOfLines={2}>
          {chat.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.newChatBtn}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Emergency Quick Access */}
      <TouchableOpacity style={styles.emergencyButton}>
        <Ionicons name="call" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.emergencyText}>Emergency Call</Text>
      </TouchableOpacity>

      <ScrollView style={styles.chatList} contentContainerStyle={{ paddingBottom: 100 }}>
        {chats.map(chat => (
          <ChatItem key={chat.id} chat={chat} />
        ))}
      </ScrollView>

      {/* Quick Message Input */}
      <View style={styles.quickMessageContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Quick message to family..."
          placeholderTextColor="#8CB6C1"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <NavigationBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1593B5',
  },
  newChatBtn: {
    backgroundColor: '#1593B5',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: '#F1F8FC',
    borderRadius: 25,
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1593B5',
    flex: 1,
  },
  chatTime: {
    fontSize: 12,
    color: '#666',
  },
  chatRole: {
    fontSize: 12,
    color: '#8CB6C1',
    marginBottom: 6,
  },
  lastMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },
  quickMessageContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#F1F8FC',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1593B5',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1593B5',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
