import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDi9hdqloCIg_8sfjjyERqnfAr-pW3BeNY",
  authDomain: "restarter-app.firebaseapp.com",
  projectId: "restarter-app",
  storageBucket: "restarter-app.firebasestorage.app",
  messagingSenderId: "393816322828",
  appId: "1:393816322828:web:32a9ed91fe95ab9cdd8f29",
  measurementId: "G-CX4DYFJ5B4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app; 