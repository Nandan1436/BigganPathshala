// Firestore setup and tutorial CRUD helpers
import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Add a new tutorial
export async function createTutorial(tutorial) {
  const docRef = await addDoc(collection(db, "tutorials"), tutorial);
  return docRef.id;
}

// Get all tutorials (optionally filter/sort)
export async function getTutorials({ tag, author, sortBy = "createdAt" } = {}) {
  let q = collection(db, "tutorials");
  if (tag) q = query(q, where("tags", "array-contains", tag));
  if (author) q = query(q, where("author", "==", author));
  q = query(q, orderBy(sortBy, "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Get a single tutorial by ID
export async function getTutorial(id) {
  const docRef = doc(db, "tutorials", id);
  const snap = await getDoc(docRef);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Update a tutorial
export async function updateTutorial(id, data) {
  const docRef = doc(db, "tutorials", id);
  await updateDoc(docRef, data);
}

// Delete a tutorial
export async function deleteTutorial(id) {
  const docRef = doc(db, "tutorials", id);
  await deleteDoc(docRef);
}
