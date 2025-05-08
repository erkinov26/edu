import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (groupName: string) => void;
}

export default function CreateGroupModal({
  visible,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    if (groupName.trim()) {
      onCreate(groupName.trim());
      setGroupName(""); // Clear input after submission
    } else {
      Alert.alert("Xatolik", "Guruh nomini kiriting");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Yangi Guruh Qo'shish</Text>
          <TextInput
            style={styles.input}
            placeholder="Guruh nomini kiriting"
            value={groupName}
            onChangeText={setGroupName}
          />
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.createButtonText}>Yaratish</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Bekor qilish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "bold",
  },
});