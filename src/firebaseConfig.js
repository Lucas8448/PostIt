import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOKA3mwYKN3o6_WknFaelYt5MIOVJEQkk",
  authDomain: "postit-d0476.firebaseapp.com",
  projectId: "postit-d0476",
  storageBucket: "postit-d0476.appspot.com",
  messagingSenderId: "52960980158",
  appId: "1:52960980158:web:1c086ea0f98ed2bfcec2ef",
  measurementId: "G-09HGQLX9G2"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();