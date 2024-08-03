// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxKwkJV2TEyp71pzAc9zfD5DwGP-hp2rM",
  authDomain: "pantry-tracker-1e6e6.firebaseapp.com",
  projectId: "pantry-tracker-1e6e6",
  storageBucket: "pantry-tracker-1e6e6.appspot.com",
  messagingSenderId: "777438505171",
  appId: "1:777438505171:web:67f07dc60d3fb027234c26",
  measurementId: "G-1CD813NJ4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }