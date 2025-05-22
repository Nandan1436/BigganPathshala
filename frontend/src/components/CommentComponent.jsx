import { useState, useEffect } from "react";
import React from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const CommentComponent = ({ postId, user }) => {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsRef = collection(db, "blog", postId.toString(), "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedComments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleCommentSubmit = async () => {
    const content = commentInput.trim();
    if (!content) return;
    if (!user) {
      alert("মন্তব্য করতে লগইন করুন।");
      return;
    }

    try {
      // Fetch username from users collection
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const username = userDoc.exists() ? userDoc.data().username || "Anonymous" : "Anonymous";

      await addDoc(collection(db, "blog", postId.toString(), "comments"), {
        user: username,
        uid: user.uid,
        content,
        createdAt: serverTimestamp(),
      });

      setCommentInput("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("মন্তব্য পোস্ট করতে ব্যর্থ: " + err.message);
    }
  };

  return (
    <div className="border-t border-[color:var(--primary)] pt-5">
      <h4 className="text-lg font-semibold mb-4 text-[color:var(--primary)]">মন্তব্যসমূহ</h4>

      <div className="max-h-40 overflow-y-auto mb-5 space-y-3 pr-1">
        {comments.length === 0 ? (
          <p className="text-sm italic text-[color:var(--gray)]">কোনো মন্তব্য নেই। প্রথমে মন্তব্য করুন!</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[color:var(--light)] rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[color:var(--secondary)]">{comment.user}</span>
                <span className="text-xs text-[color:var(--gray)]">
                  {comment.createdAt?.seconds
                    ? new Date(comment.createdAt.seconds * 1000).toLocaleString("bn-BD")
                    : ""}
                </span>
              </div>
              <p className="text-[color:var(--dark)]">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <input
          type="text"
          placeholder="মন্তব্য লিখুন..."
          className="w-full border border-[color:var(--gray)] bg-[color:var(--light)] text-[color:var(--dark)] rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] transition"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleCommentSubmit();
            }
          }}
        />
        <button
          className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
          onClick={handleCommentSubmit}
        >
          পাঠান
        </button>
      </div>
    </div>
  );
};

export default CommentComponent;