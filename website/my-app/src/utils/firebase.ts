import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBiorp4auYxrBDEI1WnqfJGMN9lkP7A7vo",
  authDomain: "ai-protector.firebaseapp.com",
  projectId: "ai-protector",
  storageBucket: "ai-protector.appspot.com",
  messagingSenderId: "40975275712",
  appId: "1:40975275712:web:fd2eefccceb4782d07ff25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
