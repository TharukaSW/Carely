import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { listMessages, sendMessage, Message } from '../services/chat';
import { getUser, SessionUser } from '../session';

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUser(u);
      if (!id) return;
      try {
        const items = await listMessages(String(id));
        setMessages(items);
        setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
      } catch {}
    })();
  }, [id]);

  const onSend = async () => {
    if (!id || !user?.id || !text.trim()) return;
    setSending(true);
    try {
      const created = await sendMessage(String(id), user.id, text.trim());
      setMessages(prev => [...prev, created]);
      setText('');
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    } finally {
      setSending(false);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const mine = item.senderId === user?.id;
    return (
      <View style={[styles.bubbleRow, mine ? { justifyContent: 'flex-end' } : { justifyContent: 'flex-start' }]}>
        <LinearGradient colors={mine ? ['#007AFF', '#0051D5'] : ['#E5E7EB', '#F3F4F6']} style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={[styles.bubbleText, mine ? { color: '#fff' } : { color: '#111827' }]}>{item.text}</Text>
          <Text style={[styles.time, mine ? { color: 'rgba(255,255,255,0.8)' } : { color: '#6B7280' }]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient colors={["#E3F2FD", "#F0F9FF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, marginTop: 40 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={onSend} disabled={sending}>
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  bubble: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleOther: { borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 16, marginBottom: 4 },
  time: { fontSize: 10, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E5E7' },
  input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, color: '#111827' },
  sendBtn: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
