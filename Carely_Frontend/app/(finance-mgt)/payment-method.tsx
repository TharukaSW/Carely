// PaymentMethodScreen.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentMethod() {
    const navigation = useNavigation();
    
      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false, // hides the black bar
        });
      }, [navigation]);
    

  const [selectedMethod, setSelectedMethod] = useState<string>("");

  const otherMethods = [
    { id: "paypal", label: "PayPal" },
    { id: "gpay", label: "Google Pay" },
    { id: "applepay", label: "Apple Pay" },
    { id: "ewallet", label: "E-wallet" },
  ];

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Payment Method</Text>

      {/* Credit / Debit Card Section */}
      <View style={styles.cardSection}>
        <Text style={styles.sectionTitle}>Credit & Debit Card</Text>

        {/* Example VISA Card */}
        <View style={styles.cardItem}>
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
            }}
            style={styles.cardLogo}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>**** **** **** 1234</Text>
        </View>

        {/* Add New Card Button */}
        <TouchableOpacity style={styles.addCardButton}
            onPress={() => router.push("/(finance-mgt)/add-card")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#007CA5" />
          <Text style={styles.addCardText}>Add a new card</Text>
        </TouchableOpacity>
      </View>

      {/* Other Payment Methods */}
      <View style={styles.otherSection}>
        <Text style={styles.sectionTitle}>Other Payment Methods</Text>

        <FlatList
          data={otherMethods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.methodItem}
              onPress={() => setSelectedMethod(item.id)}
            >
              {/* Radio Button */}
              <View style={styles.radioOuter}>
                {selectedMethod === item.id && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.methodText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#007CA5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#007CA5",
  },
  cardSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#007CA5",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLogo: {
    width: 50,
    height: 30,
    marginRight: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#007CA5",
  },
  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addCardText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#007CA5",
    fontWeight: "500",
  },
  otherSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#007CA5",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  methodText: {
    fontSize: 16,
    color: "#007CA5",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007CA5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007CA5",
  },
});

