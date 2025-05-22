import { useState, useEffect } from "react";
import { colors } from "./styles";
import PostInput from "./input";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import React from "react";
import {
  collection,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { generateSpeechScriptWithGemini } from "../firebase/firestore";
import DOMPurify from "dompurify";
import CommentComponent from "./CommentComponent";
import SummaryComponent from "./SummaryComponent";
import { formatBanglaTime } from "../utils/timeUtils";

const auth = getAuth();

// Function to update reputation
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

// Function to sync avatar with profilePic
const syncAvatarWithProfilePic = async (blogId, uid) => {
  try {
    const blogRef = doc(db, "blog", blogId);
    const blogSnap = await getDoc(blogRef);
    
    if (!blogSnap.exists()) {
      console.error(`Blog ${blogId} not found`);
      return;
    }

    const blogData = blogSnap.data();
    if (blogData.avatar !== "👤") {
      return;
    }

    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    let profilePic = "👤";
    
    if (userSnap.exists()) {
      profilePic = userSnap.data().profilePic || "👤";
    } else {
      console.warn(`User ${uid} not found, keeping avatar as 👤`);
    }

    await updateDoc(blogRef, { avatar: profilePic });
    console.log(`Updated avatar for blog ${blogId} to ${profilePic}`);
  } catch (error) {
    console.error(`Error syncing avatar for blog ${blogId}:`, error);
  }
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [speakingPost, setSpeakingPost] = useState(null);
  const [speechScripts, setSpeechScripts] = useState({});
  const [speechLoading, setSpeechLoading] = useState({});
  const [speechError, setSpeechError] = useState({});
  const [summaryLoading, setSummaryLoading] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [, setTimeUpdate] = useState(0); // For forcing re-render

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log("Auth state changed:", user ? user.uid : "No user");
    });
    return () => unsubscribe();
  }, []);

  // Periodic re-render for relative time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((prev) => prev + 1);
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Listen for real-time updates to blog posts
  useEffect(() => {
    const postsQuery = query(collection(db, "blog"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const firebasePosts = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          // Sync avatar if it's 👤
          if (data.avatar === "👤" && data.uid) {
            syncAvatarWithProfilePic(docSnapshot.id, data.uid);
          }
          return {
            id: docSnapshot.id,
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
            createdAt: data.createdAt,
            tags: data.tags || [],
            featured: data.featured ?? false,
            summary: data.summary || null,
            speechScript: data.speechScript || null,
          };
        });

        setPosts(firebasePosts);
        setSpeechScripts((prev) => {
          const newScripts = {};
          firebasePosts.forEach((post) => {
            if (post.speechScript) newScripts[post.id] = post.speechScript;
          });
          return { ...prev, ...newScripts };
        });
      },
      (error) => {
        console.error("Error listening to blogs:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleReaction = async (postId, type) => {
    if (!currentUser) {
      console.log("User not logged in");
      return;
    }

    const reactionRef = doc(db, "blog", postId, "reactions", currentUser.uid);
    const postRef = doc(db, "blog", postId);

    try {
      const reactionSnap = await getDoc(reactionRef);
      const prevReaction = reactionSnap.exists() ? reactionSnap.data().type : null;

      const postSnap = await getDoc(postRef);
      const postOwnerUid = postSnap.data().uid;
      if (postOwnerUid === currentUser.uid) {
        console.log("Cannot react to own post");
        return;
      }

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            let likes = post.likes;
            let dislikes = post.dislikes;

            if (prevReaction === type) {
              if (type === "like") likes = Math.max(likes - 1, 0);
              if (type === "dislike") dislikes = Math.max(dislikes - 1, 0);
            } else {
              if (prevReaction === "like") likes = Math.max(likes - 1, 0);
              if (prevReaction === "dislike") dislikes = Math.max(dislikes - 1, 0);
              if (type === "like") likes++;
              if (type === "dislike") dislikes++;
            }

            return { ...post, likes, dislikes };
          }
          return post;
        })
      );

      if (prevReaction === type) {
        await setDoc(reactionRef, { type: null, uid: currentUser.uid, timestamp: new Date() }, { merge: true });
        await updateDoc(postRef, {
          likes: prevReaction === "like" ? increment(-1) : postSnap.data().likes,
          dislikes: prevReaction === "dislike" ? increment(-1) : postSnap.data().dislikes,
        });
        if (prevReaction === "like") {
          await updateUserReputation(db, postOwnerUid, -1);
        } else if (prevReaction === "dislike") {
          await updateUserReputation(db, postOwnerUid, 1);
        }
      } else {
        await setDoc(reactionRef, { type, uid: currentUser.uid, timestamp: new Date() }, { merge: true });
        await updateDoc(postRef, {
          likes: type === "like" ? increment(1) : prevReaction === "like" ? increment(-1) : postSnap.data().likes,
          dislikes: type === "dislike" ? increment(1) : prevReaction === "dislike" ? increment(-1) : postSnap.data().dislikes,
        });
        if (type === "like") {
          await updateUserReputation(db, postOwnerUid, 1);
        } else if (type === "dislike") {
          await updateUserReputation(db, postOwnerUid, -1);
        }
        if (prevReaction === "like") {
          await updateUserReputation(db, postOwnerUid, -1);
        } else if (prevReaction === "dislike") {
          await updateUserReputation(db, postOwnerUid, 1);
        }
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return { ...post, likes: post.likes, dislikes: post.dislikes };
          }
          return post;
        })
      );
    }
  };

  const triggerSummarize = (postId) => {
    setSummaryLoading((prev) => ({ ...prev, [postId]: true }));
    return () => setSummaryLoading((prev) => ({ ...prev, [postId]: false }));
  };

  const cleanHTML = (content) => {
    const div = document.createElement("div");
    div.innerHTML = DOMPurify.sanitize(content);
    return div.textContent || div.innerText || "";
  };

  const handleGenerateAndSpeak = async (postId, content) => {
    const synth = window.speechSynthesis;

    if (speakingPost === postId) {
      synth.cancel();
      setSpeakingPost(null);
      return;
    }

    if (synth.speaking) {
      synth.cancel();
    }

    setSpeechLoading((prev) => ({ ...prev, [postId]: true }));
    setSpeechError((prev) => ({ ...prev, [postId]: null }));

    try {
      let script = speechScripts[postId];

      if (!script) {
        const postRef = doc(db, "blog", postId.toString());
        const postSnap = await getDoc(postRef);
        const existingScript = postSnap.data()?.speechScript;

        if (existingScript) {
          script = existingScript;
          setSpeechScripts((prev) => ({ ...prev, [postId]: script }));
        } else {
          const cleanContent = cleanHTML(content);
          if (!cleanContent.trim()) {
            throw new Error("No readable content found");
          }

          script = await generateSpeechScriptWithGemini(cleanContent);
          if (!script) {
            throw new Error("Failed to generate speech script");
          }

          await updateDoc(postRef, {
            speechScript: script,
          });

          setSpeechScripts((prev) => ({ ...prev, [postId]: script }));
        }
      }

      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = "bn-BD";
      utterance.rate = 0.8;
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

  const renderContent = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "b", "i", "u", "strong", "em", "ul", "ol", "li", "a", "br", "div"],
      ALLOWED_ATTR: ["href", "target", "class"],
    });
    return { __html: sanitizedContent };
  };

  return (
    <>
      <PostInput />
      <section className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">বিজ্ঞান ফিড</h2>
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
                <div className="w-10 h-10">
                  {post.avatar && post.avatar !== "👤" && post.avatar.startsWith("http") ? (
                    <img
                      src={post.avatar}
                      alt={`${post.user} profile picture`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-300"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{post.user}</div>
                  <div className="text-sm text-gray-500">{formatBanglaTime(post.createdAt)}</div>
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

            <SummaryComponent
              postId={post.id}
              content={post.content}
              initialSummary={post.summary}
              onSummarize={() => triggerSummarize(post.id)}
            />

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
              {currentUser ? (
                <>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReaction(post.id, "like")}
                      className={`flex items-center justify-center p-1 rounded-full transition-all ${
                        post.likes > 0 && currentUser ? "bg-green-100 text-green-700" : "text-gray-500 hover:text-green-600 hover:bg-green-50"
                      }`}
                      aria-label="Like post"
                      type="button"
                    >
                      <ThumbsUp size={16} className={post.likes > 0 && currentUser ? "fill-green-700" : ""} />
                    </button>
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleReaction(post.id, "dislike")}
                      className={`flex items-center justify-center p-1 rounded-full transition-all ${
                        post.dislikes > 0 && currentUser ? "bg-red-100 text-red-700" : "text-gray-500 hover:text-red-600 hover:bg-red-50"
                      }`}
                      aria-label="Dislike post"
                      type="button"
                    >
                      <ThumbsDown size={16} className={post.dislikes > 0 && currentUser ? "fill-red-700" : ""} />
                    </button>
                    <span className="text-sm font-medium">{post.dislikes}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">{post.dislikes}</span>
                  </div>
                </>
              )}
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

            <CommentComponent postId={post.id} user={currentUser} />
          </article>
        ))}
      </section>
    </>
  );
};

export default Feed;