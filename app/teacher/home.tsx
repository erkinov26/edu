import React from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter()
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // local storage tozalash
      router.replace('/(auth)/login')
      Alert.alert('Logged out', 'All data cleared from local storage');
    } catch (e) {
      console.error('Failed to clear AsyncStorage:', e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Teachers Home Page!</Text>
      <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
    </View>
  );
}
