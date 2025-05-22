import { useState, useEffect } from "react";
import { colors } from "./styles";
import PostInput from "./input";
import React from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";
import { generateSummaryWithGemini, generateSpeechScriptWithGemini } from "../firebase/firestore";
import DOMPurify from "dompurify";

const auth = getAuth();
const user = auth.currentUser;

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const [summaries, setSummaries] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [summaryError, setSummaryError] = useState({});
  const [speakingPost, setSpeakingPost] = useState(null); // Track which post is being read aloud
  const [speechScripts, setSpeechScripts] = useState({});
  const [speechLoading, setSpeechLoading] = useState({});
  const [speechError, setSpeechError] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blog"));
        const firebasePosts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            user: data.user || "অজ্ঞাত ব্যবহারকারী",
            avatar: data.avatar || "👤",
            tag: data.tag || "সাধারণ",
            tagColor: data.tagColor || colors.primary,
            content: data.content || "",
            image: data.image || "",
            factChecked: data.factChecked ?? false,
            credibility: data.credibility ?? 0,
            likes: data.likes ?? 0,
            dislikes: data.dislikes ?? 0,
            comments: data.comments ?? 0,
            time: data.time || "এইমাত্র",
            tags: data.tags || [],
            featured: data.featured ?? false,
            summary: data.summary || null,
            speechScript: data.speechScript || null,
          };
        });

        setPosts((prev) => {
          const allPosts = [...firebasePosts, ...prev];
          const uniquePostsMap = new Map();
          allPosts.forEach((post) => {
            uniquePostsMap.set(post.id, post);
          });
          return Array.from(uniquePostsMap.values());
        });
        setSummaries((prev) => {
          const newSummaries = {};
          firebasePosts.forEach((post) => {
            if (post.summary) newSummaries[post.id] = post.summary;
          });
          return { ...prev, ...newSummaries };
        });
        setSpeechScripts((prev) => {
          const newScripts = {};
          firebasePosts.forEach((post) => {
            if (post.speechScript) newScripts[post.id] = post.speechScript;
          });
          return { ...prev, ...newScripts };
        });
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleReaction = async (postId, type) => {
    const userActions = JSON.parse(localStorage.getItem("userPostActions") || "{}");
    const prevAction = userActions[postId];

    setPosts((prevPosts) => {
      return prevPosts.map((post) => {
        if (post.id === postId) {
          let likes = post.likes;
          let dislikes = post.dislikes;

          if (prevAction === type) {
            if (type === "like") likes = Math.max(likes - 1, 0);
            if (type === "dislike") dislikes = Math.max(dislikes - 1, 0);
            delete userActions[postId];
          } else {
            if (prevAction === "like") likes = Math.max(likes - 1, 0);
            if (prevAction === "dislike") dislikes = Math.max(dislikes - 1, 0);

            if (type === "like") likes++;
            if (type === "dislike") dislikes++;
            userActions[postId] = type;
          }

          localStorage.setItem("userPostActions", JSON.stringify(userActions));

          if (typeof postId === "string") {
            updateDoc(doc(db, "blog", postId), {
              likes,
              dislikes,
            }).catch((error) => {
              console.error("Error updating reaction:", error);
            });
          }

          return {
            ...post,
            likes,
            dislikes,
          };
        }
        return post;
      });
    });
  };

  useEffect(() => {
    const unsubscribes = posts.map((post) => {
      const commentsRef = collection(db, "blog", post.id.toString(), "comments");
      const q = query(commentsRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const comments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCommentsMap((prev) => ({
          ...prev,
          [post.id]: comments,
        }));
      });

      return unsubscribe;
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [posts]);

  const handleCommentSubmit = async (postId) => {
    const content = commentInputs[postId]?.trim();
    if (!content) return;

    await addDoc(collection(db, "blog", postId.toString(), "comments"), {
      user: user?.displayName || "Anonymous",
      uid: user?.uid || "unknown",
      content,
      createdAt: serverTimestamp(),
    });

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleSummarize = async (postId, content) => {
    if (summaryLoading[postId]) return;

    setSummaryLoading((prev) => ({ ...prev, [postId]: true }));
    setSummaryError((prev) => ({ ...prev, [postId]: null }));

    try {
      const postRef = doc(db, "blog", postId.toString());
      const postSnap = await getDoc(postRef);
      const existingSummary = postSnap.data()?.summary;

      if (existingSummary) {
        setSummaries((prev) => ({
          ...prev,
          [postId]: existingSummary,
        }));
      } else {
        const summaryText = await generateSummaryWithGemini(content);
        await updateDoc(postRef, {
          summary: summaryText || "সারাংশ পাওয়া যায়নি।",
        });

        setSummaries((prev) => ({
          ...prev,
          [postId]: summaryText || "সারাংশ পাওয়া যায়নি।",
        }));
      }
    } catch (error) {
      console.error("Error handling summary:", error);
      setSummaryError((prev) => ({ ...prev, [postId]: "সারাংশ তৈরি বা লোড করতে সমস্যা হয়েছে।" }));
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Function to clean HTML content
  const cleanHTML = (content) => {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(content);
    return div.textContent || div.innerText || "";
  };

  // Function to handle text-to-speech with Gemini-generated script
  const handleGenerateAndSpeak = async (postId, content) => {
    const synth = window.speechSynthesis;

    // If this post is already speaking, stop it
    if (speakingPost === postId) {
      synth.cancel();
      setSpeakingPost(null);
      return;
    }

    // Stop any other speaking post
    if (synth.speaking) {
      synth.cancel();
    }

    // Mark as loading
    setSpeechLoading((prev) => ({ ...prev, [postId]: true }));
    setSpeechError((prev) => ({ ...prev, [postId]: null }));

    try {
      let script = speechScripts[postId];

      // If not already generated, fetch from Firestore or generate
      if (!script) {
        const postRef = doc(db, "blog", postId.toString());
        const postSnap = await getDoc(postRef);
        const existingScript = postSnap.data()?.speechScript;

        if (existingScript) {
          script = existingScript;
          setSpeechScripts((prev) => ({ ...prev, [postId]: script }));
        } else {
          // Clean HTML before generating script
          const cleanContent = cleanHTML(content);
          if (!cleanContent.trim()) {
            throw new Error("No readable content found");
          }

          script = await generateSpeechScriptWithGemini(cleanContent);
          if (!script) {
            throw new Error("Failed to generate speech script");
          }

          // Save to Firestore
          await updateDoc(postRef, {
            speechScript: script,
          });

          setSpeechScripts((prev) => ({ ...prev, [postId]: script }));
        }
      }

      // Speak the script
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "bn-BD";
      utterance.rate = 0.8; // Slower for clarity
      utterance.onend = () => setSpeakingPost(null);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setSpeechError((prev) => ({ ...prev, [postId]: "টেক্সট পড়তে সমস্যা হয়েছে।" }));
        setSpeakingPost(null);
      };

      synth.speak(utterance);
      setSpeakingPost(postId);
    } catch (error) {
      console.error("Speech script error:", error);
      setSpeechError((prev) => ({ ...prev, [postId]: "স্পিচ স্ক্রিপ্ট তৈরি বা পড়তে সমস্যা হয়েছে।" }));
      setSpeakingPost(null);
    } finally {
      setSpeechLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Function to sanitize and render HTML content
  const renderContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'br', 'div'],
      ALLOWED_ATTR: ['href', 'target', 'class'],
    });
    return { __html: sanitizedContent };
  };

  return (
    <>
      <PostInput />
      <section className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">বিজ্ঞান ফিড</h2>
          <div className="space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">সকল</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">জনপ্রিয়</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">নতুন</button>
          </div>
        </div>

        {posts.map((post) => (
          <article
            key={post.id}
            className={`bg-white rounded-2xl shadow-md p-6 mb-6 border ${post.featured ? "border-yellow-400" : "border-gray-200"}`}
          >
            {post.factChecked && (
              <div className="mb-2 text-sm font-semibold text-green-600 flex items-center gap-1">
                <span>✓</span> যাচাইকৃত
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl">{post.avatar}</div>
                <div>
                  <div className="font-semibold text-gray-800">{post.user}</div>
                  <div className="text-sm text-gray-500">{post.time}</div>
                </div>
              </div>
              <span
                className="text-sm font-semibold text-white px-3 py-1 rounded-full"
                style={{ backgroundColor: typeof post.tagColor === "string" ? post.tagColor : colors.primary }}
              >
                {post.tag}
              </span>
            </div>

            <div
              className="text-gray-700 mb-4 whitespace-pre-line"
              dangerouslySetInnerHTML={renderContent(post.content)}
            />

            {summaries[post.id] && !summaryError[post.id] && (
              <div className="mb-4 p-4 bg-yellow-100 rounded-md text-gray-800">
                <strong>সারাংশ: </strong>
                <p>{summaries[post.id]}</p>
              </div>
            )}
            {summaryError[post.id] && (
              <div className="mb-4 p-4 bg-red-100 rounded-md text-gray-800">
                <strong>ত্রুটি: </strong>
                <p>{summaryError[post.id]}</p>
              </div>
            )}
            {speechError[post.id] && (
              <div className="mb-4 p-4 bg-red-100 rounded-md text-gray-800">
                <strong>ত্রুটি: </strong>
                <p>{speechError[post.id]}</p>
              </div>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="blog visual"
                className="rounded-lg mb-4 w-full h-60 object-cover"
              />
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex gap-6 items-center mb-4">
              <button
                onClick={() => handleReaction(post.id, "like")}
                className={`flex items-center gap-1 ${post.likes > 0 ? "text-blue-600" : "text-gray-500"}`}
              >
                👍 {post.likes}
              </button>
              <button
                onClick={() => handleReaction(post.id, "dislike")}
                className={`flex items-center gap-1 ${post.dislikes > 0 ? "text-red-600" : "text-gray-500"}`}
              >
                👎 {post.dislikes}
              </button>
              <button
                onClick={() => handleSummarize(post.id, post.content)}
                disabled={summaryLoading[post.id]}
                className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
              >
                {summaryLoading[post.id] ? "সারাংশ লোড হচ্ছে..." : "সারাংশ"}
              </button>
              <button
                onClick={() => handleGenerateAndSpeak(post.id, post.content)}
                className={`flex items-center gap-1 ${speakingPost === post.id ? "text-green-600" : "text-gray-700"} hover:text-green-800 transition`}
                disabled={speechLoading[post.id]}
                aria-label={speakingPost === post.id ? "টেক্সট পড়া বন্ধ করুন" : "টেক্সট পড়ুন"}
              >
                {speakingPost === post.id
                  ? "🛑 বন্ধ করুন"
                  : speechLoading[post.id]
                  ? "লোড হচ্ছে..."
                  : "🔊 শুনুন"}
              </button>
            </div>

            <div className="border-t border-[color:var(--primary)] pt-5">
              <h4 className="text-lg font-semibold mb-4 text-[color:var(--primary)]">মন্তব্যসমূহ</h4>

              <div className="max-h-40 overflow-y-auto mb-5 space-y-3 pr-1">
                {(commentsMap[post.id] || []).length === 0 ? (
                  <p className="text-sm italic text-[color:var(--gray)]">কোনো মন্তব্য নেই। প্রথমে মন্তব্য করুন!</p>
                ) : (
                  (commentsMap[post.id] || []).map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-[color:var(--light)] rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-[color:var(--secondary)]">{comment.user}</span>
                        <span className="text-xs text-[color:var(--gray)]">
                          {comment.createdAt?.seconds
                            ? new Date(comment.createdAt.seconds * 1000).toLocaleString("bn-BD")
                            : ""}
                        </span>
                      </div>
                      <p className="text-[color:var(--dark)]">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="মন্তব্য লিখুন..."
                  className="w-full border border-[color:var(--gray)] bg-[color:var(--light)] text-[color:var(--dark)] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] transition"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit(post.id);
                    }
                  }}
                />
                <button
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
                  onClick={() => handleCommentSubmit(post.id)}
                >
                  পাঠান
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default Feed;