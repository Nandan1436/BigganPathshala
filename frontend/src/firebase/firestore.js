// Firestore setup and tutorial CRUD helpers
import { initializeApp } from "firebase/app";

import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig, geminiModel } from "./config";

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

// Store quizzes as subcollection under a tutorial
export async function saveTutorialQuizzes(tutorialId, quizzes) {
  // quizzes: { easy: [...], medium: [...], hard: [...] }
  const quizLevels = Object.keys(quizzes);
  for (const level of quizLevels) {
    const quizDocRef = doc(db, "tutorials", tutorialId, "quizzes", level);
    await setDoc(quizDocRef, { questions: quizzes[level] });
  }
}

// Fetch quizzes for a tutorial (all levels)
export async function getTutorialQuizzes(tutorialId) {
  const quizColRef = collection(db, "tutorials", tutorialId, "quizzes");
  const snap = await getDocs(quizColRef);
  const quizzes = {};
  snap.forEach((doc) => {
    quizzes[doc.id] = doc.data().questions;
  });
  return quizzes;
}

/**
 * Save a user's quiz result under a tutorial's quiz_result subcollection.
 * @param {string} tutorialId - The Firestore document ID for the tutorial
 * @param {object} result - { userId, score, answers, timestamp }
 */
export async function saveQuizResult(tutorialId, result) {
  const quizResultRef = collection(db, "tutorials", tutorialId, "quiz_results");
  await addDoc(quizResultRef, result);
}

/**
 * Get all quiz results for a tutorial.
 * @param {string} tutorialId
 * @returns {Promise<Array>} Array of quiz result objects
 */
export async function getQuizResults(tutorialId) {
  const quizResultRef = collection(db, "tutorials", tutorialId, "quiz_results");
  const snap = await getDocs(quizResultRef);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Get all quiz results for a user across all tutorials (for profile stats).
 * @param {string} userId
 * @returns {Promise<Array>} Array of { tutorialId, ...result }
 */
export async function getUserQuizResults(userId) {
  // This requires a collectionGroup query
  const q = query(
    collectionGroup(db, "quiz_results"),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({
    id: doc.id,
    tutorialId: doc.ref.parent.parent.id,
    ...doc.data(),
  }));
}

/**
 * Generate quizzes (easy, medium, hard) for a tutorial using Gemini 2.0 Flash.
 * Quizzes must be in Bangla, total 10-25 questions (distributed across levels), and include level-based scoring.
 * @param {string} tutorialContent - The full content of the tutorial (HTML or text)
 * @returns {Promise<{easy: any, medium: any, hard: any}>}
 */
export async function generateQuizzesWithGemini(tutorialContent) {
  const prompt = `তুমি একজন অভিজ্ঞ বিজ্ঞান শিক্ষক ও কুইজ প্রস্তুতকারক। নিচের টিউটোরিয়ালটি পড়ে, বাংলায় ১০ থেকে ২৫টি মাল্টিপল চয়েস কুইজ তৈরি করো।\n\nলেভেলভিত্তিক কুইজ সংখ্যা ও নম্বরঃ\n- সহজ (easy): ৪-১০টি প্রশ্ন, প্রতিটি সঠিক উত্তরে ১ নম্বর\n- মাঝারি (medium): ৩-৮টি প্রশ্ন, প্রতিটি সঠিক উত্তরে ২ নম্বর\n- কঠিন (hard): ৩-৭টি প্রশ্ন, প্রতিটি সঠিক উত্তরে ৩ নম্বর\n\nপ্রতিটি প্রশ্নের জন্য ৩-৪টি অপশন দাও এবং সঠিক অপশন কোনটি তা নির্ধারণ করো (answer index)।\n\nফরম্যাট হবে strick JSON:\n{\n  "easy": [ { "q": "প্রশ্ন...", "options": ["..."], "answer": 0 }, ... ],\n  "medium": [ ... ],\n  "hard": [ ... ]\n}\n\nটিউটোরিয়াল কনটেন্ট:\n"""\n${tutorialContent}\n"""`;
  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  try {
    const text = response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateSummaryWithGemini(content) {
  const prompt = `তুমি একজন দক্ষ লেখক ও সংক্ষেপকারী। নিচের ব্লগ বা টিউটোরিয়াল কনটেন্ট পড়ে বাংলায় একটি সংক্ষিপ্ত, পরিষ্কার এবং তথ্যবহুল সারসংক্ষেপ তৈরি করো।\n\nফরম্যাট হবে সাধারণ টেক্সট।\n\nব্লগ/টিউটোরিয়াল কনটেন্ট:\n"""\n${content}\n"""`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Return trimmed summary text
    return text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return null;
  }
}

/**
 * Generate a spoken-friendly Bengali script for a blog using Gemini.
 * This is not a summary — it's a natural conversational readout of the blog.
 *
 * @param {string} blogContent - The full blog text/content.
 * @returns {Promise<string>} - A Bengali natural spoken version of the blog.
 */
export async function generateSpeechScriptWithGemini(blogContent) {
  const prompt = `তুমি একজন প্রফেশনাল ব্লগ পাঠক এবং বক্তা। নিচের ব্লগটি একটি রেডিও বা অডিও প্ল্যাটফর্মে পড়ে শোনাতে হবে। ব্লগের মূল ভাব বজায় রেখে, বাংলায় একটি প্রাঞ্জল, কথ্যভাষায় উপস্থাপনযোগ্য স্ক্রিপ্ট তৈরি করো। এটি যেন একজন মানুষ সুন্দরভাবে পড়ে শুনাতে পারে এমন হয়।

ফরম্যাট হবে সাধারণ বাংলা টেক্সট, কোনো কোড বা ট্যাগ ছাড়াই।

ব্লগ কনটেন্ট:
"""
${blogContent}
"""`;

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("Gemini speech script generation error:", error);
    return null;
  }
}