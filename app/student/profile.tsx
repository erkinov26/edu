import React, { useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import useStore from '@/store';

export default function Home() {
  const router = useRouter()
  const { user, loadUser } = useStore()

  useEffect(() => {
    loadUser()
  }, [])

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/(auth)/login')
      Alert.alert('Logged out', 'All data cleared from local storage');
    } catch (e) {
      console.error('Failed to clear AsyncStorage:', e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Students Home Page!</Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 20 }}>
          User ID: {user?.id || "Mavjud emas"}
        </Text>
        User Name: {user?.name || "Mavjud emas"}
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        User Email: {user?.email || "Mavjud emas"}
      </Text>
      <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
    </View>
  );
}
