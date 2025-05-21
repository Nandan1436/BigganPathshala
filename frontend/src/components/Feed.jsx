import { useState, useEffect } from "react";
import { colors } from "./styles";
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
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const user = auth.currentUser;

const Feed = () => {
  const predefinedPosts = [
    {
      id: 1,
      user: "রাকিব আহমেদ",
      avatar: "🧑🏽‍🔬",
      tag: "ভৌতবিজ্ঞান",
      tagColor: colors.primary,
      content:
        "আজকে আমি নিউটনের প্রথম সূত্র শিখেছি! কোনো বস্তু গতির অবস্থার পরিবর্তন হবে না যদি তার উপর কোনো বাহ্যিক বল প্রয়োগ না করা হয়।",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500&q=80",
      factChecked: true,
      credibility: 5,
      likes: 12,
      dislikes: 1,
      comments: 3,
      time: "10 মিনিট আগে",
      tags: ["নিউটন", "বল", "মেকানিক্স"],
      language: "bn",
      featured: true,
    },
    {
      id: 2,
      user: "সাবিনা খাতুন",
      avatar: "👩🏽‍🎓",
      tag: "জীববিজ্ঞান",
      tagColor: colors.accent1,
      content:
        "কোষ বিভাজন কিভাবে হয়, সেটা কেউ সহজভাবে বুঝিয়ে দিবে? আমি মাইটোসিস আর মিয়োসিস মধ্যে পার্থক্য বুঝতে পারছি না।",
      image:
        "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=500&q=80",
      factChecked: false,
      credibility: 2,
      likes: 5,
      dislikes: 0,
      comments: 8,
      time: "২ ঘণ্টা আগে",
      tags: ["কোষ", "মাইটোসিস", "মিয়োসিস"],
      language: "bn",
      featured: false,
    },
    {
      id: 3,
      user: "তারেক হোসেন",
      avatar: "🧑🏽‍🏫",
      tag: "পরিবেশ বিজ্ঞান",
      tagColor: colors.accent2,
      content:
        "বাংলাদেশে বনায়নের গুরুত্ব অপরিসীম। প্রতি বছর আমাদের যদি ১০% বেশি গাছ লাগাই, তবে ২ বছরে আমাদের পরিবেশের উন্নতি হবে।",
      image:
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=500&q=80",
      factChecked: true,
      credibility: 4,
      likes: 24,
      dislikes: 2,
      comments: 5,
      time: "১ দিন আগে",
      tags: ["বনায়ন", "পরিবেশ"],
      language: "bn",
      featured: true,
    },
  ];
  const [posts, setPosts] = useState(predefinedPosts);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsMap, setCommentsMap] = useState({});

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

  return (
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
          className={`bg-white rounded-2xl shadow-md p-6 mb-6 border ${post.featured ? "border-yellow-400" : "border-gray-200"
            }`}
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

          <div className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</div>

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
            <div className="flex items-center gap-1 text-gray-500">
              💬 {commentsMap[post.id]?.length || 0} মন্তব্য
            </div>
          </div>

          {/* ======== COMMENTS SECTION (ADDED) ======== */}
          <div className="border-t border-[color:var(--primary)] pt-5">
            <h4 className="text-lg font-semibold mb-4 text-[color:var(--primary)]">মন্তব্যসমূহ</h4>

            {/* Comments list */}
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

            {/* Comment input and button */}
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
                  if (e.key === "Enter") handleCommentSubmit(post.id);
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
          {/* ======== END COMMENTS SECTION ======== */}

        </article>
      ))}
    </section>
  );
};

export default Feed;
