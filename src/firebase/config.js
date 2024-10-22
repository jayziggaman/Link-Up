import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth"
import { collection, getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCbdZwarj1WFCoNvMF5-SrMTzGSEoGKVgM",
  authDomain: "wowi-media.firebaseapp.com" || 'localhost' || 'wowi-media.web.app' || '172.20.10.7',
  projectId: "wowi-media",
  storageBucket: "wowi-media.appspot.com",
  messagingSenderId: "18381072013",
  appId: "1:18381072013:web:a212fb5d4b52e6fd55a4c4",
  measurementId: "G-E087BGHXK8"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth();
setPersistence(auth, browserSessionPersistence)

export const db = getFirestore(app)
export const postsRef = collection(db, 'posts')

export const usersRef = collection(db, 'users')

export const messageRoomsRef = collection(db, 'messageRooms')

export const storage = getStorage(app)

export const googleProvider = new GoogleAuthProvider()

