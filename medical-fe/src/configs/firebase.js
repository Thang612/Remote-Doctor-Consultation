// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOiB_VgXRlMj-i_HQwl0SidYKD7C_EFg0",
  authDomain: "remote-doctor-7d54b.firebaseapp.com",
  projectId: "remote-doctor-7d54b",
  storageBucket: "remote-doctor-7d54b.firebasestorage.app",
  messagingSenderId: "1067517394729",
  appId: "1:1067517394729:web:91917947aa6dda6d714138",
  measurementId: "G-4Y6RYYR99Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app)

export { db, ref, set };