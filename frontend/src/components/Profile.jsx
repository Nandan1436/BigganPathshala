import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import React from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    profilePic: "👤",
    reputation: 0,
    reputationTitle: "Newbie",
    contribution: 0,
    contributionTitle: "New Contributor",
    xp: 0,
    xpTitle: "Quiz Novice",
    postCount: 0,
    questionCount: 0,
    commentCount: 0,
    bio: "",
    interests: []
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [tempBio, setTempBio] = useState("");
  const [tempInterests, setTempInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const commonInterests = [
    "ভৌতবিজ্ঞান",
    "রসায়ন",
    "জীববিজ্ঞান",
    "গণিত",
    "পরিবেশ বিজ্ঞান",
    "মহাকাশ বিজ্ঞান",
    "কোয়ান্টাম মেকানিক্স",
    "জিনতত্ত্ব",
    "কৃত্রিম বুদ্ধিমত্তা",
    "পুনর্নবীকরণযোগ্য শক্তি"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            username: data.username || "অজ্ঞাত ব্যবহারকারী",
            profilePic: data.profilePic || "👤",
            reputation: data.reputation || 0,
            reputationTitle: data.reputationTitle || "Newbie",
            contribution: data.contribution || 0,
            contributionTitle: data.contributionTitle || "New Contributor",
            xp: data.xp || 0,
            xpTitle: data.xpTitle || "Quiz Novice",
            postCount: data.postCount || 0,
            questionCount: data.questionCount || 0,
            commentCount: data.commentCount || 0,
            bio: data.bio || "এখনো কোনো বায়ো সেট করা হয়নি।",
            interests: data.interests || []
          });
          setTempBio(data.bio || "");
          setTempInterests(data.interests || []);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const saveBio = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { bio: tempBio.trim() });
      setProfile((prev) => ({ ...prev, bio: tempBio.trim() || "এখনো কোনো বায়ো সেট করা হয়নি।" }));
      setIsEditingBio(false);
    } catch (err) {
      console.error("Error saving bio:", err);
    }
  };

  const saveInterests = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { interests: tempInterests });
      setProfile((prev) => ({ ...prev, interests: tempInterests }));
      setIsEditingInterests(false);
      setNewInterest("");
    } catch (err) {
      console.error("Error saving interests:", err);
    }
  };

  const handleInterestSelect = (interest) => {
    if (interest && !tempInterests.includes(interest) && tempInterests.length < 5) {
      setTempInterests([...tempInterests, interest]);
      setNewInterest("");
    }
  };

  const addCustomInterest = () => {
    const trimmedInterest = newInterest.trim();
    if (trimmedInterest && !tempInterests.includes(trimmedInterest) && tempInterests.length < 5) {
      setTempInterests([...tempInterests, trimmedInterest]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest) => {
    setTempInterests(tempInterests.filter((i) => i !== interest));
  };

  if (!user) {
    return <div>লোডিং...</div>;
  }

  return (
    <section className="science-hub-profile max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="profile-header flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <div className="profile-avatar-large">
          {profile.profilePic && profile.profilePic !== "👤" ? (
            <img
              src={profile.profilePic}
              alt="User profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
            />
          ) : (
            <span className="text-6xl">👤</span>
          )}
        </div>
        <div className="profile-header-content text-center sm:text-left">
          <h2 className="profile-name text-2xl font-bold bg-gradient-to-r from-blue-500 to-green-400 bg-clip-text text-transparent">
            {profile.username}
          </h2>
          <div className="profile-badges flex flex-wrap gap-2 mt-2">
            <span className="profile-badge bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {profile.reputationTitle}
            </span>
            <span className="profile-badge bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              {profile.contributionTitle}
            </span>
            <span className="profile-badge bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              {profile.xpTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-stats grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white rounded-xl shadow-md p-6 mt-6 border border-blue-100">
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.postCount}</div>
          <div className="stat-label text-blue-600">ব্লগ</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.questionCount}</div>
          <div className="stat-label text-blue-600">প্রশ্ন</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.commentCount}</div>
          <div className="stat-label text-blue-600">উত্তর</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.reputation}</div>
          <div className="stat-label text-blue-600">খ্যাতি</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.contribution}</div>
          <div className="stat-label text-blue-600">অবদান</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.xp}</div>
          <div className="stat-label text-blue-600">অভিজ্ঞতা</div>
        </div>
      </div>

      <div className="profile-bio bg-white rounded-xl shadow-md p-6 mt-6 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-blue-800">বায়ো</h3>
          {!isEditingBio && (
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              সম্পাদনা করুন
            </button>
          )}
        </div>
        {isEditingBio ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={tempBio}
              onChange={(e) => setTempBio(e.target.value)}
              placeholder="আপনার বায়ো লিখুন..."
              className="w-full p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all resize-none h-24 focus:outline-none"
              maxLength={200}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setTempBio(profile.bio);
                  setIsEditingBio(false);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={saveBio}
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded-md transition-all"
                disabled={!tempBio.trim()}
              >
                সংরক্ষণ
              </button>
            </div>
          </div>
        ) : (
          <p className="text-blue-900">{profile.bio}</p>
        )}
      </div>

      <div className="profile-interests bg-white rounded-xl shadow-md p-6 mt-6 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-blue-800">আগ্রহের বিষয়</h3>
          {!isEditingInterests && (
            <button
              onClick={() => setIsEditingInterests(true)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              সম্পাদনা করুন
            </button>
          )}
        </div>
        {isEditingInterests ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2 mb-2">
              {tempInterests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                  <button
                    onClick={() => removeInterest(interest)}
                    className="ml-1 focus:outline-none"
                    aria-label={`Remove ${interest}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newInterest}
                onChange={(e) => handleInterestSelect(e.target.value)}
                className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
                disabled={tempInterests.length >= 5}
              >
                <option value="" disabled>
                  আগ্রহ নির্বাচন করুন
                </option>
                {commonInterests
                  .filter((interest) => !tempInterests.includes(interest))
                  .map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
              </select>
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="কাস্টম আগ্রহ লিখুন..."
                className="flex-1 p-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all focus:outline-none"
                disabled={tempInterests.length >= 5}
              />
              <button
                onClick={addCustomInterest}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                disabled={!newInterest.trim() || tempInterests.length >= 5}
              >
                যোগ করুন
              </button>
            </div>
            <p className="text-blue-600 text-sm">
              সর্বোচ্চ ৫টি আগ্রহ যোগ করা যাবে।
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setTempInterests(profile.interests);
                  setNewInterest("");
                  setIsEditingInterests(false);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
              >
                বাতিল
              </button>
              <button
                onClick={saveInterests}
                className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded-md transition-all"
              >
                সংরক্ষণ
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-tags flex flex-wrap gap-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="profile-tag bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-blue-600">কোনো আগ্রহ যোগ করা হয়নি।</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;