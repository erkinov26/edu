import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "react-native-reanimated";
import { PaperProvider } from "react-native-paper";
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />

        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </QueryClientProvider>
  );
}