import { Tabs } from 'expo-router';

export default function StudentTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="groups" options={{ title: 'Groups' }} />
      <Tabs.Screen name="available-groups" options={{ title: 'Available Groups' }} />
    </Tabs>
  );
}
