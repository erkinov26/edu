import { createStudentAndAddToGroup } from '@/scripts/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface UserModalProps {
  groupId: string,
  visible: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ groupId, visible, onClose }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [mutationError, setMutationError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof userData, value: string) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [field]: '', // Clear the error for the current field
    }));
  };

  const validateInputs = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '' };

    if (!userData.name.trim()) {
      newErrors.name = 'Ismni kiriting.';
      valid = false;
    }
    if (!userData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'To‘g‘ri email kiriting.';
      valid = false;
    }
    if (userData.password.length < 6) {
      newErrors.password = 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => createStudentAndAddToGroup(userData, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupDetails'] });
      setMutationError(null); // Clear any previous mutation error
      onClose();
    },
    onError: (err) => {
      console.log("🚀 ~ err:", err);
      setMutationError(err instanceof Error ? err.message : 'Noma‘lum xatolik yuz berdi.');
    }
  });

  const handleSave = () => {
    if (validateInputs()) {
      mutate();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Foydalanuvchi ma'lumotlari</Text>

          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            placeholder="Ism"
            value={userData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email"
            keyboardType="email-address"
            value={userData.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            placeholder="Parol"
            secureTextEntry
            value={userData.password}
            onChangeText={(text) => handleInputChange('password', text)}
          />
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancel]}>
              <Text style={styles.buttonText}>Bekor qilish</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={[styles.button, styles.save]}>
              <Text style={styles.buttonText}>{isPending ? "Saqlanyapti" : "Saqlash"}</Text>
            </TouchableOpacity>
          </View>

          {mutationError && <Text style={styles.errorText}>{mutationError}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default UserModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancel: {
    backgroundColor: '#ccc',
  },
  save: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
});