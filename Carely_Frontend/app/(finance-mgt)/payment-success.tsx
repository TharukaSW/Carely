import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router"; // Add this import

export default function PaymentSuccess() {
  const router = useRouter(); // Use the router hook

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, // hides the black bar
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={120} color="#007CA5" />
      </View>

      {/* Success Message */}
      <Text style={styles.successText}>Payment Done</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/")} // Navigate to home
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, { marginTop: 12 }]}
          onPress={() => alert("Invoice Downloaded")}
        >
          <Text style={styles.primaryButtonText}>Download Invoice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { marginTop: 12 }]}
          onPress={() => router.push("/payment-history")} // Navigate to history
        >
          <Text style={styles.secondaryButtonText}>View Payment History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  iconContainer: {
    marginBottom: 30,
  },
  successText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007CA5",
    marginBottom: 50,
  },
  buttonContainer: {
    width: "100%",
    position: "absolute",
    bottom: 40,
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: "#007CA5",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  secondaryButtonText: {
    color: "#007CA5",
    fontSize: 16,
    fontWeight: "500",
  },
});
