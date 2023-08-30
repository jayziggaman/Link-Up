import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { collection, getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCbdZwarj1WFCoNvMF5-SrMTzGSEoGKVgM",
  authDomain: "wowi-media.firebaseapp.com",
  projectId: "wowi-media",
  storageBucket: "wowi-media.appspot.com",
  messagingSenderId: "18381072013",
  appId: "1:18381072013:web:a212fb5d4b52e6fd55a4c4",
  measurementId: "G-E087BGHXK8"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)
export const postsRef = collection(db, 'posts')

export const usersRef = collection(db, 'users')

export const directMessagesRef = collection(db, 'directMessages')

export const storage = getStorage(app)

export const googleProvider = new GoogleAuthProvider()

