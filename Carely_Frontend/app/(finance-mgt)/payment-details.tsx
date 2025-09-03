import React, { useLayoutEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRouter } from "expo-router";

const CARD_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg";

export default function PaymentDetails() {
  const router = useRouter();

  const navigation = useNavigation();
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, // hides the black bar
      });
    }, [navigation]);
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Card Info Section */}
        <View style={styles.cardWrapper}>
          <View style={styles.cardSection}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Image source={{ uri: CARD_AVATAR }} style={styles.cardLogo} />
              <Text style={styles.cardNumber}>•••• •••• •••• 0042</Text>
            </View>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Card Holder Name</Text>
                <Text style={styles.value}>Ann Smith</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Expiry Date</Text>
                <Text style={styles.value}>06/30</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Payment Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.detailText}>Doctor Appointment</Text>
            <Text style={styles.detailValue}>Rs 3500.00</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.detailText}>Tax</Text>
            <Text style={styles.detailValue}>Rs 500.00</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.detailText}>Discount</Text>
            <Text style={styles.detailValue}>Rs 00.00</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs 4000.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Payment Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => router.push("/(finance-mgt)/payment-success")}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    padding: 20,
  },
  cardWrapper: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#007CA5",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  cardSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#007CA5",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
  },
  cardLogo: {
    width: 40,
    height: 24,
    marginRight: 10,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#007CA5",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#007CA5",
  },
  value: {
    fontSize: 16,
    fontWeight: "100",
    marginTop: 4,
    color: "#5a5959ff",
  },
  divider: {
    height: 1,
    backgroundColor: "#007CA5",
    marginVertical: 20,
  },
  detailsSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#007CA5",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#007CA5",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: "#007CA5",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007CA5",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#007CA5",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007CA5",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007CA5",
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  payButton: {
    backgroundColor: "#007CA5",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#007CA5",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});