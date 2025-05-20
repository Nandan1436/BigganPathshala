import { useState } from "react";
import React from "react";
const Share = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [category, setCategory] = useState("ভৌতবিজ্ঞান");
  const [submitted, setSubmitted] = useState(false);

  const handleTagAdd = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageChange = (e) => {
    // In a real app, you would handle file uploads to storage
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send data to your backend/Firebase
    setSubmitted(true);

    // Reset form after successful submission
    setTimeout(() => {
      setSubmitted(false);
      setContent("");
      setImage(null);
      setTags([]);
      setCategory("ভৌতবিজ্ঞান");
    }, 3000);
  };

  return (
    <section className="science-hub-share">
      <div className="share-header">
        <h2>নতুন বিজ্ঞান ব্লগ</h2>
        <p>বিজ্ঞান সম্পর্কিত আপনার জ্ঞান এবং অভিজ্ঞতা শেয়ার করুন</p>
      </div>

      {submitted ? (
        <div className="share-success">
          <div className="share-success-icon">✅</div>
          <h3>আপনার ব্লগ প্রকাশিত হয়েছে!</h3>
          <p>ধন্যবাদ আপনার অবদানের জন্য</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="share-form">
          {/* Blog content textarea */}
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              কন্টেন্ট
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="আপনার বিজ্ঞান বিষয়ক কন্টেন্ট লিখুন..."
              className="share-textarea"
              required
            />
          </div>

          {/* Image upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              ছবি যোগ করুন (ঐচ্ছিক)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="share-file-input"
            />
            {image && (
              <div className="image-preview">
                <img src={image} alt="Preview" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="remove-image"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Category selector */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              বিভাগ
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="share-select"
            >
              <option value="ভৌতবিজ্ঞান">ভৌতবিজ্ঞান</option>
              <option value="রসায়ন">রসায়ন</option>
              <option value="জীববিজ্ঞান">জীববিজ্ঞান</option>
              <option value="গণিত">গণিত</option>
              <option value="পরিবেশ বিজ্ঞান">পরিবেশ বিজ্ঞান</option>
              <option value="মহাকাশ বিজ্ঞান">মহাকাশ বিজ্ঞান</option>
              <option value="প্রযুক্তি">প্রযুক্তি</option>
              <option value="অন্যান্য">অন্যান্য</option>
            </select>
          </div>

          {/* Tags input */}
          <div className="form-group">
            <label className="form-label">ট্যাগ</label>
            <div className="tags-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleTagAdd())
                }
                placeholder="ট্যাগ যোগ করুন..."
                className="tags-input"
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="add-tag-button"
              >
                +
              </button>
            </div>

            <div className="tags-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag-pill">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="remove-tag"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button type="submit" className="share-submit-button">
            <span role="img" aria-label="Share">
              📤
            </span>{" "}
            প্রকাশ করুন
          </button>
        </form>
      )}
    </section>
  );
};

export default Share;
