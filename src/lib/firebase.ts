// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtdEAnyOZaCXJmbbksh2TtwxrwVvdOUMU",
  authDomain: "viridelis-dw.firebaseapp.com",
  databaseURL: "https://viridelis-dw-default-rtdb.firebaseio.com",
  projectId: "viridelis-dw",
  storageBucket: "viridelis-dw.firebasestorage.app",
  messagingSenderId: "117715794007",
  appId: "1:117715794007:web:f65b8457084342506ccb12",
  measurementId: "G-KB1WDS6813"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);