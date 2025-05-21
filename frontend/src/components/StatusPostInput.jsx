import { useState } from "react";

export default function StatusPostInput() {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Post content cannot be empty");
      return;
    }

    const newPost = {
      id: Date.now(),
      user: "Current User",
      avatar: "🧑🏽‍🔬",
      tag: "ভৌতবিজ্ঞান",
      tagColor: "#00A3FF",
      content: content,
      image: null,
      factChecked: false,
      credibility: 3,
      likes: 0,
      dislikes: 0,
      comments: 0,
      time: "এইমাত্র",
      tags: [],
      language: "bn",
      featured: false,
    };

    const existingPosts = JSON.parse(localStorage.getItem("sciencehub_posts") || "[]");
    localStorage.setItem("sciencehub_posts", JSON.stringify([newPost, ...existingPosts]));

    setContent("");
  };

  const isAuthenticated = !!localStorage.getItem("sciencehub_auth");
  if (!isAuthenticated) return null;

  return (
    <div className="status-post-input max-w-5xl mx-auto px-6 py-4 mt-4">
      <form onSubmit={handleSubmit} className="relative bg-white/90 rounded-2xl shadow-lg p-4 border border-blue-200">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="আপনার মনে কী? বিজ্ঞান সম্পর্কে কিছু শেয়ার করুন..."
          className="w-full min-h-[60px] rounded-lg border border-blue-200 p-3 text-lg placeholder:text-blue-300 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        />
        <button
          type="submit"
          className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold px-3 py-1 rounded-md shadow hover:from-green-400 hover:to-blue-500 transition-all text-sm"
        >
          পোস্ট
        </button>
      </form>
    </div>
  );
}