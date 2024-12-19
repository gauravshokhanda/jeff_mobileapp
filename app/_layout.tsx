import { Stack } from "expo-router";
import '../global.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';



export default function RootLayout() {
  return <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Sign in', headerShown: false }} />
          <Stack.Screen name="SignUp/index" options={{ title: 'Sign up', headerShown: false }} />
          
            <Stack.Screen name='(usertab)' options={{ headerShown: false }} />

          
        </Stack>
      </PersistGate>
    </Provider>
  </>;
}
