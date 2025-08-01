// src/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "",
  authDomain: "warranty-vault-1b7b3.firebaseapp.com",
  projectId: "warranty-vault-1b7b3",
  storageBucket: "warranty-vault-1b7b3.firebasestorage.app",
  messagingSenderId: "785255823220",
  appId: "1:785255823220:web:a11ffae8ad406b53661e21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

export { app, auth, db }; 
