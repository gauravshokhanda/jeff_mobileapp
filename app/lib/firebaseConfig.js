// lib/firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAsoO7K9oSJJHXFVuIxlRowg5MZQjHYAVM",
  authDomain: "ac5d-533ea.firebaseapp.com",
  databaseURL: "https://ac5d-533ea-default-rtdb.firebaseio.com/",
  projectId: "ac5d-533ea",
  storageBucket: "ac5d-533ea.appspot.com",
  messagingSenderId: "99535253661",
  appId: "1:99535253661:web:4bd8a9ed02839a49a2a474"
};

// ✅ Ensure we don't initialize Firebase multiple times
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Export the database instance
export const database = getDatabase(app);
