import { initializeApp, getApps } from "firebase/app"
import { getAuth } from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAuMSWOJU4J4QwokjzgjlkLnUbrfLYPFrs",
  authDomain: "fredddie253.firebaseapp.com",
  projectId: "fredddie253",
  storageBucket: "fredddie253.firebasestorage.app",
  messagingSenderId: "50686854664",
  appId: "1:50686854664:web:75a1926bcbebcc621733bd",
  measurementId: "G-9PW0ZC3X0X",
}

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Define collection paths for consistency
export const COLLECTIONS = {
  USERS: "users",
  PROJECTS: "projects",
  INVESTMENTS: "investments",
  MESSAGES: "messages",
  CONTACTS: "contacts",
  TESTIMONIALS: "testimonials",
  PAYMENTS: "payments",
}

// Helper functions for common database operations
export const createDocument = async (collectionPath: string, data: DocumentData) => {
  return addDoc(collection(db, collectionPath), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const setDocument = async (collectionPath: string, id: string, data: DocumentData) => {
  return setDoc(
    doc(db, collectionPath, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export const getDocument = async (collectionPath: string, id: string) => {
  return getDoc(doc(db, collectionPath, id))
}

export const queryCollection = async (
  collectionPath: string,
  queryConstraints: any[] = [],
  orderByField = "createdAt",
  orderDirection: "asc" | "desc" = "desc",
  limitCount = 100,
) => {
  const q = query(
    collection(db, collectionPath),
    ...queryConstraints,
    orderBy(orderByField, orderDirection),
    limit(limitCount),
  )
  return getDocs(q)
}

// Helper for file uploads
export const uploadFile = async (path: string, file: File) => {
  const storageRef = ref(storage, path)
  const snapshot = await uploadBytes(storageRef, file)
  return getDownloadURL(snapshot.ref)
}

export {
  app,
  auth,
  db,
  storage,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
}
