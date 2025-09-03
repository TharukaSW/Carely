import { useNavigation } from "expo-router";
import React, { useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Invoice({ name = "Ann Smith", card = "•••• 0042", date = "2025-09-03", amount = 4000 }) {

    const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false, // hides the black bar
        });
      }, [navigation]);
    

  return (
    <View style={styles.invoiceContainer}>
      <Text style={styles.title}>Invoice</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Patient Name:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Card Number:</Text>
        <Text style={styles.value}>{card}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Doctor Name:</Text>
        <Text style={styles.value}>Dr. Suresh Perera</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Doctor Appointment:</Text>
        <Text style={styles.value}>Rs 3500.00</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Tax:</Text>
        <Text style={styles.value}>Rs 500.00</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Discount:</Text>
        <Text style={styles.value}>Rs 00.00</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>Rs {amount}.00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  invoiceContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#007CA5",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    margin: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007CA5",
    marginBottom: 18,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#007CA5",
    fontWeight: "500",
  },
  value: {
    fontSize: 16,
    color: "#007CA5",
    fontWeight: "500",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#007CA5",
    paddingTop: 12,
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
});