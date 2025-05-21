import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTutorials } from "../firebase/firestore";
import React from "react";
export default function TutorialList() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  // For future: filtering state
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true);
      const data = await getTutorials();
      setTutorials(data);
      setLoading(false);
    }
    fetchTutorials();
  }, []);

  // Filtered tutorials (simple search/tag demo)
  const filtered = tutorials.filter(
    (tut) =>
      (!search || tut.title.toLowerCase().includes(search.toLowerCase())) &&
      (!tag || (tut.tags && tut.tags.includes(tag)))
  );

  // Collect all tags for filter
  const allTags = Array.from(new Set(tutorials.flatMap((t) => t.tags || [])));

  return (
    <section className="w-full min-h-[80vh] px-2 py-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Intro box */}
      <div className="w-full max-w-4xl mx-auto mb-8">
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
      {/* Stylish filter bar at the top */}
      <div className="w-full max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/95 border border-blue-100 rounded-2xl shadow-lg px-4 py-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 shadow-sm">
            <span className="text-blue-400 text-xl">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিরোনাম দিয়ে খুঁজুন..."
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-base text-blue-900 placeholder:text-blue-300"
            />
          </div>
          {/* Tag filter */}
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-green-50 rounded-lg px-3 py-2 border border-green-100 shadow-sm">
            <span className="font-semibold text-green-700 md:mr-2">
              🏷️ ট্যাগ
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                  !tag
                    ? "bg-green-200 text-green-800 border-green-300"
                    : "bg-white border-green-100 text-green-500 hover:bg-green-50"
                }`}
                onClick={() => setTag("")}
              >
                সব
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
                    tag === t
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white border-green-100 text-green-500 hover:bg-green-50"
                  }`}
                  onClick={() => setTag(t)}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>
          {/* Sort */}
          <div className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 shadow-sm">
            <span className="font-semibold text-blue-700 md:mr-2">
              🔽 সাজান
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-blue-200 p-2 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="newest">নতুন</option>
              <option value="oldest">পুরাতন</option>
            </select>
          </div>
          {/* New tutorial button */}
          <Link
            to="/tutorial/new"
            className="block bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-2 rounded-xl shadow hover:from-green-400 hover:to-blue-500 transition-all text-center whitespace-nowrap"
          >
            <span className="mr-1">➕</span> নতুন টিউটোরিয়াল
          </Link>
        </div>
      </div>
      {/* Tutorial list */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-blue-500 text-xl text-center py-16">
              লোড হচ্ছে...
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-blue-500 text-center py-16">
              কোনো টিউটোরিয়াল পাওয়া যায়নি
            </div>
          ) : (
            filtered
              .sort((a, b) =>
                sort === "newest"
                  ? b.createdAt - a.createdAt
                  : a.createdAt - b.createdAt
              )
              .map((tut) => (
                <div
                  key={tut.id}
                  className="bg-white/90 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition group flex flex-col h-full overflow-hidden"
                >
                  {tut.image && (
                    <img
                      src={tut.image}
                      alt="Tutorial"
                      className="w-full h-40 object-cover rounded-t-2xl border-b border-blue-50 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-blue-900 group-hover:text-green-600 transition-colors line-clamp-2">
                      {tut.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tut.tags &&
                        tut.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-blue-50 text-blue-500 rounded px-2 py-0.5 text-xs font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                    <div
                      className="prose prose-sm max-w-none mb-3 text-blue-900/90 line-clamp-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          tut.content?.slice(0, 200) +
                          (tut.content?.length > 200 ? "..." : ""),
                      }}
                    />
                    <div className="mt-auto pt-2 flex justify-end">
                      <Link
                        to={"/tutorial/" + tut.id}
                        className="text-blue-600 hover:underline font-semibold text-right"
                      >
                        বিস্তারিত দেখুন →
                      </Link>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
}
