import { Linking, Alert } from "react-native";
export const handleCallPress = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device.");
        }
      })
      .catch((err) => {
        console.log("Error opening phone dialer:", err);
        Alert.alert("Error", "Failed to open phone dialer.");
      });
  };