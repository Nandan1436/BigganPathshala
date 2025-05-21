import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function StatusPostInput() {

  console.log("Component");
  
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Handle Submit ...")
    try {
      const docRef = await addDoc(collection(db, "blog"), {
        content,
        createdAt: serverTimestamp(),
      });
      alert(`✅ Post created! Document ID: ${docRef.id}`);
      setContent("");
    } catch (error) {
      console.error(error);
      alert("Failed to add document");
    }
  };

  // const isAuthenticated = !!localStorage.getItem("sciencehub_auth");
  // if (!isAuthenticated) return null;

  console.log(content);

  return (
    <div className="status-post-input max-w-5xl mx-auto px-6 py-4 mt-4">
      <form onSubmit={handleSubmit} className="relative bg-white/90 rounded-2xl shadow-lg p-4 border border-blue-200">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="আপনার মনে কী? বিজ্ঞান সম্পর্কে কিছু শেয়ার করুন..."
          className="w-full min-h-[60px] rounded-lg border border-blue-200 p-3 text-lg placeholder:text-blue-300 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
        />
        <button
          type="submit"
          className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold px-3 py-1 rounded-md shadow hover:from-green-400 hover:to-blue-500 transition-all text-sm"
        >
          পোস্ট
        </button>
      </form>
    </div>
  );
}