import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDDciCkCCDb2uFAZdzH5jpv8Q_jvEMr2Ik",
  authDomain: "mlin-12e8c.firebaseapp.com",
  projectId: "mlin-12e8c",
  storageBucket: "mlin-12e8c.firebasestorage.app",
  messagingSenderId: "77410627422",
  appId: "1:77410627422:web:0e41cc5aeea208a7f569cf",
  measurementId: "G-8B7443DG1N"
};

// Inicijalizacija Firebase aplikacije
const app = initializeApp(firebaseConfig);

// Inicijalizacija Firestore baze podataka
export const db = getFirestore(app);