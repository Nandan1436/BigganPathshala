import { useState , useEffect } from "react";
import { colors } from "./styles";
import NavBar from "./NavBar";
import React from "react";
import { getDocs , collection } from "firebase/firestore";
import { db } from "../firebase/config";
const Feed = () => {
  // Placeholder feed posts
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
  const [posts,setPosts] = useState(predefinedPosts);

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
  
        // Merge with predefinedPosts, avoid duplicate IDs
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
  
  

  return (
    <section className="max-w-4xl mx-auto p-4">
      {/* Feed header with filters */}
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
          className={`bg-white rounded-2xl shadow-md p-6 mb-6 border ${
            post.featured ? "border-yellow-400" : "border-gray-200"
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
              style={{ backgroundColor: post.tagColor }}
            >
              {post.tag}
            </span>
          </div>
  
          <div className="text-gray-700 mb-4 whitespace-pre-line">
            {post.content}
          </div>
  
          {post.image && (
            <img
              src={post.image}
              alt="blog visual"
              className="rounded-lg mb-4 w-full h-60 object-cover"
            />
          )}
  
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
  
          <div className="flex flex-wrap gap-3 border-t pt-4 text-sm text-gray-600">
            <button className="hover:text-blue-600">📝 সারসংক্ষেপ</button>
            <button className="hover:text-blue-600">🌐 অনুবাদ</button>
            <button className={`hover:text-green-600 ${post.likes > 0 ? "text-green-600 font-bold" : ""}`}>
              👍 {post.likes}
            </button>
            <button className="hover:text-red-500">👎 {post.dislikes}</button>
            <button className="hover:text-yellow-600">🚩</button>
            <button className="hover:text-purple-600">💬 {post.comments}</button>
          </div>
        </article>
      ))}
    </section>
  );
  
};

export default Feed;
