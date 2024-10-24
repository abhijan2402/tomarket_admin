// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX8_dmdNNdTcfmzXgHa29I2Fhg3zV7U1Q",
  authDomain: "tomarket-6a3e1.firebaseapp.com",
  projectId: "tomarket-6a3e1",
  storageBucket: "tomarket-6a3e1.appspot.com",
  messagingSenderId: "1038626066547",
  appId: "1:1038626066547:web:876239cb62b20957841a06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };