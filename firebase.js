import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDCOjEQwa9cFoe6ZBUzSBvI0_6hZ2TA8HA",
  authDomain: "careflight-36f8b.firebaseapp.com",
  databaseURL: "https://careflight-36f8b-default-rtdb.firebaseio.com",
  projectId: "careflight-36f8b",
  storageBucket: "careflight-36f8b.appspot.com",
  messagingSenderId: "1094978941903",
  appId: "1:1094978941903:web:28a776543e49e7844258ba",
  measurementId: "G-NGPPLL3BVD"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig)
export const FIREBASE_AUTH = getAuth(FIREBASE_APP)
export const FIRESTORE_DB = getFirestore(FIREBASE_APP)
