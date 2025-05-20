import { useState } from "react";
import React from "react";
const Profile = () => {
  // Placeholder user data
  const [user] = useState({
    name: "রাকিব আহমেদ",
    avatar: "🧑🏽‍🔬",
    credibility: 5,
    badges: ["বিজ্ঞানী", "ফ্যাক্ট-চেকার", "নিয়মিত অবদানকারী"],
    bio: "আমি বিজ্ঞান শিক্ষক এবং গবেষণায় আগ্রহী। প্রাকৃতিক বিজ্ঞান এবং জীববিজ্ঞানে আমার বিশেষ আগ্রহ।",
    posts: 12,
    questions: 5,
    answers: 28,
    joined: "মার্চ ২০২৩",
    location: "ঢাকা, বাংলাদেশ",
    interests: ["ভৌতবিজ্ঞান", "জীববিজ্ঞান", "মহাকাশ বিজ্ঞান"],
  });

  // Sample activity data
  const [activities] = useState([
    {
      id: 1,
      type: "post",
      title: "নিউটনের গতিসূত্র নিয়ে আলোচনা",
      date: "২ দিন আগে",
      likes: 15,
    },
    {
      id: 2,
      type: "question",
      title: "কোয়ান্টাম কম্পিউটিং কীভাবে কাজ করে?",
      date: "১ সপ্তাহ আগে",
      answers: 3,
    },
    {
      id: 3,
      type: "answer",
      title: "মাইটোকন্ড্রিয়া কীভাবে শক্তি উৎপাদন করে",
      date: "২ সপ্তাহ আগে",
      likes: 7,
    },
  ]);

  // Tabs for profile sections
  const [activeTab, setActiveTab] = useState("activities");

  return (
    <section className="science-hub-profile">
      {/* Profile header section */}
      <div className="profile-header">
        <div className="profile-avatar-large">{user.avatar}</div>
        <div className="profile-header-content">
          <h2 className="profile-name">{user.name}</h2>
          <div className="profile-badges">
            {user.badges.map((badge, index) => (
              <span key={index} className="profile-badge">
                {badge}
              </span>
            ))}
          </div>
          <div className="profile-meta">
            <span className="profile-joined">
              <span role="img" aria-label="Joined">
                📅
              </span>{" "}
              {user.joined}
            </span>
            <span className="profile-location">
              <span role="img" aria-label="Location">
                📍
              </span>{" "}
              {user.location}
            </span>
          </div>
        </div>
      </div>

      {/* Profile statistics */}
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-value">{user.posts}</div>
          <div className="stat-label">ব্লগ</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{user.questions}</div>
          <div className="stat-label">প্রশ্ন</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{user.answers}</div>
          <div className="stat-label">উত্তর</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{user.credibility}</div>
          <div className="stat-label">বিশ্বাসযোগ্যতা</div>
        </div>
      </div>

      {/* Profile bio */}
      <div className="profile-bio">
        <p>{user.bio}</p>
      </div>

      {/* Interest tags */}
      <div className="profile-interests">
        <h3>আগ্রহের বিষয়</h3>
        <div className="profile-tags">
          {user.interests.map((interest, index) => (
            <span key={index} className="profile-tag">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Profile content tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${
            activeTab === "activities" ? "active" : ""
          }`}
          onClick={() => setActiveTab("activities")}
        >
          কার্যক্রম
        </button>
        <button
          className={`profile-tab ${activeTab === "blogs" ? "active" : ""}`}
          onClick={() => setActiveTab("blogs")}
        >
          ব্লগ
        </button>
        <button
          className={`profile-tab ${activeTab === "questions" ? "active" : ""}`}
          onClick={() => setActiveTab("questions")}
        >
          প্রশ্ন
        </button>
        <button
          className={`profile-tab ${activeTab === "answers" ? "active" : ""}`}
          onClick={() => setActiveTab("answers")}
        >
          উত্তর
        </button>
      </div>

      {/* Activity list */}
      <div className="profile-activities">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div className="activity-icon">
              {activity.type === "post" && (
                <span role="img" aria-label="Post">
                  📝
                </span>
              )}
              {activity.type === "question" && (
                <span role="img" aria-label="Question">
                  ❓
                </span>
              )}
              {activity.type === "answer" && (
                <span role="img" aria-label="Answer">
                  💬
                </span>
              )}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-meta">
                <span className="activity-date">{activity.date}</span>
                {activity.likes && (
                  <span className="activity-likes">
                    <span role="img" aria-label="Likes">
                      👍
                    </span>{" "}
                    {activity.likes}
                  </span>
                )}
                {activity.answers && (
                  <span className="activity-answers">
                    <span role="img" aria-label="Answers">
                      💬
                    </span>{" "}
                    {activity.answers}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Profile;
