import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDUcXJfLEUu5X0FeDyKJLXabyHsY7fa2ms",
  authDomain: "spendwise-a117f.firebaseapp.com",
  projectId: "spendwise-a117f",
  storageBucket: "spendwise-a117f.firebasestorage.app",
  messagingSenderId: "1048064857074",
  appId: "1:1048064857074:web:99810bc457270a5e05d16b",
  measurementId: "G-EKLPQJDVY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);




