import { loginUser, registerUser } from '@/scripts/axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'pupil' | 'teacher'>('pupil');
  const [menuVisible, setMenuVisible] = useState(false);

  const loginMutation = useMutation({
    mutationFn: () => loginUser(email, password),
    onSuccess: () => {
      Alert.alert('Success', 'Muvaffaqiyatli tizimga kirdingiz');
    },
    onError: (error: any) => {
      Alert.alert('Xatolik', error?.response?.data?.message || 'Login xatoligi');
    },
  });

  const registerMutation = useMutation({
    mutationFn: () => registerUser(name, email, password, role),
    onSuccess: () => {
      Alert.alert('Success', 'Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi');
      setIsLogin(true);
    },
    onError: (error: any) => {
      Alert.alert('Xatolik', error?.response?.data?.message || 'Ro‘yxatdan o‘tishda xatolik');
    },
  });

  const validateFields = () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Ogohlantirish', 'Iltimos, barcha maydonlarni to‘ldiring');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateFields()) return;

    if (isLogin) {
      loginMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  const roleLabel = role === 'pupil' ? 'O‘quvchi' : 'O‘qituvchi';

  const roles = [
    { key: 'pupil', label: 'O‘quvchi' },
    { key: 'teacher', label: 'O‘qituvchi' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Ro‘yxatdan o‘tish'}</Text>

      {!isLogin && (
        <TextInput
          placeholder="Ismingiz"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Parol"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {!isLogin && (
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setMenuVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>Rol: {roleLabel}</Text>
          </TouchableOpacity>

          <Modal
            visible={menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <Pressable
              style={styles.modalOverlay}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.modalContent}>
                {roles.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    style={styles.modalItem}
                    onPress={() => {
                      setRole(item.key as 'pupil' | 'teacher');
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>
        </View>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isLoading}
        style={{
          backgroundColor: '#0066cc',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
          marginVertical: 12,
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {isLogin ? 'Login' : 'Ro‘yxatdan o‘tish'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setIsLogin(!isLogin);
          // reset fields when switching
          setName('');
          setEmail('');
          setPassword('');
        }}
      >
        <Text style={styles.toggleText}>
          {isLogin
            ? "Ro‘yxatdan o‘tmaganmisiz? Ro‘yxatdan o‘ting"
            : "Akkauntingiz bormi? Login qiling"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: 250,
    paddingVertical: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  toggleText: {
    color: '#0066cc',
    textAlign: 'center',
    marginTop: 12,
  },
});
