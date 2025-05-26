import { Platform } from 'react-native';
import IOSMapScreen from '../../components/IOSMapScreen';
import AndroidMapScreen from '../../components/AndroidMapScreen';

export default function MapScreen() {
  return Platform.OS === 'ios' ? <IOSMapScreen /> : <AndroidMapScreen />;
}
