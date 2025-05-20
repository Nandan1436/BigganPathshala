import { useState } from "react";
import { colors } from "./styles";
import NavBar from "./NavBar";
import React from "react";
const Feed = () => {
  // Placeholder feed posts
  const [posts] = useState([
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
  ]);

  return (
    <section className="science-hub-feed">
      {/* Feed header with filters */}
      <div className="feed-header">
        <h2>বিজ্ঞান ফিড</h2>
        <div className="feed-filters">
          <button className="active">সকল</button>
          <button>জনপ্রিয়</button>
          <button>নতুন</button>
        </div>
      </div>

      {posts.map((post) => (
        <article
          key={post.id}
          className={`science-hub-blog-card ${
            post.featured ? "featured-post" : ""
          }`}
        >
          {post.factChecked && (
            <div className="fact-checked-badge">
              <span role="img" aria-label="Verified">
                ✓
              </span>{" "}
              যাচাইকৃত
            </div>
          )}

          <div className="science-hub-blog-header">
            <div className="science-hub-avatar">{post.avatar}</div>
            <div className="user-info">
              <div className="science-hub-user">{post.user}</div>
              <div className="science-hub-time">{post.time}</div>
            </div>
            <span
              className="science-hub-badge"
              style={{ background: post.tagColor }}
            >
              {post.tag}
            </span>
          </div>

          <div className="science-hub-blog-content">
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="blog visual"
                className="science-hub-blog-img"
              />
            )}
          </div>

          <div className="science-hub-blog-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="science-hub-tag">
                #{tag}
              </span>
            ))}
          </div>

          <div className="science-hub-blog-actions">
            <button title="সারসংক্ষেপ">
              <span role="img" aria-label="Summarize">
                📝
              </span>{" "}
              সারসংক্ষেপ
            </button>
            <button title="অনুবাদ">
              <span role="img" aria-label="Translate">
                🌐
              </span>{" "}
              অনুবাদ
            </button>
            <button title="পছন্দ" className={post.likes > 0 ? "liked" : ""}>
              <span role="img" aria-label="Upvote">
                👍
              </span>{" "}
              {post.likes}
            </button>
            <button title="অপছন্দ">
              <span role="img" aria-label="Downvote">
                👎
              </span>{" "}
              {post.dislikes}
            </button>
            <button title="মিথ্যা/গুজব চিহ্নিত">
              <span role="img" aria-label="Flag">
                🚩
              </span>
            </button>
            <button title="মন্তব্য">
              <span role="img" aria-label="Comments">
                💬
              </span>{" "}
              {post.comments}
            </button>
          </div>
        </article>
      ))}

      {/* Create Post Button */}
      <div className="create-post-button">
        <button>
          <span role="img" aria-label="Create">
            ✚
          </span>{" "}
          নতুন পোস্ট
        </button>
      </div>
    </section>
  );
};

export default Feed;
