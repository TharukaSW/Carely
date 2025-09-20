import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NavigationBar from '@/components/NavigationBar';
import { listConversations, startConversation, listUsers, Conversation } from '../services/chat';
import { getUser, SessionUser } from '../session';
import { router } from 'expo-router';

export default function ChatListScreen() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [items, setItems] = useState<Conversation[]>([]);
  const [showAllUsers, setShowAllUsers] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      if (!u?.id) {
        setLoading(false);
        return;
      }
      try {
        const [convos, people] = await Promise.all([
          listConversations(u.id),
          listUsers(u.id)
        ]);
        setItems(convos);
        setUsers(Array.isArray(people) ? people : []);
      } catch (e: any) {
        setError(e.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStartChat = async (otherUser: any) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const convo = await startConversation([user.id, otherUser.id]);
      router.push({ pathname: '/(communication-mgt)/chat-thread' as const, params: { id: convo.id } });
    } catch (e: any) {
      setError(e.message || 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = item.otherUser;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardContainer}
  onPress={() => router.push({ pathname: '/(communication-mgt)/chat-thread' as const, params: { id: item.id } })}
      >
        <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]} style={styles.card}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.avatarBorder}>
              <Image source={require('@/assets/images/doctor1.png')} style={styles.avatar} />
            </LinearGradient>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{other?.fullName || 'Conversation'}</Text>
              <Text style={styles.time}>{item.updatedAt ? new Date(item.updatedAt).toLocaleTimeString() : ''}</Text>
            </View>
            <View style={styles.lastRow}>
              <MaterialIcons name="chat-bubble-outline" size={16} color="#8E8E93" />
              <Text numberOfLines={1} style={styles.lastMessage}>
                {item.lastMessage?.text || 'Start chatting'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#007AFF" />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
          <View style={styles.center}> 
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
          <NavigationBar />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
          <View style={styles.center}> 
            <Text style={{ color: 'red' }}>{error}</Text>
          </View>
          <NavigationBar />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]} style={styles.header}>
          <Text style={styles.title}>{showAllUsers ? 'Start New Chat' : 'Messages'}</Text>
          <TouchableOpacity style={styles.newChatBtn} onPress={() => setShowAllUsers(v => !v)}>
            <Ionicons name={showAllUsers ? 'chatbubbles' : 'add'} size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
        {showAllUsers ? (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            data={users}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cardContainer}
                onPress={() => handleStartChat(item)}
              >
                <LinearGradient colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]} style={styles.card}>
                  <View style={styles.avatarWrap}>
                    <LinearGradient colors={["#007AFF", "#0051D5"]} style={styles.avatarBorder}>
                      <Image source={require('@/assets/images/doctor1.png')} style={styles.avatar} />
                    </LinearGradient>
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.name}>{item.fullName || item.email || 'User'}</Text>
                      <Text style={styles.time}>{item.role ? String(item.role) : ''}</Text>
                    </View>
                    <View style={styles.lastRow}>
                      <MaterialIcons name="chat-bubble-outline" size={16} color="#8E8E93" />
                      <Text numberOfLines={1} style={styles.lastMessage}>Tap to start chatting</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="#007AFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            data={items}
            keyExtractor={(i) => i.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        )}
        <NavigationBar />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { fontSize: 24, fontWeight: '800', color: '#2c3e50' },
  newChatBtn: { backgroundColor: '#007AFF', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  cardContainer: { marginHorizontal: 20 },
  card: {
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  avatarWrap: { marginRight: 12 },
  avatarBorder: { padding: 2, borderRadius: 24 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff' },
  cardBody: { flex: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 16, fontWeight: '700', color: '#2c3e50', flex: 1, marginRight: 8 },
  time: { fontSize: 12, color: '#8E8E93' },
  lastRow: { flexDirection: 'row', alignItems: 'center' },
  lastMessage: { marginLeft: 6, color: '#7f8c8d', flex: 1 },
});
