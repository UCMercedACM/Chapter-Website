import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);