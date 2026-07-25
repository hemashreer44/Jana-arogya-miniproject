import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXOrnam-P_ge6tVjhwzmPIRjbvzzxwjUw",
  authDomain: "jana-arogya.firebaseapp.com",
  projectId: "jana-arogya",
  storageBucket: "jana-arogya.firebasestorage.app",
  messagingSenderId: "982292255800",
  appId: "1:982292255800:web:87e692be4599a9c396c2cd",
  measurementId: "G-6BKFERM6QT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;