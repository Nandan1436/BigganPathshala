import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, X } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import React from "react";

// Helper function to update reputation and title
const updateUserReputation = async (db, userId, increment) => {
  const userRef = doc(db, "users", userId);
  const reputationTitles = [
    { max: 50, title: "Newbie" },
    { max: 100, title: "Learner" },
    { max: 250, title: "Contributor" },
    { max: 500, title: "Expert" },
    { max: Infinity, title: "Master" },
  ];

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error(`User ${userId} not found`);
      }
      const currentReputation = userDoc.data().reputation || 0;
      const newReputation = Math.max(0, currentReputation + increment);
      const newTitle = reputationTitles.find(({ max }) => newReputation <= max).title;

      transaction.update(userRef, {
        reputation: newReputation,
        reputationTitle: newTitle,
      });
    });
  } catch (err) {
    console.error(`Error updating reputation for user ${userId}:`, err);
  }
};

const Ask = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("ভৌতবিজ্ঞান");
  const [submitted, setSubmitted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFilterTags, setSelectedFilterTags] = useState([]);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth();

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Fetch questions, comments, and user data
  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      try {
        let fetchedQuestions = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const data = docSnapshot.data();
            let profilePic = "👤";
            let reputationTitle = "Newbie";
            try {
              const userDoc = await getDoc(doc(db, "users", data.uid));
              if (userDoc.exists()) {
                const userData = userDoc.data();
                profilePic = userData.profilePic || "👤";
                reputationTitle = userData.reputationTitle || "Newbie";
              }
            } catch (err) {
              console.error(`Error fetching user data for uid ${data.uid}:`, err);
            }
            return {
              id: docSnapshot.id,
              user: data.user || "অজ্ঞাত ব্যবহারকারী",
              uid: data.uid,
              profilePic,
              reputationTitle,
              question: data.question,
              category: data.category,
              tags: data.tags || [],
              upvotes: data.upvotes || 0,
              downvotes: data.downvotes || 0,
              createdAt: data.createdAt?.toDate()?.toLocaleString("bn-BD") || "এইমাত্র",
              showComments: false,
              userVote: null,
              commentList: [],
              commentCount: data.commentCount || 0,
            };
          })
        );

        // Fetch user votes for questions
        if (user) {
          fetchedQuestions = await Promise.all(
            fetchedQuestions.map(async (question) => {
              try {
                const voteDoc = await getDoc(doc(db, "questions", question.id, "votes", user.uid));
                return {
                  ...question,
                  userVote: voteDoc.exists() ? voteDoc.data().voteType : null,
                };
              } catch (err) {
                console.error(`Error fetching vote for question ${question.id}:`, err);
                return question;
              }
            })
          );
        }

        // Fetch comments and user data for each question
        const commentUnsubscribes = fetchedQuestions.map((question) => {
          const commentsRef = collection(db, "questions", question.id, "comments");
          const commentsQuery = query(commentsRef, orderBy("createdAt", "asc"));
          return onSnapshot(commentsQuery, async (commentSnapshot) => {
            let comments = await Promise.all(
              commentSnapshot.docs.map(async (commentDoc) => {
                const commentData = commentDoc.data();
                let profilePic = "👤";
                let reputationTitle = "Newbie";
                try {
                  const userDoc = await getDoc(doc(db, "users", commentData.uid));
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    profilePic = userData.profilePic || "👤";
                    reputationTitle = userData.reputationTitle || "Newbie";
                  }
                } catch (err) {
                  console.error(`Error fetching user data for comment uid ${commentData.uid}:`, err);
                }
                return {
                  id: commentDoc.id,
                  user: commentData.user || "অজ্ঞাত ব্যবহারকারী",
                  uid: commentData.uid,
                  profilePic,
                  reputationTitle,
                  content: commentData.content,
                  upvotes: commentData.upvotes || 0,
                  downvotes: commentData.downvotes || 0,
                  createdAt: commentData.createdAt?.toDate()?.toLocaleString("bn-BD") || "এইমাত্র",
                  userVote: null,
                };
              })
            );

            // Fetch user votes for comments
            if (user) {
              comments = await Promise.all(
                comments.map(async (comment) => {
                  try {
                    const voteDoc = await getDoc(
                      doc(db, "questions", question.id, "comments", comment.id, "votes", user.uid)
                    );
                    return {
                      ...comment,
                      userVote: voteDoc.exists() ? voteDoc.data().voteType : null,
                    };
                  } catch (err) {
                    console.error(`Error fetching vote for comment ${comment.id}:`, err);
                    return comment;
                  }
                })
              );
            }

            setQuestions((prev) =>
              prev.map((q) =>
                q.id === question.id ? { ...q, commentList: comments } : q
              )
            );
          });
        });

        setQuestions(fetchedQuestions);
        return () => {
          unsubscribe();
          commentUnsubscribes.forEach((unsub) => unsub());
        };
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    });
  }, [user]);

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

  // Handle question vote
  const handleQuestionVote = async (questionId, voteType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const questionRef = doc(db, "questions", questionId);
      const voteRef = doc(db, "questions", questionId, "votes", user.uid);
      const question = questions.find((q) => q.id === questionId);
      let upvotes = question.upvotes;
      let downvotes = question.downvotes;
      let userVote = question.userVote;

      if (userVote === voteType) {
        // Undo vote
        await setDoc(voteRef, { voteType: null });
        upvotes = voteType === "up" ? upvotes - 1 : upvotes;
        downvotes = voteType === "down" ? downvotes - 1 : downvotes;
        userVote = null;
      } else {
        // Remove existing vote (if any)
        if (userVote === "up") upvotes -= 1;
        if (userVote === "down") downvotes -= 1;
        // Add new vote
        await setDoc(voteRef, { voteType });
        upvotes = voteType === "up" ? upvotes + 1 : upvotes;
        downvotes = voteType === "down" ? downvotes + 1 : downvotes;
        userVote = voteType;
      }

      // Update question document
      await updateDoc(questionRef, { upvotes, downvotes });

      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, upvotes, downvotes, userVote } : q
        )
      );
    } catch (err) {
      console.error("Error handling question vote:", err);
    }
  };

  // Toggle comments visibility
  const toggleComments = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id === questionId) {
          return { ...q, showComments: !q.showComments };
        }
        return q;
      })
    );
  };

  // Handle comment vote
  const handleCommentVote = async (questionId, commentId, voteType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const commentRef = doc(db, "questions", questionId, "comments", commentId);
      const voteRef = doc(db, "questions", questionId, "comments", commentId, "votes", user.uid);
      const question = questions.find((q) => q.id === questionId);
      const comment = question.commentList.find((c) => c.id === commentId);
      let upvotes = comment.upvotes;
      let downvotes = comment.downvotes;
      let userVote = comment.userVote;

      if (userVote === voteType) {
        // Undo vote
        await setDoc(voteRef, { voteType: null });
        upvotes = voteType === "up" ? upvotes - 1 : upvotes;
        downvotes = voteType === "down" ? downvotes - 1 : downvotes;
        if (voteType === "up") {
          await updateUserReputation(db, comment.uid, -1); // Decrease reputation
        }
        userVote = null;
      } else {
        // Remove existing vote (if any)
        if (userVote === "up") {
          upvotes -= 1;
          await updateUserReputation(db, comment.uid, -1); // Decrease reputation
        }
        if (userVote === "down") downvotes -= 1;
        // Add new vote
        await setDoc(voteRef, { voteType });
        upvotes = voteType === "up" ? upvotes + 1 : upvotes;
        downvotes = voteType === "down" ? downvotes + 1 : downvotes;
        if (voteType === "up") {
          await updateUserReputation(db, comment.uid, 1); // Increase reputation
        }
        userVote = voteType;
      }

      // Update comment document
      await updateDoc(commentRef, { upvotes, downvotes });

      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                commentList: q.commentList.map((c) =>
                  c.id === commentId ? { ...c, upvotes, downvotes, userVote } : c
                ),
              }
            : q
        )
      );
    } catch (err) {
      console.error("Error handling comment vote:", err);
    }
  };

  // Add new comment
  const addComment = async (questionId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, "questions", questionId.toString(), "comments"), {
        user: user.displayName || "অজ্ঞাত ব্যবহারকারী",
        uid: user.uid,
        profilePic: userData.profilePic || "👤",
        content: newComment,
        upvotes: 0,
        downvotes: 0,
        createdAt: serverTimestamp(),
      });

      const questionRef = doc(db, "questions", questionId.toString());
      await updateDoc(questionRef, {
        commentCount: (questions.find((q) => q.id === questionId)?.commentCount || 0) + 1,
      });

      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Submit new question
  const submitQuestion = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!question.trim()) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      await addDoc(collection(db, "questions"), {
        user: user.displayName || "অজ্ঞাত ব্যবহারকারী",
        uid: user.uid,
        profilePic: userData.profilePic || "👤",
        question,
        category,
        tags: selectedTags,
        upvotes: 0,
        downvotes: 0,
        createdAt: serverTimestamp(),
        commentCount: 0,
      });

      setQuestion("");
      setSelectedTags([]);
      setSubmitted(true);
    } catch (err) {
      console.error("Error adding question:", err);
    }
  };

  // Handle tag selection for new questions
  const handleTagSelect = (tag) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 3) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove a selected tag for new questions
  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  // Handle filter tag selection
  const handleFilterTagSelect = (tag) => {
    if (tag && !selectedFilterTags.includes(tag) && selectedFilterTags.length < 3) {
      setSelectedFilterTags([...selectedFilterTags, tag]);
    }
  };

  // Remove a selected filter tag
  const removeFilterTag = (tag) => {
    setSelectedFilterTags(selectedFilterTags.filter((t) => t !== tag));
  };

  // Update tag input when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSelectedTags([]);
  };

  // Filter questions based on selected filter tags
  const filteredQuestions = selectedFilterTags.length > 0
    ? questions.filter((q) => q.tags.some((tag) => selectedFilterTags.includes(tag)))
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
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন..."
            className="w-full p-4 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all resize-none h-40 focus:outline-none"
            required
          />
          <div className="flex flex-col mt-4 gap-4">
            <div className="w-full">
              <label className="block text-blue-800 font-medium mb-1">বিষয়</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full sm:w-48 bg-white p-2 rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all appearance-none focus:outline-none cursor-pointer"
              >
                <option value="ভৌতবিজ্ঞান">ভৌতবিজ্ঞান</option>
                <option value="রসায়ন">রসায়ন</option>
                <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                <option value="গণিত">গণিত</option>
                <option value="পরিবেশ বিজ্ঞান">পরিবেশ বিজ্ঞান</option>
              </select>
            </div>

            <div className="w-full">
              <label className="block text-blue-800 font-medium mb-1">
                ট্যাগ নির্বাচন করুন (সর্বোচ্চ ৩টি)
              </label>
              <select
                onChange={(e) => handleTagSelect(e.target.value)}
                value=""
                className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
              >
                <option value="" disabled>
                  ট্যাগ নির্বাচন করুন
                </option>
                {commonTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.map((tag) => (
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
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-md shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!user || !question.trim()}
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

        <div className="mb-4">
          <label className="block text-blue-800 font-medium mb-2">
            ট্যাগ দ্বারা ফিল্টার করুন (সর্বোচ্চ ৩টি)
          </label>
          <select
            onChange={(e) => handleFilterTagSelect(e.target.value)}
            value=""
            className="w-full sm:w-48 bg-white p-2 rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all appearance-none focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              ট্যাগ নির্বাচন করুন
            </option>
            {commonTags
              .filter((tag) => !selectedFilterTags.includes(tag))
              .map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
          </select>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedFilterTags.map((tag) => (
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
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="border border-blue-100 rounded-lg p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {q.profilePic && q.profilePic !== "👤" ? (
                      <img
                        src={q.profilePic}
                        alt="User profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-800">{q.user}</span>
                      <span className="text-xs text-blue-600">{q.reputationTitle}</span>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600">{q.createdAt}</span>
                </div>
                <div className="text-lg font-medium text-blue-900 mb-3">{q.question}</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white text-xs px-2 py-1 rounded-full">
                    {q.category}
                  </span>
                  {q.tags &&
                    q.tags.map((tag) => (
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
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "আপনার মতামত লিখুন..." : "মন্তব্য করতে লগইন করুন"}
                        className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
                        disabled={!user}
                      />
                      <button
                        onClick={() => addComment(q.id)}
                        disabled={!user || !newComment.trim()}
                        className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-md shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        type="button"
                      >
                        পাঠান
                      </button>
                    </div>

                    {q.commentList.length > 0 ? (
                      <div className="space-y-3 ml-6">
                        {q.commentList.map((comment) => (
                          <div key={comment.id} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {comment.profilePic && comment.profilePic !== "👤" ? (
                                  <img
                                    src={comment.profilePic}
                                    alt="User profile"
                                    className="w-6 h-6 rounded-full object-cover border-2 border-blue-300"
                                  />
                                ) : (
                                  <span className="text-lg">👤</span>
                                )}
                                <div className="flex flex-col">
                                  <span className="font-medium">{comment.user}</span>
                                  <span className="text-xs text-blue-600">{comment.reputationTitle}</span>
                                </div>
                              </div>
                              <span className="text-xs text-blue-600">{comment.createdAt}</span>
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