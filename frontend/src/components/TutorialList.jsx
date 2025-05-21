import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTutorials } from "../firebase/firestore";
import React from "react";
export default function TutorialList() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true);
      const data = await getTutorials();
      setTutorials(data);
      setLoading(false);
    }
    fetchTutorials();
  }, []);

  return (
    <section className="w-full min-h-[80vh] px-2 py-8 bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Quiz rules explanation */}
      <div className="max-w-3xl mx-auto mb-8 bg-white/80 border border-blue-100 rounded-xl shadow p-5">
        <h3 className="text-xl font-bold text-blue-700 mb-2">কুইজ নিয়মাবলী</h3>
        <ul className="list-disc pl-6 text-blue-900/90 text-base space-y-1">
          <li>প্রতিটি টিউটোরিয়ালের কুইজ বাংলায় থাকবে।</li>
          <li>মোট প্রশ্ন সংখ্যা ১০ থেকে ২৫টি (লেভেলভিত্তিক বিভাজন)।</li>
          <li>
            সহজ (Easy): ৪-১০টি প্রশ্ন, প্রতিটি সঠিক উত্তরে <b>১</b> নম্বর।
          </li>
          <li>
            মাঝারি (Medium): ৩-৮টি প্রশ্ন, প্রতিটি সঠিক উত্তরে <b>২</b> নম্বর।
          </li>
          <li>
            কঠিন (Hard): ৩-৭টি প্রশ্ন, প্রতিটি সঠিক উত্তরে <b>৩</b> নম্বর।
          </li>
          <li>কুইজে অংশগ্রহণ করে আপনি স্কোর ও স্বীকৃতি অর্জন করতে পারবেন।</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent mb-1 drop-shadow-sm">
            📚 সকল টিউটোরিয়াল
          </h2>
          <p className="text-blue-900/80 text-lg font-medium">
            নতুন নতুন বিজ্ঞান টিউটোরিয়াল পড়ুন, শিখুন এবং শেয়ার করুন!
          </p>
        </div>
        <Link
          to="/tutorial/new"
          className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-green-400 hover:to-blue-500 transition-all text-lg"
        >
          + নতুন টিউটোরিয়াল
        </Link>
      </div>
      {loading ? (
        <div className="text-blue-500 text-xl text-center py-16">
          লোড হচ্ছে...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tut) => (
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
          ))}
        </div>
      )}
    </section>
  );
}
