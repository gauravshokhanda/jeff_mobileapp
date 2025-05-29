import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export default function ImagePickerModal({ visible, onClose, onImagePicked, multiple = false, }) {
    const isValidImage = (asset) => {
        return asset?.type?.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(asset?.fileName || '');
    };

    const pickFromCamera = () => {
        onClose();
        launchCamera(
            { mediaType: 'photo', quality: 1, saveToPhotos: true },
            (res) => {
                const asset = res.assets?.[0];
                if (asset && isValidImage(asset)) {
                    onImagePicked(asset);
                } else if (asset) {
                    Alert.alert("Invalid file", "Only JPG or PNG images are allowed.");
                }
            }
        );
    };

const pickFromGallery = () => {
  onClose();
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: multiple ? 0 : 1, // 0 means unlimited selection
    },
    (res) => {
      const assets = res.assets || [];
      const validAssets = assets.filter(isValidImage);

      if (validAssets.length === 0) {
        Alert.alert("Invalid file", "Only JPG or PNG images are allowed.");
        return;
      }
      console.log("Gallery result:", res);

      
      onImagePicked(multiple ? validAssets : validAssets[0]);
    }
  );
};


    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Select Image Source</Text>

                    <TouchableOpacity style={styles.button} onPress={pickFromCamera}>
                        <Text style={styles.buttonText}>📷 Take a Photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={pickFromGallery}>
                        <Text style={styles.buttonText}>🖼️ Choose from Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { backgroundColor: '#eee' }]} onPress={onClose}>
                        <Text style={[styles.buttonText, { color: '#333' }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#0284C7',
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
