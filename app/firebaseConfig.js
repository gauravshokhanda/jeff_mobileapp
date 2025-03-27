import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
let firebaseApp;
if (getApps().length === 0 && Platform.OS === 'android') {
  firebaseApp = initializeApp({
    apiKey: "AIzaSyAsoO7K9oSJJHXFVuIxlRowg5MZQjHYAVM",
    authDomain: "ac5d-533ea.firebaseapp.com",
    projectId: "ac5d-533ea",
    storageBucket: "ac5d-533ea.firebasestorage.app",
    messagingSenderId: "99535253661",
    appId: "1:99535253661:web:4bd8a9ed02839a49a2a474",
    measurementId: "G-MFBKY5VSFW",
  });
} else {
  firebaseApp = getApp(); 
}
export default firebaseApp;
  