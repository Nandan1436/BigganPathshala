import { useState } from 'react';
import React from 'react';
import ReactQuill from 'react-quill';
import { db } from "../firebase/config"; // adjust path as needed
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


function PostInput() {
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [category, setCategory] = useState('ভৌতবিজ্ঞান');
    const [submitted, setSubmitted] = useState(false);

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
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const handleShareSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "blog"), {
                content,
                image,
                category,
                tags,
                createdAt: serverTimestamp(),
                likes: 0,
                dislikes: 0,
                summary: "",
                comments: [] // Or keep this out and create a subcollection
            });


            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setContent('');
                setImage(null);
                setTags([]);
                setCategory('ভৌতবিজ্ঞান');
                setShowForm(false);
            }, 3000);
        } catch (error) {
            console.error("Error adding document:", error);
            alert("❌ পোস্ট সংরক্ষণ ব্যর্থ হয়েছে!");
        }
    };


    return (
        <div className="status-post-input max-w-5xl mx-auto px-6 py-4 mt-4 z-10 relative">
            {/* Initial input bar */}
            {!showForm && (
                <div className="w-1/2 mx-auto flex items-center gap-4 bg-white/90 rounded-2xl shadow-lg p-3 border border-blue-200">
                    <input
                        placeholder="আপনার মনে কী? বিজ্ঞান সম্পর্কে কিছু শেয়ার করুন..."
                        onFocus={() => setShowForm(true)} // Trigger form
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
                <div className="mt-4 fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-16">
                    <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-lg p-6 border border-white/60 relative z-50">
                        {submitted ? (
                            <div className="text-center">
                                <div className="text-4xl mb-2">✅</div>
                                <h3 className="text-2xl font-bold mb-2">
                                    আপনার ব্লগ প্রকাশিত হয়েছে!
                                </h3>
                                <p className="text-blue-900/80 mb-4">ধন্যবাদ আপনার অবদানের জন্য</p>
                            </div>
                        ) : (
                            <form onSubmit={handleShareSubmit} className="flex flex-col gap-6">
                                <ReactQuill
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
                                    placeholder="আপনার বিজ্ঞান বিষয়ক কন্টেন্ট লিখুন..."
                                    className="bg-white/70 border border-blue-200 rounded-lg shadow focus:ring-2 focus:ring-blue-400"
                                />

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="block w-full text-blue-900 border border-blue-200 rounded-lg p-2 bg-white/80"
                                />
                                {image && (
                                    <div className="flex items-center gap-4 mt-2">
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
                                    className="rounded-md border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                >
                                    <option value="ভৌতবিজ্ঞান">ভৌতবিজ্ঞান</option>
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
                                            className="rounded-md border border-blue-200 px-3 py-2 bg-white/80 focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
