
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyCFV-pYBwLw_VrhM_CXRlbVZ3vMakh7IPI",
  authDomain: "qiuz-8797d.firebaseapp.com",
  projectId: "qiuz-8797d",
  storageBucket: "qiuz-8797d.firebasestorage.app",
  messagingSenderId: "958232008040",
  appId: "1:958232008040:web:ef8413e90205bb3b1872dd"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)