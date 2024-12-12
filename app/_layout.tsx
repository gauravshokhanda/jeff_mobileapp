import { Stack } from "expo-router";
import '../global.css';

export default function RootLayout() {
  return <Stack >
    <Stack.Screen name="index" options={{ title: 'Sign up', headerShown: false }} />
    <Stack.Screen name="SignIn/index" options={{ title: 'Sign in', headerShown: false }} />
    <Stack.Screen name='(usertab)' options={{headerShown: false }} />
  </Stack>;
}
