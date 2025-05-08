import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from "react-native-paper";
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)/index"/>
        </Stack>
        <StatusBar style="dark" />
      </PaperProvider>
    </QueryClientProvider>
  );
}