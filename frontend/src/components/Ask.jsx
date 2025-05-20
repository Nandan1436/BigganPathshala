import { useState } from "react";
import { colors, shadows } from "./styles";

const Ask = () => {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("ভৌতবিজ্ঞান");
  const [submitted, setSubmitted] = useState(false);

  // For rich input demo
  const [isRichEditor, setIsRichEditor] = useState(false);

  // Recent questions (sample data)
  const recentQuestions = [
    {
      id: 1,
      user: "নাজমুল",
      avatar: "👨🏽",
      question: "কেন আকাশ নীল?",
      category: "ভৌতবিজ্ঞান",
      answers: 3,
      time: "2 ঘন্টা আগে",
    },
    {
      id: 2,
      user: "রহিমা",
      avatar: "👩🏽",
      question: "কিভাবে গাছপালা খাবার তৈরি করে?",
      category: "জীববিজ্ঞান",
      answers: 1,
      time: "5 ঘন্টা আগে",
    },
  ];

  return (
    <div style={{ maxWidth: 650, margin: "0 auto" }}>
      <h2
        style={{
          fontWeight: 800,
          fontSize: "1.8rem",
          color: colors.dark,
          marginBottom: "1.5rem",
        }}
      >
        প্রশ্ন করুন
      </h2>

      {!submitted ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            boxShadow: shadows.card,
            padding: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                background: colors.primary + "33",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              👤
            </div>

            <div style={{ width: "100%" }}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: colors.dark,
                  fontWeight: 600,
                }}
              >
                আপনার প্রশ্নটি লিখুন
              </h3>

              <div style={{ position: "relative", marginBottom: "1rem" }}>
                {isRichEditor ? (
                  <div
                    style={{
                      border: `1px solid ${colors.grayLight}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem",
                        borderBottom: `1px solid ${colors.grayLight}`,
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: colors.gray,
                          padding: "0.3rem",
                        }}
                      >
                        B
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: colors.gray,
                          padding: "0.3rem",
                        }}
                      >
                        I
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: colors.gray,
                          padding: "0.3rem",
                        }}
                      >
                        🔗
                      </button>
                      <button
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: colors.gray,
                          padding: "0.3rem",
                        }}
                      >
                        📷
                      </button>
                    </div>

                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="এখানে আপনার প্রশ্ন লিখুন..."
                      style={{
                        width: "100%",
                        minHeight: "120px",
                        border: "none",
                        padding: "1rem",
                        fontSize: "1.1rem",
                        resize: "none",
                      }}
                      required
                    />

                    <button
                      onClick={() => setIsRichEditor(false)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0.5rem",
                        color: colors.primary,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        textAlign: "left",
                        marginLeft: "1rem",
                      }}
                    >
                      সাধারণ ইনপুট-এ ফিরে যান
                    </button>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="আপনার প্রশ্নটি লিখুন..."
                      style={{
                        width: "100%",
                        minHeight: "90px",
                        borderRadius: "12px",
                        border: `1px solid ${colors.grayLight}`,
                        padding: "1rem",
                        fontSize: "1.1rem",
                        resize: "vertical",
                      }}
                      required
                    />

                    <button
                      onClick={() => setIsRichEditor(true)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: "0.5rem",
                        color: colors.primary,
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <span>✏️</span>
                      <span>রিচ এডিটর ব্যবহার করুন</span>
                    </button>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <label style={{ fontWeight: 600, color: colors.dark }}>
                    বিষয়:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      border: `1px solid ${colors.grayLight}`,
                      cursor: "pointer",
                    }}
                  >
                    <option>ভৌতবিজ্ঞান</option>
                    <option>রসায়ন</option>
                    <option>গণিত</option>
                    <option>জীববিজ্ঞান</option>
                    <option>পরিবেশ বিজ্ঞান</option>
                  </select>
                </div>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent1})`,
                    color: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    padding: "0.8rem 1.8rem",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    boxShadow: shadows.button,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = shadows.large;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = shadows.button;
                  }}
                >
                  <span>❓</span>
                  <span>প্রশ্ন জমা দিন</span>
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              background: colors.light,
              padding: "1rem",
              borderRadius: "12px",
              marginTop: "1.5rem",
            }}
          >
            <h4
              style={{
                margin: "0 0 0.5rem",
                color: colors.dark,
                fontSize: "1rem",
              }}
            >
              🔍 ভালো প্রশ্ন করার টিপস
            </h4>
            <ul
              style={{
                paddingLeft: "1.5rem",
                margin: "0.5rem 0",
                fontSize: "0.95rem",
                color: colors.gray,
              }}
            >
              <li>সহজ ভাষায় লিখুন</li>
              <li>নির্দিষ্ট বিষয় উল্লেখ করুন</li>
              <li>প্রয়োজনে ছবি সংযুক্ত করুন</li>
              <li>আপনি কি পড়াশোনা করেছেন তা উল্লেখ করুন</li>
            </ul>
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "2rem",
            background: "#fff",
            borderRadius: "24px",
            boxShadow: shadows.card,
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
          <h3
            style={{
              color: colors.success,
              fontWeight: 700,
              fontSize: "1.3rem",
              marginBottom: "0.5rem",
            }}
          >
            আপনার প্রশ্নটি জমা হয়েছে!
          </h3>
          <p style={{ color: colors.gray, marginBottom: "1.5rem" }}>
            কমিউনিটি খুব শীঘ্রই উত্তর দেবে।
          </p>
          <button
            onClick={() => setSubmitted(false)}
            style={{
              background: colors.light,
              color: colors.primary,
              border: `2px solid ${colors.primary}`,
              borderRadius: "8px",
              padding: "0.7rem 1.5rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            অন্য প্রশ্ন করুন
          </button>
        </div>
      )}

      {/* Recent questions section */}
      <div>
        <h3
          style={{
            fontWeight: 700,
            color: colors.dark,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🕒</span>
          <span>সাম্প্রতিক প্রশ্নসমূহ</span>
        </h3>

        <div>
          {recentQuestions.map((q) => (
            <div
              key={q.id}
              style={{
                background: "#fff",
                padding: "1.2rem",
                borderRadius: "12px",
                boxShadow: shadows.small,
                marginBottom: "1rem",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = shadows.medium;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = shadows.small;
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: colors.primary + "22",
                    color: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {q.avatar}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: colors.dark,
                      fontSize: "1.1rem",
                    }}
                  >
                    {q.question}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      color: colors.gray,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span>{q.user}</span>
                      <span>•</span>
                      <span>{q.time}</span>
                    </div>

                    <div>
                      <span
                        style={{
                          background: colors.primary + "22",
                          color: colors.primary,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                        }}
                      >
                        {q.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: colors.light,
                    color: colors.gray,
                    borderRadius: "8px",
                    padding: "0.3rem 0.8rem",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    flexShrink: 0,
                  }}
                >
                  <span>💬</span>
                  <span>{q.answers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ask;
