// AddCardScreen.tsx
import { router, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

export default function AddCard() {
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const handleSave = () => {
    console.log({
      cardHolder,
      cardNumber,
      expiryDate,
      cvv,
      saveCard,
    });
    // integrate Firebase save logic here
  };

  const navigation = useNavigation();
  
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, // hides the black bar
      });
    }, [navigation]);
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {/* Title */}
      <Text style={styles.title}>Add Card</Text>

      {/* Summary Section with Card Image */}
      <View style={styles.summaryBox}>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
          }}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Card Details Section */}
      <Text style={styles.sectionTitle}>Card Details</Text>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>Card Holder Name</Text>
        <TextInput
          style={styles.input}
          value={cardHolder}
          onChangeText={setCardHolder}
          placeholder="Enter Card Holder Name"
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.inputBox}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={16}
          placeholderTextColor="#aaa"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputBox, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/YY"
            placeholderTextColor="#aaa"
          />
        </View>
        <View style={[styles.inputBox, { flex: 1 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="***"
            secureTextEntry
            keyboardType="numeric"
            maxLength={3}
            placeholderTextColor="#aaa"
          />
        </View>
      </View>

      {/* Save Card Option - Custom Checkbox */}
      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => setSaveCard(!saveCard)}
      >
        <View style={[styles.checkbox, saveCard && styles.checkboxChecked]} />
        <Text style={styles.checkboxText}>Save card for later</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} 
        onPress={() => router.push("/(finance-mgt)/payment-details")}
      >
        <Text style={styles.saveButtonText}>Save Card</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", // light background
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    color: "#007CA5",
  },
  summaryBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007CA5",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 60,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    color: "#007CA5",
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    color: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#007CA5",
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#007CA5",
  },
  checkboxText: {
    fontSize: 16,
    color: "#333",
  },  
  saveButton: {
    backgroundColor: "#007CA5",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#007CA5",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
