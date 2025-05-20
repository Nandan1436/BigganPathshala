const TopicList = ({ topics, onSelect }) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1.5rem",
        marginTop: "2rem",
      }}
    >
      {topics.map((topic) => (
        <div
          key={topic.id}
          className="topic-card"
          style={{
            background: "#f6f8fa",
            borderRadius: "1.2rem",
            boxShadow: "0 4px 16px rgba(75,111,255,0.08)",
            padding: "1.5rem 1.7rem",
            cursor: "pointer",
            minWidth: "180px",
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.15rem",
            transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
            color: "#1f2b49",
            outline: "none",
            border: "1.5px solid #e0e7ef",
          }}
          onClick={() => onSelect(topic)}
        >
          {topic.icon && (
            <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
              {topic.icon}
            </span>
          )}
          {topic.name}
        </div>
      ))}
    </div>
  );
};

export default TopicList;
