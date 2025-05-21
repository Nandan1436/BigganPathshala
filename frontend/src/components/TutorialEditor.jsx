import { useState } from "react";
import ReactQuill from "react-quill";
import React from "react";
import "react-quill/dist/quill.snow.css";
import {
  createTutorial,
  generateQuizzesWithGemini,
  saveTutorialQuizzes,
} from "../firebase/firestore";

const CLOUDINARY_UPLOAD_PRESET = "healthTracker"; // Replace with your Cloudinary preset
const CLOUDINARY_CLOUD_NAME = "ismailCloud"; // Replace with your Cloudinary cloud name

const TutorialGuidelines = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-blue-900/90">
    <h3 className="font-bold text-lg mb-2">
      ভালো টিউটোরিয়াল লেখার জন্য কিছু টিপস:
    </h3>
    <ul className="list-disc pl-6 space-y-1 text-base">
      <li>সহজ ও স্পষ্ট ভাষা ব্যবহার করুন।</li>
      <li>প্রতিটি ধাপ বা ধারণা উদাহরণসহ ব্যাখ্যা করুন।</li>
      <li>প্রয়োজনে ছবি, চার্ট, বা ডায়াগ্রাম যোগ করুন।</li>
      <li>
        গুরুত্বপূর্ণ শব্দ বা বাক্য <b>বোল্ড</b>, <i>ইটালিক</i>,{" "}
        <u>আন্ডারলাইন</u> করুন।
      </li>
      <li>শেষে কুইজ বা অনুশীলনী দিন, যাতে পাঠক নিজেকে যাচাই করতে পারে।</li>
      <li>তথ্যসূত্র বা রেফারেন্স দিন (যদি থাকে)।</li>
    </ul>
  </div>
);

const TutorialEditor = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };
  const handleTagRemove = (tag) => setTags(tags.filter((t) => t !== tag));

  // Cloudinary image upload
  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setLoading(true);
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();
      setImageUrl(file.secure_url);
      setLoading(false);
    }
  };

  // Gemini quiz generation
  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const quizzes = await generateQuizzesWithGemini(content);
      setQuiz(quizzes);
    } catch (err) {
      alert("Quiz generation failed: " + err.message);
    }
    setLoading(false);
  };

  // Firestore tutorial create
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let quizzes = quiz;
      if (!quizzes) {
        quizzes = await generateQuizzesWithGemini(content);
        setQuiz(quizzes);
      }
      // Create the tutorial document (without quiz)
      const tutorialId = await createTutorial({
        title,
        content,
        tags,
        image: imageUrl,
        createdAt: Date.now(),
      });
      // Store quizzes in subcollection
      await saveTutorialQuizzes(tutorialId, quizzes);
      setSuccess(true);
      setTitle("");
      setContent("");
      setTags([]);
      setImage(null);
      setImageUrl("");
      setQuiz(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <section className="max-w-2xl mx-auto py-8 px-2">
      <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mb-4">
        নতুন টিউটোরিয়াল তৈরি করুন
      </h2>
      <TutorialGuidelines />
      {success && (
        <div className="bg-green-100 text-green-800 rounded-lg p-4 mb-4 text-center font-bold">
          ✅ টিউটোরিয়াল সফলভাবে সংরক্ষিত হয়েছে!
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 rounded-2xl shadow-lg p-6 border border-white/60 flex flex-col gap-6"
      >
        <div>
          <label className="block font-semibold text-blue-900 mb-2">
            টিউটোরিয়াল শিরোনাম
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="শিরোনাম লিখুন..."
            className="w-full rounded-lg border border-blue-200 p-3 text-lg font-semibold placeholder:text-blue-300 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-900 mb-2">
            বিষয়বস্তু
          </label>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            className="bg-white rounded-lg"
            placeholder="এখানে আপনার টিউটোরিয়াল লিখুন..."
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>
        <div>
          <label className="block font-semibold text-blue-900 mb-2">
            ছবি যোগ করুন (ঐচ্ছিক)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-blue-900 border border-blue-200 rounded-lg p-2 bg-white/80"
          />
          {loading && (
            <div className="text-blue-500 mt-2">ছবি আপলোড হচ্ছে...</div>
          )}
          {image && (
            <div className="flex items-center gap-4 mt-2">
              <img
                src={image}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-blue-100"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImageUrl("");
                }}
                className="text-red-500 font-bold text-xl hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block font-semibold text-blue-900 mb-2">
            ট্যাগ
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-500 font-semibold rounded-lg px-3 py-0.5 text-sm border border-blue-100 flex items-center gap-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="নতুন ট্যাগ"
              className="rounded-md border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
            >
              যোগ করুন
            </button>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gradient-to-r from-blue-400 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-400 transition-all"
          >
            {showPreview ? "এডিট করুন" : "প্রিভিউ দেখুন"}
          </button>
          <button
            type="button"
            onClick={handleGenerateQuiz}
            className="bg-gradient-to-r from-yellow-400 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-yellow-400 transition-all"
            disabled={loading}
          >
            কুইজ তৈরি করুন
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
            disabled={loading}
          >
            প্রকাশ করুন
          </button>
        </div>
      </form>
      {showPreview && (
        <div className="mt-8 bg-white/90 rounded-2xl shadow-lg p-6 border border-white/60">
          <h3 className="text-2xl font-bold mb-2 text-blue-900">প্রিভিউ</h3>
          <h4 className="text-xl font-semibold mb-2">{title}</h4>
          <div
            className="mb-2 text-blue-900/90 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-lg border border-blue-100 mb-2"
            />
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-50 text-blue-500 font-semibold rounded-lg px-3 py-0.5 text-sm border border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
          {quiz && (
            <div className="mt-4">
              <h5 className="font-bold text-lg mb-2">Quiz Preview</h5>
              {quiz.easy && (
                <div className="mb-4">
                  <div className="font-bold text-blue-700 mb-1">সহজ (Easy)</div>
                  {quiz.easy.map((q, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="font-semibold">{q.q}</div>
                      <ul className="list-disc pl-6">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              i === q.answer ? "font-bold text-green-600" : ""
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {quiz.medium && (
                <div className="mb-4">
                  <div className="font-bold text-yellow-700 mb-1">
                    মাঝারি (Medium)
                  </div>
                  {quiz.medium.map((q, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="font-semibold">{q.q}</div>
                      <ul className="list-disc pl-6">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              i === q.answer ? "font-bold text-green-600" : ""
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              {quiz.hard && (
                <div className="mb-4">
                  <div className="font-bold text-red-700 mb-1">কঠিন (Hard)</div>
                  {quiz.hard.map((q, idx) => (
                    <div key={idx} className="mb-2">
                      <div className="font-semibold">{q.q}</div>
                      <ul className="list-disc pl-6">
                        {q.options.map((opt, i) => (
                          <li
                            key={i}
                            className={
                              i === q.answer ? "font-bold text-green-600" : ""
                            }
                          >
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TutorialEditor;
