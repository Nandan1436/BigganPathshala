const Profile = () => {
  // Placeholder user data
  const user = {
    name: "রাকিব",
    credibility: 5,
    badges: ["শিক্ষার্থী", "ফ্যাক্ট-চেকার"],
    posts: 3,
    questions: 2,
    answers: 4,
  };
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: "1.5rem" }}>
        প্রোফাইল
      </h2>
      <div
        style={{
          background: "#f6f8fa",
          borderRadius: "1.2rem",
          boxShadow: "0 2px 8px #a1c4fd22",
          padding: "1.2rem 1.5rem",
          marginBottom: "1.2rem",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "#3a3a3a" }}>
          {user.name}
        </div>
        <div style={{ margin: "0.5rem 0", color: "#888" }}>
          বিশ্বাসযোগ্যতা: {user.credibility}
        </div>
        <div style={{ margin: "0.5rem 0" }}>
          {user.badges.map((badge, i) => (
            <span
              key={i}
              style={{
                background: "#a1c4fd",
                color: "#222",
                borderRadius: "0.5rem",
                padding: "0.2rem 0.7rem",
                marginRight: "0.5rem",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
        <div style={{ marginTop: "1rem", color: "#444" }}>
          <div>পোস্ট: {user.posts}</div>
          <div>প্রশ্ন: {user.questions}</div>
          <div>উত্তর: {user.answers}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
