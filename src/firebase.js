import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBk9TUGrtu7czfBIMbMoJ5_P8weQUrfWgY",
  authDomain: "ethical-dating-1a78d.firebaseapp.com",
  projectId: "ethical-dating-1a78d",
  storageBucket: "ethical-dating-1a78d.firebasestorage.app",
  messagingSenderId: "501596908733",
  appId: "1:501596908733:web:e9795f31735e23eea51bd4"
};

// Initialize Firebase FIRST
const app = initializeApp(firebaseConfig);

// Export initialized services
export const auth = getAuth(app);
export const db = getFirestore(app);