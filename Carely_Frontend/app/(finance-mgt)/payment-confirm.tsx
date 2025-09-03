import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";

const DOCTOR_AVATAR = 'https://cdn-icons-png.flaticon.com/512/387/387561.png';

export default function PaymentConfirm() {
  const router = useRouter();

  const navigation = useNavigation();
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, // hides the black bar
      });
    }, [navigation]);
  

  return (
    <SafeAreaView style={styles.container}>
      {/* Doctor Details */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Image source={{ uri: DOCTOR_AVATAR }} style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.doctorName}>Dr. Suresh Perera</Text>
            <Text style={styles.specialty}>Physician</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD600" />
              <Text style={styles.ratingText}>4.7 (1207)</Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Appointment</Text>
        <Text style={styles.detail}>Date: Sunday, 12 July</Text>
        <Text style={styles.detail}>Time: 06.00 PM - 08.00 PM</Text>
        <Text style={styles.detail}>Location: Suwasewana, Kandy</Text>
      </View>

      {/* Bill Details */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bill Details</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Doctor Appointment</Text>
          <Text style={styles.value}>Rs 3500.00</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Tax</Text>
          <Text style={styles.value}>Rs 500.00</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Discount</Text>
          <Text style={styles.value}>Rs 00.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Rs 4000.00</Text>
        </View>
      </View>

      {/* Confirm Payment Button */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => router.push("/(finance-mgt)/payment-method")}
      >
        <Text style={styles.confirmBtnText}>Confirm & Pay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#007CA5",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007CA5",
  },
  specialty: {
    fontSize: 15,
    color: "#888",
    fontWeight: "600",
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    color: "#222",
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0090B7",
    marginTop: 8,
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: "#222",
    marginBottom: 2,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    color: "#007CA5",
  },
  value: {
    fontSize: 15,
    color: "#007CA5",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#007CA5",
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007CA5",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007CA5",
  },
  confirmBtn: {
    backgroundColor: '#0090B7',
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: 18,
    paddingHorizontal: 32,
    paddingVertical: 12,
    width: '100%',
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },

//   confirmBtn: {
//     backgroundColor: "#0090B7",
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#0090B7",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   confirmBtnText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "700",
//   },
});