import { useState } from "react";
import "./App.css";
import Ask from "./components/Ask";
import Feed from "./components/Feed";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import Share from "./components/Share";
import { colors } from "./components/styles";
import SubjectCard from "./components/SubjectCard";
import TopicDetail from "./components/TopicDetail";
import TopicList from "./components/TopicList";

const SUBJECTS = [
  {
    name: "Physics",
    color: "#a1c4fd",
    icon: "⚡",
    topics: [
      {
        id: "motion",
        name: "Motion",
        icon: "🏃",
        description:
          "Learn about motion with simple animations and explanations.",
      },
      {
        id: "force",
        name: "Force",
        icon: "🧲",
        description: "Understand force with basic visualizations.",
      },
      {
        id: "work-energy",
        name: "Work & Energy",
        icon: "🔋",
        description: "Explore work and energy in physics.",
      },
      {
        id: "electricity",
        name: "Electricity",
        icon: "💡",
        description: "Visualize basic electricity concepts.",
      },
    ],
  },
  {
    name: "Chemistry",
    color: "#fbc2eb",
    icon: "🧪",
    topics: [
      {
        id: "molecular-structure",
        name: "Molecular Structure",
        icon: "⚛️",
        description: "See how molecules are structured.",
      },
      {
        id: "naming",
        name: "Naming Molecules",
        icon: "🔤",
        description: "Basics of naming molecules.",
      },
      {
        id: "periodic-table",
        name: "Periodic Table",
        icon: "📊",
        description: "Explore the periodic table visually.",
      },
      {
        id: "reactions",
        name: "Basic Reactions",
        icon: "🔥",
        description: "Visualize simple chemical reactions.",
      },
    ],
  },
  {
    name: "Math",
    color: "#fbc2eb",
    icon: "➗",
    topics: [
      {
        id: "number-types",
        name: "Number Types",
        icon: "🔢",
        description: "Learn about real, integer, rational numbers, etc.",
      },
      {
        id: "equation-solving",
        name: "Equation Solving",
        icon: "🧮",
        description: "Solve basic equations step by step.",
      },
      {
        id: "trigonometry",
        name: "Trigonometry",
        icon: "📐",
        description: "Visualize basic trigonometric concepts.",
      },
    ],
  },
  {
    name: "Biology",
    color: "#b2f7ef",
    icon: "🧬",
    topics: [
      {
        id: "cell",
        name: "Cell Structure",
        icon: "🦠",
        description: "Explore the structure of a cell.",
      },
      {
        id: "cell-division",
        name: "Cell Division",
        icon: "🔬",
        description: "Visualize how cells divide.",
      },
      {
        id: "bio-topics",
        name: "Other Topics",
        icon: "🌱",
        description: "Other important biological topics.",
      },
    ],
  },
  {
    name: "Environmental Science",
    color: "#c2e9fb",
    icon: "🌎",
    topics: [
      {
        id: "env-basics",
        name: "Environmental Basics",
        icon: "🌳",
        description: "Learn about the environment and sustainability.",
      },
    ],
  },
];

export default function App() {
  const [section, setSection] = useState("feed");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #f8faff 60%, #e0e7ef 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 0 4rem 0",
      }}
    >
      <NavBar section={section} setSection={setSection} />
      <main
        style={{
          width: "100%",
          maxWidth: 1000,
          margin: "0 auto",
          marginTop: "2.5rem",
          borderRadius: "2rem",
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 8px 32px rgba(75, 111, 255, 0.10)",
          padding: "2.5rem 2rem 2.5rem 2rem",
          minHeight: 600,
          position: "relative",
        }}
      >
        {section === "feed" && <Feed />}
        {section === "ask" && <Ask />}
        {section === "share" && <Share />}
        {section === "profile" && <Profile />}
        {section === "tutorials" && !selectedSubject && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "clamp(1rem, 3vw, 2rem)",
            }}
          >
            {SUBJECTS.map((subject) => (
              <SubjectCard
                key={subject.name}
                subject={subject.name}
                color={subject.color}
                icon={subject.icon}
                onClick={() => {
                  setSelectedSubject(subject);
                  setSelectedTopic(null);
                }}
              />
            ))}
          </div>
        )}
        {section === "tutorials" && selectedSubject && !selectedTopic && (
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              style={{
                background: "transparent",
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
                borderRadius: "10px",
                padding: "0.5rem 1.2rem",
                marginBottom: "1.5rem",
                cursor: "pointer",
                fontWeight: 600,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = colors.primary;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = colors.primary;
              }}
            >
              ← বিষয়সমূহে ফিরে যান
            </button>
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: colors.dark,
              }}
            >
              {selectedSubject.icon} {selectedSubject.name} টিউটোরিয়াল
            </h2>
            <TopicList
              topics={selectedSubject.topics}
              onSelect={(topic) => setSelectedTopic(topic)}
            />
          </div>
        )}
        {section === "tutorials" && selectedTopic && (
          <TopicDetail
            topic={selectedTopic}
            onBack={() => setSelectedTopic(null)}
          />
        )}
      </main>
    </div>
  );
}
