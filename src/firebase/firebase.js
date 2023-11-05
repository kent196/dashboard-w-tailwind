import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBlPNc5MCV-NWk2foeMc8GIJ1zbhfQ5vBY",
  authDomain: "pah-storage.firebaseapp.com",
  projectId: "pah-storage",
  storageBucket: "pah-storage.appspot.com",
  messagingSenderId: "708287122606",
  appId: "1:708287122606:web:f22a09a83a6ec40627713f",
  measurementId: "G-R6JNN45KBZ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//analytics is optional for this tutoral
firebase.analytics();
const storage = firebase.storage();
export { storage, firebase as default };
