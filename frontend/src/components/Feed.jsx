import { useState } from "react";
import { colors, shadows } from "./styles";

const Feed = () => {
  // Placeholder feed posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: "রাকিব আহমেদ",
      avatar: "👨🏽‍🔬",
      tag: "ভৌতবিজ্ঞান",
      tagColor: colors.primary,
      content:
        "আজকে আমি নিউটনের প্রথম সূত্র শিখেছি! কোনো বস্তুর গতির অবস্থার পরিবর্তন হবে না যদি তার উপর কোনো বাহ্যিক বল প্রয়োগ না করা হয়।",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      factChecked: true,
      credibility: 5,
      likes: 12,
      comments: 3,
      time: "10 মিনিট আগে",
    },
    {
      id: 2,
      user: "সাবিনা খাতুন",
      avatar: "👩🏽‍🎓",
      tag: "জীববিজ্ঞান",
      tagColor: colors.accent1,
      content:
        "কোষ বিভাজন কিভাবে হয়, সেটা কেউ সহজভাবে বুঝিয়ে দিবে? আমি মাইটোসিস আর মিয়োসিস মধ্যে পার্থক্য বুঝতে পারছি না।",
      image: null,
      factChecked: false,
      credibility: 2,
      likes: 5,
      comments: 8,
      time: "২ ঘন্টা আগে",
    },
    {
      id: 3,
      user: "তারেক হোসেন",
      avatar: "👨🏽‍🏫",
      tag: "পরিবেশ",
      tagColor: colors.accent2,
      content:
        "বাংলাদেশে বনায়নের গুরুত্ব অপরিসীম। প্রতি বছর আমরা যদি ১০% বেশি গাছ লাগাই, তবে ৫ বছরে আমাদের পরিবেশ এর উন্নতি হবে।",
      image:
        "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
      factChecked: true,
      credibility: 4,
      likes: 24,
      comments: 6,
      time: "১ দিন আগে",
    },
  ]);

  const [likedPosts, setLikedPosts] = useState({});

  const handleLike = (id) => {
    if (likedPosts[id]) {
      setLikedPosts({ ...likedPosts, [id]: false });
      setPosts(
        posts.map((post) =>
          post.id === id ? { ...post, likes: post.likes - 1 } : post
        )
      );
    } else {
      setLikedPosts({ ...likedPosts, [id]: true });
      setPosts(
        posts.map((post) =>
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        )
      );
    }
  };

  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h2 style={{ fontWeight: 800, fontSize: "1.8rem", color: colors.dark }}>
          সায়েন্স ফিড
        </h2>
        <div>
          <select
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              border: `1px solid ${colors.grayLight}`,
              background: "#fff",
              fontWeight: 600,
              color: colors.gray,
              cursor: "pointer",
              boxShadow: shadows.small,
            }}
          >
            <option>সব বিষয়</option>
            <option>ভৌতবিজ্ঞান</option>
            <option>রসায়ন</option>
            <option>গণিত</option>
            <option>জীববিজ্ঞান</option>
            <option>পরিবেশ</option>
          </select>
        </div>
      </div>

      <div
        style={{
          padding: "1rem",
          borderRadius: "15px",
          background: "#fff",
          boxShadow: shadows.small,
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: colors.primary,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
            }}
          >
            👤
          </div>
          <input
            type="text"
            placeholder="বিজ্ঞান নিয়ে কিছু শেয়ার করুন..."
            style={{
              flex: 1,
              border: "none",
              background: colors.light,
              borderRadius: "10px",
              padding: "0.8rem 1rem",
              fontSize: "1rem",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "0.8rem",
          }}
        >
          <button
            style={{
              background: "#fff",
              border: `1px solid ${colors.grayLight}`,
              borderRadius: "8px",
              padding: "0.4rem 0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              cursor: "pointer",
            }}
          >
            <span>📸</span>
            <span>ছবি</span>
          </button>
          <button
            style={{
              background: colors.primary,
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.4rem 1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            শেয়ার
          </button>
        </div>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "#fff",
            borderRadius: "20px",
            boxShadow: shadows.card,
            padding: "1.5rem",
            marginBottom: "1.5rem",
            position: "relative",
            border: post.factChecked
              ? `1px solid ${colors.success}22`
              : undefined,
          }}
          className="post-card"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: post.tagColor + "22",
                color: post.tagColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow: `0 4px 10px ${post.tagColor}22`,
              }}
            >
              {post.avatar}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  color: colors.dark,
                  fontSize: "1.1rem",
                }}
              >
                {post.user}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: colors.gray,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span>{post.time}</span>
                <span
                  style={{
                    background: post.tagColor + "22",
                    color: post.tagColor,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "6px",
                    fontWeight: 600,
                  }}
                >
                  #{post.tag}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              margin: "0.7rem 0 1rem",
              fontSize: "1.1rem",
              lineHeight: 1.5,
              color: colors.dark,
            }}
          >
            {post.content}
          </div>

          {post.image && (
            <div
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                marginBottom: "1rem",
              }}
            >
              <img
                src={post.image}
                alt=""
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0.5rem 0",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}
            >
              <span
                onClick={() => handleLike(post.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  cursor: "pointer",
                  color: likedPosts[post.id] ? colors.secondary : colors.gray,
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>
                  {likedPosts[post.id] ? "❤️" : "🤍"}
                </span>
                <span>{post.likes}</span>
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  color: colors.gray,
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>💬</span>
                <span>{post.comments}</span>
              </span>
            </div>

            <div>
              {post.factChecked && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    color: colors.success,
                    fontWeight: 600,
                    background: colors.success + "15",
                    padding: "0.3rem 0.7rem",
                    borderRadius: "8px",
                  }}
                >
                  <span>✔️</span>
                  <span>ফ্যাক্ট-চেকড</span>
                </span>
              )}
            </div>
          </div>

          {post.credibility > 0 && (
            <div style={{ marginTop: "0.5rem" }}>
              <div
                style={{
                  height: "6px",
                  background: "#eee",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${post.credibility * 20}%`,
                    background:
                      post.credibility >= 4
                        ? colors.success
                        : post.credibility >= 2
                        ? colors.accent2
                        : colors.secondary,
                    borderRadius: "3px",
                  }}
                ></div>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: colors.gray,
                  textAlign: "right",
                  marginTop: "0.3rem",
                }}
              >
                বিশ্বাসযোগ্যতা: {post.credibility}/5
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
