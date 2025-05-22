import { useState, useEffect } from 'react';
import React from 'react';
import ReactQuill from 'react-quill';
import { db, auth } from "../firebase/config";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Utility function to format time in Bangla
const formatBanglaTime = (date) => {
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Convert number to Bangla numerals
  const toBanglaNumerals = (num) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().split('').map(digit => banglaDigits[digit]).join('');
  };

  if (diffSeconds < 60) {
    return "এইমাত্র";
  } else if (diffMinutes < 60) {
    return `${toBanglaNumerals(diffMinutes)} মিনিট আগে`;
  } else if (diffHours < 24) {
    return `${toBanglaNumerals(diffHours)} ঘন্টা আগে`;
  } else if (diffDays < 7) {
    return `${toBanglaNumerals(diffDays)} দিন আগে`;
  } else {
    // Format date as DD/MM/YYYY in Bangla numerals
    const day = toBanglaNumerals(date.getDate().toString().padStart(2, '0'));
    const month = toBanglaNumerals((date.getMonth() + 1).toString().padStart(2, '0'));
    const year = toBanglaNumerals(date.getFullYear());
    return `${day}/${month}/${year}`;
  }
};

// Utility function to extract meaningful text from HTML content
const getMeaningfulText = (htmlContent, quillEditor) => {
  // Try Quill's getText() first
  if (quillEditor) {
    let text = quillEditor.getText();
    // Normalize newlines and invisible characters
    text = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
    console.log("Quill getText:", text);
    if (text && text !== '') {
      return text;
    }
  }

  // Fallback: Parse HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Remove non-content tags
  ['script', 'style', 'head', 'meta', 'noscript'].forEach(tag => {
    const elements = tempDiv.getElementsByTagName(tag);
    Array.from(elements).forEach(el => el.remove());
  });

  // Get text content and clean up
  let text = tempDiv.textContent || tempDiv.innerText || '';
  text = text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  console.log("HTML parsed text:", text);

  return text;
};

