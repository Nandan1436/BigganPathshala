import { useState } from "react";
import React from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, X } from "lucide-react";

const Ask = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("ভৌতবিজ্ঞান");
  const [submitted, setSubmitted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]); // State for multiple filter tags

  // List of 20 common tags
  const commonTags = [
    "আলো",
    "গতি",
    "বল",
    "তাপ",
    "বিদ্যুৎ",
    "চুম্বকত্ব",
    "মহাকর্ষ",
    "পরমাণু",
    "অণু",
    "রাসায়নিক বিক্রিয়া",
    "কোষ",
    "জিন",
    "উদ্ভিদ",
    "প্রাণী",
    "বাস্তুতন্ত্র",
    "বীজগণিত",
    "জ্যামিতি",
    "জলবায়ু পরিবর্তন",
    "জীববৈচিত্র্য",
    "পুনর্ব্যবহার",
  ];

  // Initial questions data with user vote tracking and tags
  const initialQuestions = [
    {
      id: 1,
      user: "নাজমুল",
      avatar: "👨🏽‍🔬",
      question: "কেন আকাশ নীল?",
      category: "ভৌতবিজ্ঞান",
      tags: ["আলো", "বায়ুমণ্ডল"],
      upvotes: 24,
      downvotes: 2,
      time: "2 ঘন্টা আগে",
      showComments: false,
      userVote: null,
      commentList: [
        {
          id: 101,
          user: "ফারহানা",
          avatar: "👩🏽‍🔬",
          content: "এটা রেইলি স্ক্যাটারিং-এর কারণে হয়।",
          upvotes: 7,
          downvotes: 0,
          time: "1 ঘন্টা আগে",
          userVote: null,
        },
        {
          id: 102,
          user: "রাকিব",
          avatar: "👨🏽‍🎓",
          content: "আকাশের নীল রঙ সূর্যের আলোর ছোট তরঙ্গদৈর্ঘ্য বিক্ষেপণের কারণে।",
          upvotes: 5,
          downvotes: 1,
          time: "45 মিনিট আগে",
          userVote: null,
        },
        {
          id: 103,
          user: "নাফিসা",
          avatar: "👩🏽‍🏫",
          content: "সূর্যের আলো বিভিন্ন রঙের মধ্যে থেকে বায়ুমণ্ডল নীল রঙের আলোকে বেশি ছড়িয়ে দেয়, তাই আকাশ নীল দেখায়।",
          upvotes: 12,
          downvotes: 0,
          time: "30 মিনিট আগে",
          userVote: null,
        },
      ],
    },
    {
      id: 2,
      user: "রহিমা",
      avatar: "👩🏽‍🎓",
      question: "কিভাবে গাছপালা খাবার তৈরি করে?",
      category: "জীববিজ্ঞান",
      tags: ["উদ্ভিদ", "কোষ"],
      upvotes: 18,
      downvotes: 1,
      time: "5 ঘন্টা আগে",
      showComments: false,
      userVote: null,
      commentList: [
        {
          id: 201,
          user: "আজিজ",
          avatar: "👨🏽‍🏫",
          content: "গাছপালা সালোকসংশ্লেষণ প্রক্রিয়ার মাধ্যমে সূর্যের আলো, পানি এবং কার্বন ডাই অক্সাইড থেকে গ্লুকোজ তৈরি করে।",
          upvotes: 9,
          downvotes: 0,
          time: "3 ঘন্টা আগে",
          userVote: null,
        },
      ],
    },
  ];

  // State for questions
  const [questions, setQuestions] = useState(initialQuestions);

  // Handle question vote
  const handleQuestionVote = (questionId, voteType) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === questionId) {
          if (q.userVote === voteType) {
            return {
              ...q,
              upvotes: voteType === "up" ? q.upvotes - 1 : q.upvotes,
              downvotes: voteType === "down" ? q.downvotes - 1 : q.downvotes,
              userVote: null,
            };
          } else if (q.userVote !== null) {
            return {
              ...q,
              upvotes: voteType === "up" ? q.upvotes + 1 : q.userVote === "up" ? q.upvotes - 1 : q.upvotes,
              downvotes: voteType === "down" ? q.downvotes + 1 : q.userVote === "down" ? q.downvotes - 1 : q.downvotes,
              userVote: voteType,
            };
          } else {
            return {
              ...q,
              upvotes: voteType === "up" ? q.upvotes + 1 : q.upvotes,
              downvotes: voteType === "down" ? q.downvotes + 1 : q.downvotes,
              userVote: voteType,
            };
          }
        }
        return q;
      })
    );
  };

  // Toggle comments visibility
  const toggleComments = (questionId) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === questionId) {
          return { ...q, showComments: !q.showComments };
        }
        return q;
      })
    );
  };

  // Handle comment vote
  const handleCommentVote = (questionId, commentId, voteType) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === questionId) {
          const updatedComments = q.commentList.map(c => {
            if (c.id === commentId) {
              if (c.userVote === voteType) {
                return {
                  ...c,
                  upvotes: voteType === "up" ? c.upvotes - 1 : c.upvotes,
                  downvotes: voteType === "down" ? c.downvotes - 1 : c.downvotes,
                  userVote: null,
                };
              } else if (c.userVote !== null) {
                return {
                  ...c,
                  upvotes: voteType === "up" ? c.upvotes + 1 : c.userVote === "up" ? c.upvotes - 1 : c.upvotes,
                  downvotes: voteType === "down" ? c.downvotes + 1 : c.userVote === "down" ? c.downvotes - 1 : c.downvotes,
                  userVote: voteType,
                };
              } else {
                return {
                  ...c,
                  upvotes: voteType === "up" ? c.upvotes + 1 : c.upvotes,
                  downvotes: voteType === "down" ? c.downvotes + 1 : c.downvotes,
                  userVote: voteType,
                };
              }
            }
            return c;
          });
          return { ...q, commentList: updatedComments };
        }
        return q;
      })
    );
  };

  // Add new comment
  const addComment = (questionId) => {
    if (!newComment.trim()) return;

    setQuestions(prevQuestions =>
      prevQuestions.map(q => {
        if (q.id === questionId) {
          const newCommentObj = {
            id: Date.now(),
            user: "গেস্ট",
            avatar: "👤",
            content: newComment,
            upvotes: 0,
            downvotes: 0,
            time: "এইমাত্র",
            userVote: null,
          };
          return {
            ...q,
            commentList: [...q.commentList, newCommentObj],
          };
        }
        return q;
      })
    );

    setNewComment("");
  };

  // Submit new question
  const submitQuestion = () => {
    if (!question.trim()) return;

    const newQuestionObj = {
      id: Date.now(),
      user: "গেস্ট",
      avatar: "👤",
      question: question,
      category: category,
      tags: selectedTags,
      upvotes: 0,
      downvotes: 0,
      time: "এইমাত্র",
      showComments: false,
      userVote: null,
      commentList: [],
    };

    setQuestions(prevQuestions => [newQuestionObj, ...prevQuestions]);
    setQuestion("");
    setSelectedTags([]);
    setSubmitted(true);
  };

  // Handle tag selection for new questions
  const handleTagSelect = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a selected tag for new questions
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Handle filter tag selection
  const handleFilterTagSelect = (tag) => {
    if (tag && !selectedFilterTags.includes(tag) && selectedFilterTags.length < 3) {
      setSelectedFilterTags([...selectedFilterTags, tag]);
    }
  };

  // Remove a selected filter tag
  const removeFilterTag = (tag) => {
    setSelectedFilterTags(selectedFilterTags.filter(t => t !== tag));
  };

  // Update tag input when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSelectedTags([]);
  };

  // Filter questions based on selected filter tags
  const filteredQuestions = selectedFilterTags.length > 0
    ? questions.filter(q => q.tags.some(tag => selectedFilterTags.includes(tag)))
    : questions;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
          প্রশ্ন করুন
        </h2>
        <p className="text-blue-800 mt-2">বিজ্ঞান সম্পর্কে আপনার যেকোন জিজ্ঞাসা করুন</p>
      </div>

      {!submitted ? (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-blue-100">
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="w-full p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all resize-none h-40 focus:outline-none"
            required
          />
          <div className="flex flex-col mt-4 gap-4">
            <div className="w-full">
              <label className="block text-blue-800 font-medium mb-1">বিষয়</label>
              <select
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                className="w-full sm:w-48 bg-white p-2 rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all appearance-none focus:outline-none cursor-pointer"
              >
                <option value="ভৌতবিজ্ঞান">ভৌতবিজ্ঞান</option>
                <option value="রসায়ন">রসায়ন</option>
                <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                <option value="গণিত">গণিত</option>
                <option value="পরিবেশ বিজ্ঞান">পরিবেশ বিজ্ঞান</option>
              </select>
            </div>

            {/* Tag selection with dropdown */}
            <div className="w-full">
              <label className="block text-blue-800 font-medium mb-1">
                ট্যাগ নির্বাচন করুন (সর্বোচ্চ ৩টি)
              </label>
              <select
                onChange={e => handleTagSelect(e.target.value)}
                value=""
                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
              >
                <option value="" disabled>
                  ট্যাগ নির্বাচন করুন
                </option>
                {commonTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 focus:outline-none"
                      aria-label={`Remove ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <button
                onClick={submitQuestion}
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-md shadow transition-all flex items-center justify-center gap-2"
                disabled={!question.trim()}
                type="button"
              >
                <span role="img" aria-label="Submit">
                  📤
                </span>
                জমা দিন
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-blue-100 flex flex-col items-center text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mb-2">
            আপনার প্রশ্ন জমা দেওয়া হয়েছে!
          </h3>
          <p className="text-blue-800 mb-6">শীঘ্রই উত্তর পাবেন</p>
          <button
            onClick={() => {
              setQuestion("");
              setSelectedTags([]);
              setSubmitted(false);
            }}
            className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-md shadow transition-all"
            type="button"
          >
            নতুন প্রশ্ন করুন
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mb-4">
          সাম্প্রতিক প্রশ্নসমূহ
        </h3>

        {/* Tag filter with dropdown and chips */}
        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2">
            ট্যাগ দ্বারা ফিল্টার করুন (সর্বোচ্চ ৩টি)
          </label>
          <select
            onChange={e => handleFilterTagSelect(e.target.value)}
            value=""
            className="w-full sm:w-48 bg-white p-2 rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all appearance-none focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              ট্যাগ নির্বাচন করুন
            </option>
            {commonTags
              .filter(tag => !selectedFilterTags.includes(tag))
              .map(tag => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedFilterTags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  onClick={() => removeFilterTag(tag)}
                  className="ml-1 focus:outline-none"
                  aria-label={`Remove ${tag}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map(q => (
              <div
                key={q.id}
                className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{q.avatar}</span>
                    <span className="font-medium text-blue-800">{q.user}</span>
                  </div>
                  <span className="text-sm text-blue-600">{q.time}</span>
                </div>
                <div className="text-lg font-medium text-blue-900 mb-3">{q.question}</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white text-xs px-2 py-1 rounded-full">
                    {q.category}
                  </span>
                  {q.tags &&
                    q.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuestionVote(q.id, "up")}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${
                          q.userVote === "up"
                            ? "bg-green-100 text-green-700"
                            : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                        }`}
                        aria-label="Upvote"
                        type="button"
                      >
                        <ThumbsUp size={16} className={q.userVote === "up" ? "fill-green-700" : ""} />
                      </button>
                      <span className="text-sm font-medium">{q.upvotes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleQuestionVote(q.id, "down")}
                        className={`flex items-center justify-center p-1 rounded-full transition-all ${
                          q.userVote === "down"
                            ? "bg-red-100 text-red-700"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                        }`}
                        aria-label="Downvote"
                        type="button"
                      >
                        <ThumbsDown size={16} className={q.userVote === "down" ? "fill-red-700" : ""} />
                      </button>
                      <span className="text-sm font-medium">{q.downvotes}</span>
                    </div>
                    <button
                      onClick={() => toggleComments(q.id)}
                      className="flex items-center gap-1 text-blue-700 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 transition-all"
                      aria-label="Show comments"
                      type="button"
                    >
                      <MessageCircle size={16} className={q.showComments ? "fill-blue-100" : ""} />
                      <span className="text-sm">{q.commentList.length}</span>
                    </button>
                  </div>
                </div>

                {q.showComments && (
                  <div className="mt-4 border-t border-blue-100 pt-3">
                    <div className="mb-3 font-medium text-blue-800">উত্তরসমূহ:</div>
                    <div className="mb-4 flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="আপনার মতামত লিখুন..."
                        className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
                      />
                      <button
                        onClick={() => addComment(q.id)}
                        disabled={!newComment.trim()}
                        className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                      >
                        পাঠান
                      </button>
                    </div>

                    {q.commentList.length > 0 ? (
                      <div className="space-y-3 ml-6">
                        {q.commentList.map(comment => (
                          <div key={comment.id} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span>{comment.avatar}</span>
                                <span className="font-medium">{comment.user}</span>
                              </div>
                              <span className="text-xs text-blue-600">{comment.time}</span>
                            </div>
                            <p className="text-blue-900 mb-2">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleCommentVote(q.id, comment.id, "up")}
                                  className={`flex items-center justify-center p-1 rounded-full transition-all ${
                                    comment.userVote === "up"
                                      ? "bg-green-100 text-green-700"
                                      : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                                  }`}
                                  aria-label="Upvote comment"
                                  type="button"
                                >
                                  <ThumbsUp
                                    size={14}
                                    className={comment.userVote === "up" ? "fill-green-700" : ""}
                                  />
                                </button>
                                <span className="text-xs font-medium">{comment.upvotes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleCommentVote(q.id, comment.id, "down")}
                                  className={`flex items-center justify-center p-1 rounded-full transition-all ${
                                    comment.userVote === "down"
                                      ? "bg-red-100 text-red-700"
                                      : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                                  }`}
                                  aria-label="Downvote comment"
                                  type="button"
                                >
                                  <ThumbsDown
                                    size={14}
                                    className={comment.userVote === "down" ? "fill-red-700" : ""}
                                  />
                                </button>
                                <span className="text-xs font-medium">{comment.downvotes}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-3">
                        কোন উত্তর নেই। প্রথম জন হিসেবে উত্তর দিন!
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-3">
              এই ট্যাগগুলির জন্য কোন প্রশ্ন পাওয়া যায়নি।
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Ask;