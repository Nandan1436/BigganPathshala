import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import {
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
  }, [id]);

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
      if (user) {
        await saveQuizResult(id, {
          userId: user.uid,
          userName: user.displayName || user.email || "Anonymous",
          level: quizLevel,
          score: correct,
          answers: userAnswers,
          submittedAt: Date.now(),
        });
      }
    } catch (err) {
      // Ignore errors for now
    }
  };

  if (loading) return <div className="text-blue-500">লোড হচ্ছে...</div>;
  if (!tutorial)
    return <div className="text-red-500">টিউটোরিয়াল পাওয়া যায়নি</div>;

  return (
    <section className="max-w-2xl mx-auto py-8 px-2">
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
      {/* Practice button */}
      {quizzes && Object.keys(quizzes).length > 0 && (
        <button
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-blue-500 hover:to-green-400 transition mb-6"
          onClick={() => setShowQuiz(!showQuiz)}
        >
          {showQuiz ? "কুইজ বন্ধ করুন" : "Practice on this tutorial"}
        </button>
      )}
      {/* Quiz Modal/Section */}
      {showQuiz && quizzes && (
        <div className="bg-white/95 rounded-xl shadow-lg p-6 border border-blue-100 mt-4">
          {!quizLevel ? (
            <div>
              <h4 className="font-bold text-lg mb-2">
                কুইজ লেভেল নির্বাচন করুন
              </h4>
              <div className="flex gap-4">
                {Object.keys(quizzes).map((level) => (
                  <button
                    key={level}
                    className="bg-gradient-to-r from-blue-400 to-green-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-400 transition"
                    onClick={() => startQuiz(level)}
                  >
                    {level === "easy"
                      ? "সহজ"
                      : level === "medium"
                      ? "মাঝারি"
                      : "কঠিন"}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="font-bold text-lg mb-2">
                Quiz:{" "}
                {quizLevel === "easy"
                  ? "সহজ"
                  : quizLevel === "medium"
                  ? "মাঝারি"
                  : "কঠিন"}
              </h4>
              {(quizzes[quizLevel] || []).map((q, idx) => (
                <div key={idx} className="mb-4">
                  <div className="font-semibold mb-1">
                    {idx + 1}. {q.q}
                  </div>
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt, i) => (
                      <label
                        key={i}
                        className={`px-3 py-2 rounded cursor-pointer border ${
                          userAnswers[idx] === i
                            ? "bg-green-100 border-green-400"
                            : "border-blue-100 hover:bg-blue-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q${idx}`}
                          checked={userAnswers[idx] === i}
                          onChange={() => handleAnswer(idx, i)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {score === null ? (
                <button
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-blue-500 hover:to-green-400 transition"
                  onClick={submitQuiz}
                >
                  সাবমিট করুন
                </button>
              ) : (
                <div className="mt-4 font-bold text-green-700 text-lg">
                  আপনার স্কোর: {score} / {(quizzes[quizLevel] || []).length}
                </div>
              )}
              <button
                className="mt-4 text-blue-500 underline hover:text-blue-700"
                onClick={() => {
                  setQuizLevel(null);
                  setUserAnswers([]);
                  setScore(null);
                }}
              >
                অন্য লেভেল দিন
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