function PostInput() {
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState('পদার্থ বিজ্ঞান');
    const [submitted, setSubmitted] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    // Reference to ReactQuill instance
    const quillRef = React.useRef(null);

    // Listen for auth state changes and fetch username
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    if (userDoc.exists()) {
                        setUsername(userDoc.data().username || "অজ্ঞাত ব্যবহারকারী");
                    }
                } catch (err) {
                    console.error("Error fetching username:", err);
                }
            } else {
                setCurrentUser(null);
                setUsername('');
            }
        });
        return () => unsubscribe();
    }, []);

    const handleTagAdd = () => {
        if (tagInput && !tags.includes(tagInput)) {
            setTags([...tags, tagInput]);
            setTagInput('');
        }
    };

    const handleTagRemove = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!currentUser) {
            setError("পোস্ট করতে লগইন করুন।");
            return;
        }

        // Get plain text from ReactQuill or HTML
        const quill = quillRef.current?.getEditor();
        const plainContent = getMeaningfulText(content, quill);
        console.log("Raw content:", content);
        console.log("Plain content:", plainContent);
        if (quill) {
            console.log("Quill content:", quill.getContents());
        }

        // Check if content is empty
        if (!plainContent) {
            setError("পোস্টের কনটেন্ট খালি থাকতে পারে না। দয়া করে পাঠ্য সামগ্রী লিখুন বা কপি করা বিষয়বস্তু পরীক্ষা করুন।");
            return;
        }

        // Additional check for raw content to avoid false negatives
        const rawText = content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        console.log("Raw text (fallback):", rawText);
        if (!rawText && content.trim() === '<p><br></p>') {
            setError("পোস্টের কনটেন্ট খালি থাকতে পারে না। দয়া করে পাঠ্য সামগ্রী লিখুন।");
            return;
        }

        try {
            const now = new Date();
            await addDoc(collection(db, "blog"), {
                user: username,
                uid: currentUser.uid,
                avatar: currentUser.photoURL || "👤",
                content,
                image: image || '',
                category,
                tags: tags.length > 0 ? tags : [],
                createdAt: serverTimestamp(),
                time: formatBanglaTime(now),
                tag: category,
                tagColor: "#3B82F6",
                likes: 0,
                dislikes: 0,
                summary: "",
                comments: 0,
                factChecked: false,
                credibility: 0,
                featured: false,
            });

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setContent('');
                setImage(null);
                setTags([]);
                setCategory('পদার্থ বিজ্ঞান');
                setShowForm(false);
                setError('');
            }, 3000);
        } catch (error) {
            console.error("Error adding document:", error);
            setError(`পোস্ট সংরক্ষণ ব্যর্থ হয়েছে: ${error.message}`);
        }
    };

    return (
        <div className="status-post-input max-w-5xl mx-auto px-6 py-4 mt-4 z-10 relative">
            {/* Initial input bar */}
            {!showForm && (
                <div className="w-1/2 mx-auto flex items-center gap-4 bg-white/90 rounded-2xl shadow-lg p-3 border border-blue-200">
                    <input
                        placeholder="আপনার মনে কী? বিজ্ঞান সম্পর্কে কিছু শেয়ার করুন..."
                        onFocus={() => setShowForm(true)}
                        className="flex-1 h-[36px] rounded-lg border border-blue-200 py-1 px-3 text-base placeholder:text-blue-300 bg-white/70 focus:ring-2 focus:ring-blue-400 focus:outline-none cursor-pointer"
                        readOnly
                    />
                    <button
                        type="button"
                        className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold px-3 py-1 rounded-md shadow hover:from-green-400 hover:to-blue-500 transition-all text-sm"
                    >
                        পোস্ট
                    </button>
                </div>
            )}

            {/* Expanded post form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-16 overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-lg p-6 border border-white/60 relative z-50 max-h-[80vh] flex flex-col">
                        {submitted ? (
                            <div className="text-center flex-1 flex flex-col justify-center">
                                <div className="text-4xl mb-2">✅</div>
                                <h3 className="text-2xl font-bold mb-2">
                                    আপনার ব্লগ প্রকাশিত হয়েছে!
                                </h3>
                                <p className="text-blue-900/80 mb-4">ধন্যবাদ আপনার অবদানের জন্য</p>
                            </div>
                        ) : (
                            <form onSubmit={handleShareSubmit} className="flex flex-col gap-6 flex-1 overflow-hidden">
                                {/* Error message display */}
                                {error && (
                                    <div className="bg-red-100 text-red-700 p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}
                                <div className="flex-1 overflow-y-auto">
                                    <ReactQuill
                                        ref={quillRef}
                                        value={content}
                                        onChange={setContent}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'bullet' }],
                                                ['clean']
                                            ]
                                        }}
                                        formats={['bold', 'italic', 'underline', 'list', 'bullet']}
                                        placeholder="আপনার বিজ্ঞান বিষয়ক কনটেন্ট লিখুন..."
                                        className="bg-white/70 border border-blue-200 rounded-lg shadow focus:ring-2 focus:ring-blue-400 mb-4"
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-blue-900 border border-blue-200 rounded-lg p-2 bg-white/80 mb-4"
                                    />
                                    {image && (
                                        <div className="flex items-center gap-4 mb-4">
                                            <img
                                                src={image}
                                                alt="Preview"
                                                className="w-20 h-20 object-cover rounded-lg border border-blue-100"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImage(null)}
                                                className="text-red-500 font-bold text-xl hover:text-red-700"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )}

                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="rounded-md border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-4 w-full"
                                    >
                                        <option value="পদার্থ বিজ্ঞান">পদার্থ বিজ্ঞান</option>
                                        <option value="রসায়ন">রসায়ন</option>
                                        <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
                                        <option value="গণিত">গণিত</option>
                                        <option value="পরিবেশ বিজ্ঞান">পরিবেশ বিজ্ঞান</option>
                                    </select>

                                    <div>
                                        <label className="block font-semibold text-blue-900 mb-2">
                                            ট্যাগ
                                        </label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {tags.map((tag) => (
                                                <span key={tag} className="bg-blue-50 text-blue-500 font-semibold rounded-lg px-3 py-0.5 text-sm border border-blue-100 flex items-center gap-1">
                                                    #{tag}
                                                    <button type="button" onClick={() => handleTagRemove(tag)} className="ml-1 text-red-400 hover:text-red-600">×</button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                placeholder="নতুন ট্যাগ"
                                                className="rounded-md border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none flex-1"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleTagAdd}
                                                className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-4 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
                                            >
                                                যোগ করুন
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="text-red-600 hover:underline font-semibold"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold px-6 py-2 rounded-lg shadow hover:from-green-400 hover:to-blue-500 transition-all"
                                    >
                                        পোস্ট করুন
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostInput;