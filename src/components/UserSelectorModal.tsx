import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (username: string) => void;
}

const UserSelectorModal: React.FC<UserSelectorModalProps> = ({ visible, onClose, onConfirm }) => {
  const [username, setUsername] = useState("");

  // When the user confirms their choice, store the username in AsyncStorage and notify the parent
  const handleConfirm = async () => {
    if (username.trim().length > 0) {
      try {
        // Store the current user in AsyncStorage under the key "CURRENT_USER"
        await AsyncStorage.setItem("CURRENT_USER", username.trim());
        onConfirm(username.trim());
      } catch (error) {
        console.error("Error saving username:", error);
      }
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter Your Username</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Frodo, Gandalf, Legolas"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={[styles.button, styles.confirmButton]}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UserSelectorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#888",
  },
  confirmButton: {
    backgroundColor: "#E50914",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
// This component is a modal that allows the user to select their username.