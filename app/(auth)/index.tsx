import { Redirect } from 'expo-router';
import { useEffect, useState as useReactState } from 'react';
import useState from '@/store';  // Zustand'dan role olish
import { ActivityIndicator, View } from 'react-native';

export default function AuthIndex() {
  const user = useState((state) => state.user);
  const loadUser = useState((state) => state.loadUser);
  const [loading, setLoading] = useReactState(true);

  useEffect(() => {
    const load = async () => {
      await loadUser();
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user || !user.role) {
    return <Redirect href="/(auth)/login" />;
  }

  if (user.role === 'teacher') {
    return <Redirect href="/teacher/home" />;
  }

  if (user.role === 'student') {
    return <Redirect href="/pupil/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
