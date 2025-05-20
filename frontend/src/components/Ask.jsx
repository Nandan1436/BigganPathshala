import { useState } from "react";
import React from "react";
const Ask = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("ভৌতবিজ্ঞান");
  const [submitted, setSubmitted] = useState(false);

  // Recent questions (sample data)
  const recentQuestions = [
    {
      id: 1,
      user: "নাজমুল",
      avatar: "👨🏽‍🔬",
      question: "কেন আকাশ নীল?",
      category: "ভৌতবিজ্ঞান",
      answers: 3,
      time: "2 ঘন্টা আগে",
    },
    {
      id: 2,
      user: "রহিমা",
      avatar: "👩🏽‍🎓",
      question: "কিভাবে গাছপালা খাবার তৈরি করে?",
      category: "জীববিজ্ঞান",
      answers: 1,
      time: "5 ঘন্টা আগে",
    },
  ];

  return (
    <section className="science-hub-ask">
      <div className="ask-header">
        <h2>প্রশ্ন করুন</h2>
        <p>বিজ্ঞান সম্পর্কে আপনার যেকোন জিজ্ঞাসা করুন</p>
      </div>

      {!submitted ? (
        <div className="ask-form">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="ask-textarea"
            required
          />

          <div className="ask-form-options">
            <div className="category-select">
              <label>বিষয়</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="ask-select"
              >
                <option value="ভৌতবিজ্ঞান">ভৌতবিজ্ঞান</option>
                <option value="রসায়ন">রসায়ন</option>
                <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                <option value="গণিত">গণিত</option>
                <option value="পরিবেশ বিজ্ঞান">পরিবেশ বিজ্ঞান</option>
              </select>
            </div>

            <button
              onClick={() => setSubmitted(true)}
              className="ask-submit-button"
            >
              <span role="img" aria-label="Submit">
                📤
              </span>{" "}
              জমা দিন
            </button>
          </div>
        </div>
      ) : (
        <div className="ask-success">
          <div className="ask-success-icon">✅</div>
          <h3>আপনার প্রশ্ন জমা দেওয়া হয়েছে!</h3>
          <p>শীঘ্রই উত্তর পাবেন</p>
          <button
            onClick={() => {
              setQuestion("");
              setSubmitted(false);
            }}
            className="ask-new-button"
          >
            নতুন প্রশ্ন করুন
          </button>
        </div>
      )}

      <div className="recent-questions">
        <h3 className="recent-questions-title">সাম্প্রতিক প্রশ্নসমূহ</h3>

        <div className="question-list">
          {recentQuestions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="question-header">
                <span className="question-avatar">{q.avatar}</span>
                <span className="question-user">{q.user}</span>
                <span className="question-time">{q.time}</span>
              </div>
              <div className="question-content">{q.question}</div>
              <div className="question-footer">
                <span className="question-category">{q.category}</span>
                <span className="question-answers">{q.answers} উত্তর</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ask;
