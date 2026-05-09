import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzv-Zzg9mqHqbIsSiAe5dqAIM6cVw3j8Q",
  authDomain: "servicehub-60da3.firebaseapp.com",
  projectId: "servicehub-60da3",
  storageBucket: "servicehub-60da3.firebasestorage.app",
  messagingSenderId: "578972620575",
  appId: "1:578972620575:web:3e47f36c471b9c0836022a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);