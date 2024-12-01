import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5lJJiI96F8iv9xdJqX20CE3XoMA6ooi0",
  authDomain: "blizz-snst.firebaseapp.com",
  projectId: "blizz-snst",
  storageBucket: "blizz-snst.firebasestorage.app",
  messagingSenderId: "484486231889",
  appId: "1:484486231889:web:216b991d8073bd6e560570",
  measurementId: "G-GJGECFZHS2",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };
