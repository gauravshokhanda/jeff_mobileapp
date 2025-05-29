import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ForgotPasswordModal from "./ForgotPasswordModal";

const ResetPasswordModal = ({ visible, onClose, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotModalVisible, setForgotModalVisible] = useState(false);

  const handleReset = () => {
    if (newPassword !== confirmPassword) {
      alert("New and Confirm Password do not match!");
      return;
    }
    onSubmit({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            placeholder="Current Password"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            placeholderTextColor={"gray"}
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry
            placeholderTextColor={"gray"}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancel}>
              <Text style={{ color: "#555" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReset} style={styles.submit}>
              <Text style={{ color: "white" }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Modal */}
        <ForgotPasswordModal
          visible={forgotModalVisible}
          onClose={() => setForgotModalVisible(false)}
          onSubmit={(data) => {
            console.log("Forgot Password form data:", data);
            setForgotModalVisible(false);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00000088",
  },
  modal: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  forgotText: { color: "#007bff", textAlign: "right", marginBottom: 10 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  cancel: { padding: 10 },
  submit: { backgroundColor: "#0c4a6e", padding: 10, borderRadius: 6 },
});

export default ResetPasswordModal;
