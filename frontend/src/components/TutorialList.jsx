import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { getTutorials } from "../firebase/firestore";
export default function TutorialList() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  // For future: filtering state
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState([]); // For multi-tag
  const [authorSearch, setAuthorSearch] = useState("");
  const [showMyTutorials, setShowMyTutorials] = useState(false);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [best, setBest] = useState(false);
  const [ratingsMap, setRatingsMap] = useState({}); // {tutorialId: {avg, count}}
  const [usernamesMap, setUsernamesMap] = useState({}); // {authorId: username}
  const [myUsername, setMyUsername] = useState("");
  const db = getFirestore();
  // TODO: Replace with actual logged-in user info
  // const currentUser = { name: "Your Name", uid: "CURRENT_USER_UID", username: "your_username" }; // Remove, not needed

  useEffect(() => {
    async function fetchTutorialsAndRatings() {
      setLoading(true);
      const data = await getTutorials();
      setTutorials(data);
      // Fetch ratings for each tutorial
      const ratingsObj = {};
      const authorIds = Array.from(
        new Set(data.map((t) => t.authorId).filter(Boolean))
      );
      // Fetch usernames for all authorIds
      const usernamesObj = {};
      await Promise.all(
        authorIds.map(async (uid) => {
          try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              usernamesObj[uid] = userDoc.data().username || "Unknown";
            }
          } catch {
            // Ignore error if user doc not found
          }
        })
      );
      setUsernamesMap(usernamesObj);
      await Promise.all(
        data.map(async (tut) => {
          const reviewsRef = collection(db, "tutorials", tut.id, "reviews");
          const snap = await getDocs(reviewsRef);
          const reviews = snap.docs.map((doc) => doc.data());
          const count = reviews.length;
          const avg =
            count > 0
              ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / count
              : 0;
          ratingsObj[tut.id] = { avg, count };
        })
      );
      setRatingsMap(ratingsObj);
      setLoading(false);
    }
    fetchTutorialsAndRatings();
  }, [db]);

  useEffect(() => {
    // When showMyTutorials is toggled on, fetch the current user's username
    async function fetchMyUsername() {
      if (!showMyTutorials) return;
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const db = getFirestore();
      // Find user doc by email
      const usersRef = collection(db, "users");
      const allUsersSnap = await getDocs(usersRef);
      let foundUsername = "";
      allUsersSnap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email === user.email) {
          foundUsername = data.username;
        }
      });
      setMyUsername(foundUsername);
    }
    fetchMyUsername();
  }, [showMyTutorials]);

  // Multi-tag filter logic
  const handleTagClick = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Enhanced filtering
  const filtered = tutorials.filter((tut) => {
    // Title search
    const matchesTitle =
      !search || tut.title.toLowerCase().includes(search.toLowerCase());
    // Author username search (using usernamesMap)
    const authorUsername = usernamesMap[tut.authorId]?.toLowerCase() || "";
    const matchesAuthor =
      !authorSearch || authorUsername.includes(authorSearch.toLowerCase());
    // Tag filter
    const matchesTags =
      selectedTags.length === 0 ||
      (tut.tags && selectedTags.every((tg) => tut.tags.includes(tg)));
    // My tutorials: match by username (from myUsername)
    const matchesMyTutorials =
      !showMyTutorials || usernamesMap[tut.authorId] === myUsername;
    // Date range
    const matchesDate =
      (!dateRange.from ||
        new Date(tut.createdAt) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(tut.createdAt) <= new Date(dateRange.to));
    return (
      matchesTitle &&
      matchesAuthor &&
      matchesTags &&
      matchesMyTutorials &&
      matchesDate
    );
  });

  // Use best and default to date sort if not best
  const sorted = [...filtered].sort((a, b) => {
    if (best) {
      // Sort by average rating (from ratingsMap)
      const aAvg = ratingsMap[a.id]?.avg || 0;
      const bAvg = ratingsMap[b.id]?.avg || 0;
      return bAvg - aAvg;
    }
    // Default: newest first
    return b.createdAt - a.createdAt;
  });

  // Collect all tags for filter
  const allTags = Array.from(new Set(tutorials.flatMap((t) => t.tags || [])));

  return (
    <section className="w-full min-h-[80vh]">
      {/* Intro box */}
      <div className="w-full max-w-4xl mx-auto mb-5">
        <div className="bg-gradient-to-r from-blue-100 via-green-50 to-blue-50 border border-blue-200 rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-shrink-0 text-4xl md:text-5xl text-blue-400">
            <span role="img" aria-label="Book">
              📚
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blue-800 mb-1">
              বিজ্ঞান টিউটোরিয়াল ও কুইজ
            </h2>
            <p className="text-blue-700 text-base md:text-lg leading-relaxed">
              এখানে আপনি বিভিন্ন একাডেমিক ও ব্যবহারিক বিজ্ঞান টিউটোরিয়াল পড়তে
              পারবেন, নিজের টিউটোরিয়াল শেয়ার করতে পারবেন এবং প্রতিটি
              টিউটোরিয়ালের জন্য স্বয়ংক্রিয়ভাবে তৈরি কুইজে অংশগ্রহণ করে নিজের
              জ্ঞান যাচাই করতে পারবেন। কুইজে অংশগ্রহণ করলে আপনি স্কোর, স্বীকৃতি
              ও লিডারবোর্ডে জায়গা পাওয়ার সুযোগ পাবেন!
            </p>
          </div>
        </div>
      </div>
      {/* Stylish filter bar - Redesigned 3-column layout */}
      <div className="w-full max-w-7xl mx-auto mb-8 px-1">
        <div className="border border-blue-100 rounded-3xl shadow-2xl px-2 md:px-4 py-4 md:py-6 flex flex-col gap-4 bg-transparent backdrop-blur-sm">
          {/* Responsive grid for filter controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Column 1: Search boxes */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-4 py-2 border border-blue-100 shadow-md focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                <span className="text-green-400 text-xl">👤</span>
                <input
                  type="text"
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  placeholder="লেখকের নাম দিয়ে খুঁজুন"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-base text-green-900 placeholder:text-green-300"
                />
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-4 py-2 border border-blue-100 shadow-md focus-within:ring-2 focus-within:ring-blue-300 transition-all">
                <span className="text-blue-400 text-xl">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="শিরোনাম দিয়ে খুঁজুন"
                  className="flex-1 min-w-0 bg-transparent border-none outline-none text-base text-blue-900 placeholder:text-blue-300"
                />
              </div>
              {/* Date range: compact, less width */}
              <div className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-green-50 rounded-full px-3 py-1 border border-blue-100 shadow-md w-fit self-start">
                <span className="text-blue-400 text-lg">📅</span>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange((r) => ({ ...r, from: e.target.value }))
                  }
                  className="rounded-full border border-blue-200 p-1 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-700 font-semibold shadow-sm w-[110px]"
                />
                <span className="mx-1 text-blue-400">—</span>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange((r) => ({ ...r, to: e.target.value }))
                  }
                  className="rounded-full border border-blue-200 p-1 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none text-blue-700 font-semibold shadow-sm w-[110px]"
                />
              </div>
            </div>
            {/* Column 2: Toggles */}
            <div className="flex flex-col gap-3 items-stretch justify-center">
              <button
                className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-base transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  showMyTutorials
                    ? "bg-gradient-to-r from-blue-500 to-green-400 text-white border-blue-500 scale-105"
                    : "bg-white border-blue-100 text-blue-700 hover:bg-blue-50"
                }`}
                onClick={() => setShowMyTutorials((v) => !v)}
              >
                আমার টিউটোরিয়াল
              </button>
              <button
                className={`w-full px-4 py-3 rounded-xl border-2 font-bold text-base transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 ${
                  best
                    ? "bg-gradient-to-r from-green-500 to-blue-400 text-white border-green-500 scale-105"
                    : "bg-white border-green-100 text-green-700 hover:bg-green-50"
                }`}
                onClick={() => setBest((v) => !v)}
              >
                সেরা টিউটোরিয়াল
              </button>
            </div>
            {/* Column 3: Tag selection (vertical scrollable) */}
            <div className="flex flex-col gap-2 h-40 max-h-48">
              <span className="font-semibold text-green-700 mb-1 flex items-center gap-1">
                🏷️ ট্যাগ নির্বাচন করুন
              </span>
              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50 pr-1">
                {allTags.map((t) => (
                  <button
                    key={t}
                    className={`px-4 py-1.5 whitespace-nowrap rounded-full border text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      selectedTags.includes(t)
                        ? "bg-gradient-to-r from-green-500 to-blue-400 text-white border-green-500 scale-105"
                        : "bg-white border-green-100 text-green-500 hover:bg-green-50"
                    }`}
                    onClick={() => handleTagClick(t)}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* New tutorial button full width */}
          <div className="pt-2">
            <Link
              to="/tutorial/new"
              className="block w-full bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-5 py-3 rounded-2xl shadow-lg hover:from-green-400 hover:to-blue-500 transition-all text-center text-lg border-2 border-white hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="mr-1">➕</span> নতুন টিউটোরিয়াল তৈরি করুন
            </Link>
          </div>
        </div>
      </div>
      {/* Tutorial list - improved grid and card layout */}
      <div className="w-full max-w-7xl mx-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-blue-500 text-xl text-center py-16">
              লোড হচ্ছে...
            </div>
          ) : sorted.length === 0 ? (
            <div className="col-span-full text-blue-500 text-center py-16">
              কোনো টিউটোরিয়াল পাওয়া যায়নি
            </div>
          ) : (
            sorted.map((tut) => {
              // Determine if current user has already reviewed/rated (for UI, not enforced here)
              // This logic should be enforced in TutorialDetail, not here, but can be passed as prop if needed
              return (
                <div
                  key={tut.id}
                  className="relative group flex flex-col h-full overflow-hidden rounded-2xl border border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-200 bg-gradient-to-br from-blue-50/80 via-white/60 to-green-50/80 hover:from-green-100/90 hover:to-blue-100/90 p-0"
                  style={{ minHeight: 340 }}
                >
                  {/* Decorative gradient bar */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 opacity-70 z-10" />
                  {tut.image && (
                    <div className="relative w-full h-36 md:h-40 overflow-hidden flex items-center justify-center">
                      <img
                        src={tut.image}
                        alt="Tutorial"
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110 rounded-t-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent pointer-events-none" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col px-4 pt-3 pb-4 md:px-5 md:pt-4 md:pb-5">
                    <h3 className="text-lg md:text-xl font-bold mb-1 text-blue-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {tut.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {tut.tags &&
                        tut.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-100/70 text-blue-600 rounded-full px-2 py-0.5 text-xs font-semibold border border-blue-200"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                    {/* Author, points, rating, review count */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                        👤 {usernamesMap[tut.authorId] || "Unknown"}
                      </span>

                      {ratingsMap[tut.id] && ratingsMap[tut.id].count > 0 && (
                        <span className="text-xs text-yellow-500 font-semibold flex items-center gap-1">
                          ★ {ratingsMap[tut.id].avg.toFixed(1)}
                          <span className="text-blue-600">
                            ({ratingsMap[tut.id].count})
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      className="prose prose-sm max-w-none mb-2 text-blue-900/90 line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          tut.content?.slice(0, 200) +
                          (tut.content?.length > 200 ? "..." : ""),
                      }}
                    />
                    <div className="mt-auto pt-2 flex justify-end">
                      <Link
                        to={`/tutorial/${tut.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-right hover:text-green-600 transition-colors text-sm md:text-base px-2 py-1 rounded-lg hover:bg-blue-50/60"
                      >
                        বিস্তারিত দেখুন <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                  {/* Subtle shadow on hover */}
                  <div className="absolute inset-0 pointer-events-none rounded-2xl group-hover:shadow-2xl group-hover:shadow-blue-200/40 transition-all duration-200" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
