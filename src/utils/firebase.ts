import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCngBpxC_rH2I5Cp4qiVKv4imSHXi2tHY",
  authDomain: "exam-scheduler-5c99a.firebaseapp.com",
  projectId: "exam-scheduler-5c99a",
  storageBucket: "exam-scheduler-5c99a.firebasestorage.app",
  messagingSenderId: "983680589183",
  appId: "1:983680589183:web:c35a3839105c75f3afce4a",
  measurementId: "G-BFKWHL08VZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Export the app instance if needed
export default app; 