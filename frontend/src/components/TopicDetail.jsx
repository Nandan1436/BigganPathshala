const topicVisualizations = {
  motion: (
    <div>
      <h3>গতি (Motion) কী?</h3>
      <svg width="320" height="80">
        <circle cx="40" cy="40" r="18" fill="#a1c4fd" />
        <rect x="70" y="35" width="180" height="10" rx="5" fill="#b2f7ef" />
        <circle cx="260" cy="40" r="18" fill="#a1c4fd" />
        <text x="40" y="45" fontSize="13" textAnchor="middle" fill="#333">
          শুরু
        </text>
        <text x="260" y="45" fontSize="13" textAnchor="middle" fill="#333">
          শেষ
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        গতি মানে হলো কোনো কিছু এক জায়গা থেকে অন্য জায়গায় যাওয়া। যেমন, আপনি
        হাঁটছেন বা একটি বল গড়াচ্ছে।
      </p>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>ধরন:</b> সোজা, বৃত্তাকার, দুলুনি
        </li>
        <li>
          <b>উদাহরণ:</b> হাঁটা, গাড়ি চলা, পাখি ওড়া
        </li>
      </ul>
    </div>
  ),
  force: (
    <div>
      <h3>বল (Force) কী?</h3>
      <svg width="320" height="80">
        <rect x="40" y="35" width="40" height="20" fill="#fbc2eb" />
        <line
          x1="90"
          y1="45"
          x2="200"
          y2="45"
          stroke="#a1c4fd"
          strokeWidth="8"
          markerEnd="url(#arrow)"
        />
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L10,5 L0,10" fill="#a1c4fd" />
          </marker>
        </defs>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        বল মানে কোনো কিছু ঠেলা বা টানা। যেমন, বই টেনে টেবিলের ওপর আনা।
      </p>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>একক:</b> Newton (N)
        </li>
        <li>
          <b>ধরন:</b> ঠেলা, টানা, মাধ্যাকর্ষণ
        </li>
      </ul>
    </div>
  ),
  "work-energy": (
    <div>
      <h3>কাজ ও শক্তি (Work & Energy)</h3>
      <svg width="320" height="80">
        <rect x="40" y="55" width="40" height="20" fill="#fbc2eb" />
        <rect x="220" y="15" width="40" height="20" fill="#fbc2eb" />
        <line
          x1="60"
          y1="65"
          x2="240"
          y2="25"
          stroke="#a1c4fd"
          strokeWidth="4"
        />
      </svg>
      <p style={{ marginTop: "1rem" }}>
        কোনো কিছু সরাতে বল লাগলে সেটাই কাজ। শক্তি মানে কাজ করার ক্ষমতা।
      </p>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>সূত্র:</b> কাজ = বল × দূরত্ব
        </li>
        <li>
          <b>শক্তির ধরন:</b> গতিশক্তি, বিভবশক্তি
        </li>
      </ul>
    </div>
  ),
  electricity: (
    <div>
      <h3>বিদ্যুৎ (Electricity)</h3>
      <svg width="320" height="80">
        <circle cx="60" cy="40" r="15" fill="#fbc2eb" />
        <rect x="90" y="35" width="120" height="10" rx="5" fill="#a1c4fd" />
        <circle cx="240" cy="40" r="15" fill="#fbc2eb" />
        <text x="60" y="45" fontSize="13" textAnchor="middle" fill="#333">
          Battery
        </text>
        <text x="240" y="45" fontSize="13" textAnchor="middle" fill="#333">
          Bulb
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        বিদ্যুৎ মানে হলো ইলেকট্রন চলাচল। ব্যাটারি থেকে বাল্বে তারের মাধ্যমে
        বিদ্যুৎ যায়, বাল্ব জ্বলে।
      </p>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>ব্যবহার:</b> আলো, ফ্যান, মোবাইল চার্জ
        </li>
      </ul>
    </div>
  ),
  "molecular-structure": (
    <div>
      <h3>আণবিক গঠন (Molecular Structure)</h3>
      <svg width="180" height="80">
        <circle cx="60" cy="40" r="18" fill="#a1c4fd" />
        <circle cx="120" cy="40" r="18" fill="#fbc2eb" />
        <line x1="78" y1="40" x2="102" y2="40" stroke="#333" strokeWidth="3" />
        <text x="60" y="70" fontSize="13" textAnchor="middle">
          H
        </text>
        <text x="120" y="70" fontSize="13" textAnchor="middle">
          O
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        জলের (H<sub>2</sub>O) অণুতে দুইটি হাইড্রোজেন ও একটি অক্সিজেন থাকে।
      </p>
    </div>
  ),
  naming: (
    <div>
      <h3>মোলিকিউল নামকরণ (Naming Molecules)</h3>
      <p>
        H<sub>2</sub>O: <b>জল</b>
        <br />
        CO<sub>2</sub>: <b>কার্বন ডাই-অক্সাইড</b>
        <br />
        CH<sub>4</sub>: <b>মিথেন</b>
      </p>
      <p>প্রতিটি মোলিকিউলের ইংরেজি নাম ও সংকেত আছে।</p>
    </div>
  ),
  "periodic-table": (
    <div>
      <h3>পর্যায় সারণি (Periodic Table)</h3>
      <svg width="220" height="80">
        <rect x="10" y="10" width="40" height="40" fill="#a1c4fd" />
        <rect x="60" y="10" width="40" height="40" fill="#fbc2eb" />
        <rect x="110" y="10" width="40" height="40" fill="#b2f7ef" />
        <rect x="160" y="10" width="40" height="40" fill="#c2e9fb" />
        <text x="30" y="35" fontSize="18" textAnchor="middle">
          H
        </text>
        <text x="80" y="35" fontSize="18" textAnchor="middle">
          He
        </text>
        <text x="130" y="35" fontSize="18" textAnchor="middle">
          Li
        </text>
        <text x="180" y="35" fontSize="18" textAnchor="middle">
          Be
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        এই সারণিতে সব মৌলিক পদার্থ সাজানো আছে।
      </p>
    </div>
  ),
  reactions: (
    <div>
      <h3>রাসায়নিক বিক্রিয়া (Chemical Reactions)</h3>
      <svg width="220" height="80">
        <text x="10" y="40" fontSize="18">
          H<sub>2</sub>
        </text>
        <text x="50" y="40" fontSize="18">
          +
        </text>
        <text x="70" y="40" fontSize="18">
          O<sub>2</sub>
        </text>
        <text x="110" y="40" fontSize="18">
          →
        </text>
        <text x="140" y="40" fontSize="18">
          H<sub>2</sub>O
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        হাইড্রোজেন ও অক্সিজেন মিলে জল তৈরি হয়।
      </p>
    </div>
  ),
  "number-types": (
    <div>
      <h3>সংখ্যার ধরন (Number Types)</h3>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>প্রাকৃতিক সংখ্যা (ℕ):</b> ১, ২, ৩, ...
        </li>
        <li>
          <b>পূর্ণ সংখ্যা (ℤ):</b> ..., -২, -১, ০, ১, ২, ...
        </li>
        <li>
          <b>ভগ্নাংশ (ℚ):</b> ১/২, ৩/৪
        </li>
        <li>
          <b>বাস্তব সংখ্যা (ℝ):</b> সব সংখ্যা
        </li>
      </ul>
      <svg width="220" height="60">
        <rect x="10" y="30" width="200" height="10" fill="#a1c4fd" />
        <circle cx="30" cy="35" r="6" fill="#fbc2eb" />
        <circle cx="60" cy="35" r="6" fill="#fbc2eb" />
        <circle cx="120" cy="35" r="6" fill="#fbc2eb" />
        <circle cx="200" cy="35" r="6" fill="#fbc2eb" />
      </svg>
      <p style={{ marginTop: "1rem" }}>সব সংখ্যা রেখায় দেখানো যায়।</p>
    </div>
  ),
  "equation-solving": (
    <div>
      <h3>সমীকরণ সমাধান (Equation Solving)</h3>
      <p>২x + ৩ = ৭</p>
      <ol style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>৩ বিয়োগ করুন: ২x = ৪</li>
        <li>২ দিয়ে ভাগ করুন: x = ২</li>
      </ol>
      <svg width="220" height="60">
        <text x="10" y="35" fontSize="18">
          x = ২
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>এভাবে সহজ সমীকরণ সমাধান করা যায়।</p>
    </div>
  ),
  trigonometry: (
    <div>
      <h3>ত্রিকোণমিতি (Trigonometry)</h3>
      <svg width="160" height="100">
        <polygon
          points="20,80 140,80 140,20"
          fill="#c2e9fb"
          stroke="#333"
          strokeWidth="2"
        />
        <text x="80" y="90" fontSize="13" textAnchor="middle">
          ভিত্তি
        </text>
        <text x="150" y="55" fontSize="13" textAnchor="start">
          উচ্চতা
        </text>
        <text x="80" y="35" fontSize="13" textAnchor="middle">
          অবলোম্ব
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        sin(θ) = উচ্চতা / অবলোম্ব
        <br />
        cos(θ) = ভিত্তি / অবলোম্ব
      </p>
    </div>
  ),
  cell: (
    <div>
      <h3>কোষ (Cell)</h3>
      <svg width="160" height="100">
        <ellipse cx="80" cy="50" rx="50" ry="30" fill="#b2f7ef" />
        <circle cx="80" cy="50" r="18" fill="#a1c4fd" />
        <text x="80" y="55" fontSize="13" textAnchor="middle" fill="#fff">
          নিউক্লিয়াস
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>
        কোষের ভেতরে নিউক্লিয়াস থাকে, যা কোষের কাজ নিয়ন্ত্রণ করে।
      </p>
    </div>
  ),
  "cell-division": (
    <div>
      <h3>কোষ বিভাজন (Cell Division)</h3>
      <svg width="220" height="80">
        <ellipse cx="60" cy="40" rx="30" ry="18" fill="#b2f7ef" />
        <ellipse cx="160" cy="40" rx="30" ry="18" fill="#b2f7ef" />
        <circle cx="60" cy="40" r="10" fill="#a1c4fd" />
        <circle cx="160" cy="40" r="10" fill="#a1c4fd" />
      </svg>
      <p style={{ marginTop: "1rem" }}>
        একটি কোষ ভাগ হয়ে দুটি কোষ হয়। এভাবে আমরা বড় হই।
      </p>
    </div>
  ),
  "bio-topics": (
    <div>
      <h3>প্রকাশ (Photosynthesis)</h3>
      <svg width="220" height="80">
        <rect x="40" y="60" width="40" height="10" fill="#a1c4fd" />
        <ellipse cx="60" cy="50" rx="20" ry="10" fill="#b2f7ef" />
        <circle cx="60" cy="40" r="8" fill="#fbc2eb" />
        <text x="60" y="45" fontSize="13" textAnchor="middle">
          পাতা
        </text>
      </svg>
      <p style={{ marginTop: "1rem" }}>গাছ সূর্যের আলো দিয়ে খাবার তৈরি করে।</p>
    </div>
  ),
  "env-basics": (
    <div>
      <h3>পরিবেশ (Environment)</h3>
      <svg width="160" height="100">
        <circle cx="80" cy="50" r="40" fill="#c2e9fb" />
        <rect x="60" y="80" width="40" height="10" fill="#b2f7ef" />
        <rect x="30" y="90" width="100" height="5" fill="#a1c4fd" />
      </svg>
      <p style={{ marginTop: "1rem" }}>
        পরিবেশ মানে আমাদের চারপাশের সবকিছু—বাতাস, পানি, গাছ, প্রাণী।
      </p>
      <ul style={{ textAlign: "left", margin: "1rem auto", maxWidth: 300 }}>
        <li>
          <b>পরিবেশ রক্ষা করুন</b>
        </li>
        <li>
          <b>গাছ লাগান</b>
        </li>
        <li>
          <b>পানি ও বিদ্যুৎ অপচয় করবেন না</b>
        </li>
      </ul>
    </div>
  ),
};

const TopicDetail = ({ topic, onBack }) => {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        background: "#fff",
        borderRadius: "1.2rem",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "2.5rem 2rem",
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "#eee",
          border: "none",
          borderRadius: "0.7rem",
          padding: "0.5rem 1.2rem",
          marginBottom: "1.5rem",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        ← ফিরে যান
      </button>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        {topic.icon} {topic.name}
      </h2>
      <div style={{ fontSize: "1.1rem", color: "#333", lineHeight: 1.7 }}>
        {topicVisualizations[topic.id] || topic.description}
      </div>
    </div>
  );
};

export default TopicDetail;
