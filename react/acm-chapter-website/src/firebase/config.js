import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFNdbiYkCP20YXNqNfZAK0ERwJ9LNNJs8",
  authDomain: "acm-chapter-website.firebaseapp.com",
  projectId: "acm-chapter-website",
  storageBucket: "acm-chapter-website.appspot.com",
  messagingSenderId: "371132582015",
  appId: "1:371132582015:web:fc2a4ce7b1c324462a574a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
