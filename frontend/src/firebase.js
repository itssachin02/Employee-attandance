import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC06dKPKOEzW2r-a_2g-Qzvd30eE5ZKA94",
  authDomain: "employee-attandance-cfcf6.firebaseapp.com",
  projectId: "employee-attandance-cfcf6",
  storageBucket: "employee-attandance-cfcf6.firebasestorage.app",
  messagingSenderId: "301157738057",
  appId: "1:301157738057:web:571a71261bc199cb65c198",
  measurementId: "G-V6F3L34M2B",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
