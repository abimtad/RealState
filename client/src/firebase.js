// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "portfolio-92087.firebaseapp.com",
  projectId: "portfolio-92087",
  storageBucket: "portfolio-92087.firebasestorage.app",
  messagingSenderId: "397181359278",
  appId: "1:397181359278:web:9d0c12770d05f7f6b6893f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
