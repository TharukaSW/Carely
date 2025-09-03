import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";

const PAYMENT_HISTORY = [
  {
    id: "1",
    doctor: "Dr. Suresh Perera",
    avatar: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
    date: "2025-07-12",
    time: "06.00 PM",
    amount: "Rs 4000.00",
    location: "Suwasewana, Kandy",
  },
  {
    id: "2",
    doctor: "Dr. Nimal Silva",
    avatar: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
    date: "2025-06-20",
    time: "09.00 AM",
    amount: "Rs 2500.00",
    location: "Asiri, Kandy",
  },
];

export default function PaymentHistory() {

    const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false, // hides the black bar
        });
      }, [navigation]);
    
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>
      <FlatList
        data={PAYMENT_HISTORY}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.doctor}>{item.doctor}</Text>
                <Text style={styles.location}>{item.location}</Text>
                <Text style={styles.date}>{item.date} | {item.time}</Text>
              </View>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007CA5",
    marginBottom: 18,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#007CA5",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  doctor: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  location: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  date: {
    fontSize: 13,
    color: "#007CA5",
  },
  amountRow: {
    marginTop: 10,
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0090B7",
  },
});