import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTutorial } from "../firebase/firestore";
import React from "react";

export default function TutorialDetail() {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTutorial() {
      setLoading(true);
      const data = await getTutorial(id);
      setTutorial(data);
      setLoading(false);
    }
    fetchTutorial();
  }, [id]);

  if (loading) return <div className="text-blue-500">লোড হচ্ছে...</div>;
  if (!tutorial)
    return <div className="text-red-500">টিউটোরিয়াল পাওয়া যায়নি</div>;

  return (
    <section className="max-w-2xl mx-auto py-8 px-2">
      <h2 className="text-3xl font-extrabold mb-2 text-blue-900">
        {tutorial.title}
      </h2>
      <div className="flex flex-wrap gap-2 mb-2">
        {tutorial.tags &&
          tutorial.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-50 text-blue-500 rounded px-2 py-0.5 text-xs"
            >
              #{tag}
            </span>
          ))}
      </div>
      {tutorial.image && (
        <img
          src={tutorial.image}
          alt="Tutorial"
          className="w-40 h-40 object-cover rounded-lg border border-blue-100 mb-4"
        />
      )}
      <div
        className="prose max-w-none mb-4"
        dangerouslySetInnerHTML={{ __html: tutorial.content }}
      />
      {tutorial.quiz && tutorial.quiz.questions && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-2">Quiz</h3>
          {tutorial.quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-2">
              <div className="font-semibold">{q.q}</div>
              <ul className="list-disc pl-6">
                {q.options.map((opt, i) => (
                  <li
                    key={i}
                    className={i === q.answer ? "font-bold text-green-600" : ""}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
