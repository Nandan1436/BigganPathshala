import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import {
  getQuizResults,
  getTutorial,
  getTutorialQuizzes,
  saveQuizResult,
} from "../firebase/firestore";
export default function TutorialDetail() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizLevel, setQuizLevel] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [quizResults, setQuizResults] = useState({}); // {easy: result, medium: result, ...}
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewInput, setReviewInput] = useState("");
  const [userReview, setUserReview] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    async function fetchTutorial() {
      setLoading(true);
      const data = await getTutorial(id);
      setTutorial(data);
      // Fetch quizzes from subcollection
      const quizData = await getTutorialQuizzes(id);
      setQuizzes(quizData);
      setLoading(false);
    }
    fetchTutorial();
    // Get user
    setUser(auth.currentUser);
  }, [id, auth.currentUser]);

  // Fetch user's quiz results for this tutorial
  useEffect(() => {
    async function fetchResults() {
      if (!user) return;
      const allResults = await getQuizResults(id);
      const userResults = {};
      allResults.forEach((r) => {
        if (r.userId === user.uid) userResults[r.level] = r;
      });
      setQuizResults(userResults);
    }
    if (user) fetchResults();
  }, [user, id, score]);

  useEffect(() => {
    async function fetchReviews() {
      if (!id) return;
      const reviewsRef = collection(db, "tutorials", id, "reviews");
      const q = query(reviewsRef, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const reviewList = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewList);
      // Calculate average rating if ratings are present
      if (reviewList.length > 0 && reviewList[0].rating !== undefined) {
        const avg =
          reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) /
          reviewList.length;
        setAverageRating(avg);
      } else {
        setAverageRating(null);
      }
      // If user has already reviewed, set their review
      if (user) {
        const myReview = reviewList.find((r) => r.userId === user.uid);
        setUserReview(myReview || null);
        setUserRating(myReview?.rating || 0);
        setReviewInput(myReview?.comment || "");
      }
    }
    fetchReviews();
  }, [id, db, user, reviewLoading]);

  // Submit review+rating (only once)
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user || !id || !reviewInput.trim() || userRating === 0) return;
    let userName = user.email;
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        userName = userDoc.data().username || user.email;
      }
    } catch {
      // Ignore error if user doc not found
    }
    const reviewsRef = collection(db, "tutorials", id, "reviews");
    await addDoc(reviewsRef, {
      userId: user.uid,
      userName,
      comment: reviewInput.trim(),
      rating: userRating,
      createdAt: Date.now(),
    });
    setReviewLoading((v) => !v); // trigger refresh
  };

  const startQuiz = (level) => {
    setQuizLevel(level);
    setUserAnswers([]);
    setScore(null);
    setShowQuiz(true);
  };

  const handleAnswer = (qIdx, optIdx) => {
    const updated = [...userAnswers];
    updated[qIdx] = optIdx;
    setUserAnswers(updated);
  };

  const submitQuiz = async () => {
    if (!quizzes || !quizLevel) return;
    const questions = quizzes[quizLevel] || [];
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });
    setScore(correct);
    // Save quiz result to Firestore for user profile
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      let userName = user?.email || "Anonymous";
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            userName = userDoc.data().username || user.email;
          }
        } catch {
          // Ignore error if user doc not found
        }
        await saveQuizResult(id, {
          userId: user.uid,
          userName,
          level: quizLevel,
          score: correct,
          answers: userAnswers,
          submittedAt: Date.now(),
        });
      }
    } catch {
      // Ignore errors for now
    }
  };

  if (loading) return <div className="text-blue-500">লোড হচ্ছে...</div>;
  if (!tutorial)
    return <div className="text-red-500">টিউটোরিয়াল পাওয়া যায়নি</div>;

  return (
    <section className="max-w-3xl mx-auto py-8 px-2">
      <div className="flex flex-col">
        <h2 className="text-3xl font-extrabold mb-2 text-blue-900">
          {tutorial.title}
        </h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {tutorial.tags &&
            tutorial.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-500 rounded px-2 py-0.5 text-xs"
              >
                #{tag}
              </span>
            ))}
        </div>
        {tutorial.image && (
          <img
            src={tutorial.image}
            alt="Tutorial"
            className="w-40 h-40 object-cover rounded-lg border border-blue-100 mb-4"
          />
        )}
        <div
          className="prose max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: tutorial.content }}
        />
        {/* Guideline box for review/rating rules */}
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
          <h4 className="font-bold text-blue-700 mb-1">
            রেটিং ও রিভিউ নিয়মাবলী
          </h4>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>
              আপনি শুধুমাত্র একবার রেটিং ও রিভিউ দিতে পারবেন এবং রেটিং ও মন্তব্য
              একসাথে দিতে হবে।
            </li>
            <li>নিজের টিউটোরিয়ালে রেটিং বা রিভিউ দেওয়া যাবে না।</li>
           
          </ul>
        </div>
        {/* Ratings & Reviews Section */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
          <h3 className="font-bold text-lg mb-2 text-blue-900">
            রেটিং ও রিভিউ
          </h3>
          {averageRating !== null && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-500 text-xl font-bold">
                ★ {averageRating.toFixed(1)}
              </span>
              <span className="text-blue-700 text-sm">
                ({reviews.length} রিভিউ)
              </span>
            </div>
          )}
          {/* Review/rating form for logged-in users, but not for the creator or if already reviewed */}
          {user && user.uid !== tutorial.authorId ? (
            userReview ? (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-blue-700">আপনার রিভিউ:</span>
                  <span className="text-yellow-400 text-lg">
                    {"★".repeat(userReview.rating)}
                  </span>
                </div>
                <div className="text-blue-900">{userReview.comment}</div>
                <div className="text-xs text-blue-400 mt-1">
                  {userReview.createdAt
                    ? new Date(userReview.createdAt).toLocaleString()
                    : ""}
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col gap-2 mb-4"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-700 font-semibold">
                    আপনার রেটিং:
                  </span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      className={`text-2xl focus:outline-none ${
                        userRating >= star ? "text-yellow-400" : "text-gray-300"
                      }`}
                      aria-label={`রেট ${star} তারকা`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="আপনার মন্তব্য লিখুন..."
                  className="flex-1 rounded-lg border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  disabled={reviewLoading}
                  maxLength={300}
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
                  disabled={
                    reviewLoading || !reviewInput.trim() || userRating === 0
                  }
                >
                  রিভিউ দিন
                </button>
              </form>
            )
          ) : user && user.uid === tutorial.authorId ? (
            <div className="text-blue-500 mb-3">
              নিজের টিউটোরিয়ালে রিভিউ/রেটিং দেওয়া যাবে না।
            </div>
          ) : (
            <div className="text-blue-500 mb-3"></div>
          )}
          {reviews.length === 0 ? (
            <div className="text-blue-400">এখনো কোনো রিভিউ নেই।</div>
          ) : (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li
                  key={r.id}
                  className="bg-white rounded-lg p-3 border border-blue-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-blue-700">
                      {r.userName}
                    </span>
                    {r.rating > 0 && (
                      <span className="text-yellow-400 text-lg">
                        {"★".repeat(r.rating)}
                      </span>
                    )}
                  </div>
                  <div className="text-blue-900">{r.comment}</div>
                  <div className="text-xs text-blue-400 mt-1">
                    {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Quiz rules and type selection at the bottom */}
        {quizzes && Object.keys(quizzes).length > 0 && (
          <div className="mt-8 flex flex-col md:flex-row gap-6 items-start">
            {/* Quiz rules box */}
            <div className="flex-1 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-xl shadow p-4 text-blue-900 text-sm md:text-base mb-4 md:mb-0">
              <h4 className="font-bold text-blue-700 mb-2">কুইজের নিয়মাবলী</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  প্রতিটি লেভেল (সহজ, মাঝারি, কঠিন) কুইজে অংশ নিতে পারবেন মাত্র
                  ১ বার।
                </li>
                <li>প্রশ্নের অপশন থেকে সঠিকটি নির্বাচন করুন।</li>
                <li>উত্তর সাবমিট করার পর সঠিক ও ভুল উত্তর রঙে দেখানো হবে।</li>
                <li>
                  সহজ: ১ নম্বর, মাঝারি: ২ নম্বর, কঠিন: ৩ নম্বর প্রতি সঠিক
                  উত্তরে।
                </li>
                <li>ফলাফল ও উত্তর বিশ্লেষণ সাবমিটের পর দেখবেন।</li>
              </ul>
            </div>
            {/* Quiz type selection buttons */}
            <div className="w-full md:w-72 flex flex-col gap-2">
              {Object.keys(quizzes).map((level) => (
                <button
                  key={level}
                  className={`w-full px-4 py-2 rounded-lg font-bold shadow transition text-white text-base ${
                    quizResults[level]
                      ? "bg-gray-300 cursor-pointer border border-green-400"
                      : level === "easy"
                      ? "bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400"
                      : level === "medium"
                      ? "bg-gradient-to-r from-yellow-400 to-green-400 hover:from-green-400 hover:to-yellow-400"
                      : "bg-gradient-to-r from-red-400 to-pink-400 hover:from-pink-400 hover:to-red-400"
                  }`}
                  onClick={() => {
                    if (quizResults[level]) {
                      setShowQuiz(true);
                      setQuizLevel(level);
                      setUserAnswers(quizResults[level].answers);
                      setScore(quizResults[level].score);
                    } else {
                      startQuiz(level);
                    }
                  }}
                >
                  {level === "easy"
                    ? "সহজ কুইজ"
                    : level === "medium"
                    ? "মাঝারি কুইজ"
                    : "কঠিন কুইজ"}
                  {quizResults[level] && (
                    <span className="ml-2 text-xs">(ফলাফল দেখুন)</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Quiz Modal/Section */}
        {showQuiz && quizzes && (
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6 border border-blue-100 mt-4">
            {!quizLevel ? (
              <div>
                <h4 className="font-bold text-lg mb-2 text-blue-800">
                  কুইজ লেভেল নির্বাচন করুন
                </h4>
                <div className="flex gap-4">
                  {Object.keys(quizzes).map((level) => (
                    <button
                      key={level}
                      className={`px-4 py-2 rounded-lg font-bold shadow text-white text-base ${
                        quizResults[level]
                          ? "bg-gray-300 cursor-pointer border border-green-400"
                          : level === "easy"
                          ? "bg-gradient-to-r from-green-400 to-blue-400 hover:from-blue-400 hover:to-green-400"
                          : level === "medium"
                          ? "bg-gradient-to-r from-yellow-400 to-green-400 hover:from-green-400 hover:to-yellow-400"
                          : "bg-gradient-to-r from-red-400 to-pink-400 hover:from-pink-400 hover:to-red-400"
                      }`}
                      onClick={() => {
                        if (quizResults[level]) {
                          setQuizLevel(level); // Show result view
                          setUserAnswers(quizResults[level].answers);
                          setScore(quizResults[level].score);
                        } else {
                          startQuiz(level);
                        }
                      }}
                    >
                      {level === "easy"
                        ? "সহজ"
                        : level === "medium"
                        ? "মাঝারি"
                        : "কঠিন"}
                      {quizResults[level] && (
                        <span className="ml-2 text-xs">(ফলাফল দেখুন)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <QuizSection
                quiz={quizzes[quizLevel]}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswers}
                handleAnswer={handleAnswer}
                score={score}
                setScore={setScore}
                submitQuiz={submitQuiz}
                quizLevel={quizLevel}
                setQuizLevel={setQuizLevel}
                setShowQuiz={setShowQuiz}
                isResultView={!!quizResults[quizLevel]}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// QuizSection component for answering and result review
function QuizSection({
  quiz,
  userAnswers,
  setUserAnswers,
  handleAnswer,
  score,
  setScore,
  submitQuiz,
  quizLevel,
  setQuizLevel,
  setShowQuiz,
  isResultView,
}) {
  // Show quiz questions and answers with color feedback
  return (
    <div>
      <h4 className="font-bold text-lg mb-4 text-blue-800">
        {quizLevel === "easy"
          ? "সহজ কুইজ"
          : quizLevel === "medium"
          ? "মাঝারি কুইজ"
          : "কঠিন কুইজ"}
      </h4>
      {quiz.map((q, idx) => (
        <div key={idx} className="mb-5">
          <div className="font-semibold mb-2 text-blue-900">
            {idx + 1}. {q.q}
          </div>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, i) => {
              let optionColor = "border-blue-100 hover:bg-blue-50";
              if (score === null && !isResultView) {
                // Answering time
                if (userAnswers[idx] === i)
                  optionColor = "bg-blue-100 border-blue-400";
              } else {
                // After submit or result view
                if (i === q.answer)
                  optionColor =
                    "bg-green-100 border-green-500 text-green-900 font-bold";
                else if (
                  userAnswers[idx] === i &&
                  userAnswers[idx] !== q.answer
                )
                  optionColor =
                    "bg-red-100 border-red-400 text-red-700 font-bold";
                else optionColor = "border-blue-100";
              }
              return (
                <label
                  key={i}
                  className={`px-3 py-2 rounded cursor-pointer border transition-all ${optionColor}`}
                >
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={userAnswers[idx] === i}
                    onChange={() =>
                      score === null && !isResultView && handleAnswer(idx, i)
                    }
                    className="mr-2"
                    disabled={score !== null || isResultView}
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ))}
      {score === null && !isResultView ? (
        <button
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-blue-500 hover:to-green-400 transition mt-2"
          onClick={submitQuiz}
        >
          সাবমিট করুন
        </button>
      ) : (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-xl p-5 text-center mb-4 shadow">
            <div className="text-2xl font-extrabold text-green-700 mb-2">
              🎉
            </div>
            <div className="text-lg font-bold text-green-800 mb-1">
              আপনার স্কোর: {score} / {quiz.length}
            </div>
            <div className="text-blue-700 text-base">
              নিচে আপনার উত্তর ও সঠিক উত্তর দেখুন
            </div>
          </div>
          <button
            className="block mx-auto bg-gradient-to-r from-blue-400 to-green-400 text-white font-bold px-5 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-400 transition mt-2"
            onClick={() => {
              setQuizLevel(null);
              setUserAnswers([]);
              setScore(null);
              setShowQuiz(false);
            }}
          >
            কুইজ থেকে বের হোন
          </button>
        </div>
      )}
    </div>
  );
}
