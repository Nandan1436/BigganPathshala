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

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      try {
        const fetchedComments = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const commentData = doc.data();
            let profilePic = commentData.profilePic || "👤";
            let username = commentData.user || "Anonymous";

            // Debug: Log comment data
            console.log(`Comment ${doc.id}:`, {
              uid: commentData.uid,
              user: commentData.user,
              profilePic: commentData.profilePic,
            });

            // Fetch profilePic if not stored and uid exists
            if (!commentData.profilePic && commentData.uid) {
              try {
                const userDoc = await getDoc(doc(db, "users", commentData.uid));
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  profilePic = userData.profilePic || "👤";
                  username = userData.username || username;
                  console.log(`Fetched user ${commentData.uid}:`, { profilePic, username });
                } else {
                  console.warn(`User ${commentData.uid} not found`);
                }
              } catch (err) {
                console.error(`Error fetching user ${commentData.uid}:`, err);
              }
            } else if (!commentData.uid) {
              console.warn(`Comment ${doc.id} missing uid`);
            }

            return {
              id: doc.id,
              user: username,
              uid: commentData.uid || null,
              content: commentData.content,
              profilePic,
              createdAt: commentData.createdAt,
            };
          })
        );
        setComments(fetchedComments);
        console.log("Fetched comments:", fetchedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
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
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const username = userData.username || "Anonymous";
      const profilePic = userData.profilePic || "👤";

      console.log(`Submitting comment for user ${user.uid}:`, { username, profilePic });

      await addDoc(collection(db, "blog", postId.toString(), "comments"), {
        user: username,
        uid: user.uid,
        content,
        profilePic,
        createdAt: serverTimestamp(),
      });

      setCommentInput("");
    } catch (err) {
      console.error("Error adding comment:", err);
      alert("মন্তব্য পোস্ট করতে ব্যর্থ: " + err.message);
    }
  };

  // Validate URL for image rendering
  const isValidImageUrl = (url) => {
    if (!url || url === "👤") return false;
    try {
      new URL(url);
      return url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
    } catch {
      return false;
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
                <div className="flex items-center gap-2">
                  {isValidImageUrl(comment.profilePic) ? (
                    <img
                      src={comment.profilePic}
                      alt={`${comment.user} profile picture`}
                      className="w-6 h-6 rounded-full object-cover border-2 border-blue-300"
                      onError={(e) => {
                        console.warn(`Failed to load image for ${comment.user}: ${comment.profilePic}`);
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "inline";
                      }}
                    />
                  ) : null}
                  <span
                    className="text-lg"
                    style={{ display: isValidImageUrl(comment.profilePic) ? "none" : "inline" }}
                  >
                    👤
                  </span>
                  <span className="font-semibold text-[color:var(--secondary)]">{comment.user}</span>
                </div>
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