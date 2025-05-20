import { useState } from "react";

const Share = () => {
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2 style={{ fontWeight: 800, fontSize: "2rem", marginBottom: "1.5rem" }}>
        শেয়ার করুন
      </h2>
      {!submitted ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="বিজ্ঞান নিয়ে আপনার তথ্য, খবর, বা কিছু শেয়ার করুন..."
            style={{
              width: "100%",
              minHeight: "90px",
              borderRadius: "1rem",
              border: "1.5px solid #a1c4fd",
              padding: "1rem",
              fontSize: "1.1rem",
              marginBottom: "1rem",
              resize: "vertical",
            }}
            required
          />
          <button
            type="submit"
            style={{
              background: "#a1c4fd",
              color: "#222",
              border: "none",
              borderRadius: "0.7rem",
              padding: "0.7rem 1.5rem",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            শেয়ার করুন
          </button>
        </form>
      ) : (
        <div style={{ color: "#2ecc40", fontWeight: 700, fontSize: "1.1rem" }}>
          আপনার পোস্টটি শেয়ার হয়েছে!
        </div>
      )}
    </div>
  );
};

export default Share;
