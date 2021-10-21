import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyDQbTZu8aeGN7a10cqrsSaZxcUCF0hKor8",
  authDomain: "acm-chapter-website.firebaseapp.com",
  projectId: "acm-chapter-website",
  storageBucket: "acm-chapter-website.appspot.com",
  messagingSenderId: "371132582015",
  appId: "1:371132582015:web:8e482dd5417a07252a574a"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
export {db,firebase,auth};
// export const firebase = firebase;