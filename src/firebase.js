// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDM86DKKFNuulKsKEAFqEM1F-XzosBuVx4",
  authDomain: "dynamic-qr-afbae.firebaseapp.com",
  projectId: "dynamic-qr-afbae",
  storageBucket: "dynamic-qr-afbae.firebasestorage.app",
  messagingSenderId: "589650390205",
  appId: "1:589650390205:web:c8eb14a74a34da34d99bd4",
  measurementId: "G-52KCB2KR05"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
