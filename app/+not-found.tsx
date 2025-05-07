// app/+not-found.tsx
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function NotFound() {
  const router = useRouter();
  console.log("🚀 ~ NotFound ~ router:", router)
  return (
    <View>
      <Text>Page Not Found pageeeeeeeeeeeeeeeeeeeeeeee</Text>
    </View>
  );
}
