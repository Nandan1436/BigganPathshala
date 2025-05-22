import { useState } from "react";
import React from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { generateSummaryWithGemini } from "../firebase/firestore";

const SummaryComponent = ({ postId, content, initialSummary }) => {
  const [summary, setSummary] = useState(initialSummary);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  const handleSummarize = async () => {
    if (summaryLoading) return;

    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const postRef = doc(db, "blog", postId.toString());
      const postSnap = await getDoc(postRef);
      const existingSummary = postSnap.data()?.summary;

      if (existingSummary) {
        setSummary(existingSummary);
      } else {
        const summaryText = await generateSummaryWithGemini(content);
        await updateDoc(postRef, {
          summary: summaryText || "সারাংশ পাওয়া যায়নি।",
        });

        setSummary(summaryText || "সারাংশ পাওয়া যায়নি।");
      }
    } catch (error) {
      console.error("Error handling summary:", error);
      setSummaryError("সারাংশ তৈরি বা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-6 items-center mb-4">
        <button
          onClick={handleSummarize}
          disabled={summaryLoading}
          className="flex items-center gap-1 text-purple-700 hover:text-purple-900 disabled:opacity-50"
        >
          {summaryLoading ? "সারাংশ লোড হচ্ছে..." : "সারাংশ"}
        </button>
      </div>
      {summary && !summaryError && (
        <div className="mb-4 p-4 bg-yellow-100 rounded-md text-gray-800">
          <strong>সারাংশ: </strong>
          <p>{summary}</p>
        </div>
      )}
      {summaryError && (
        <div className="mb-4 p-4 bg-red-100 rounded-md text-gray-800">
          <strong>ত্রুটি: </strong>
          <p>{summaryError}</p>
        </div>
      )}
    </>
  );
};

export default SummaryComponent;