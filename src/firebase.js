import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsietdUrHjGnqorDifNjlIeLQWGahqNm0",
  authDomain: "dearest-mide-blog-49a62.firebaseapp.com",
  projectId: "dearest-mide-blog-49a62",
  storageBucket: "dearest-mide-blog-49a62.firebasestorage.app",
  messagingSenderId: "237756078416",
  appId: "1:237756078416:web:22186e9f5abe48a90c7455",
  measurementId: "G-CJ8QQ49QLT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
