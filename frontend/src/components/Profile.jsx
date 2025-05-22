import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import React from "react";

const CLOUDINARY_UPLOAD_PRESET = "healthTracker"; // Replace with your Cloudinary preset
const CLOUDINARY_CLOUD_NAME = "ismailCloud"; // Replace with your Cloudinary cloud name

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    username: "",
    profilePic: "👤",
    reputation: 0,
    reputationTitle: "Newbie",
    contribution: 0,
    contributionTitle: "New Contributor",
    learning: 0,
    learningTitle: "Learning Novice",
    blogsCount: 0, // Still in state, but fetched from blogs collection
    tutorialsCount: 0,
    commentsCount: 0,
    bio: "",
    interests: []
  });
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [isEditingProfilePic, setIsEditingProfilePic] = useState(false);
  const [tempBio, setTempBio] = useState("");
  const [tempInterests, setTempInterests] = useState([]);
  const [newInterest, setNewInterest] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
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

  // Title thresholds
  const reputationThresholds = [
    { title: "Newbie", min: 0, max: 50 },
    { title: "Learner", min: 51, max: 100 },
    { title: "Contributor", min: 101, max: 250 },
    { title: "Expert", min: 251, max: 500 },
    { title: "Master", min: 501, max: Infinity }
  ];
  const contributionThresholds = [
    { title: "New Contributor", min: 0, max: 50 },
    { title: "Active Contributor", min: 51, max: 150 },
    { title: "Valued Contributor", min: 151, max: 300 },
    { title: "Top Contributor", min: 301, max: 600 },
    { title: "Master Contributor", min: 601, max: Infinity }
  ];
  const learningThresholds = [
    { title: "Learning Novice", min: 0, max: 100 },
    { title: "Learning Enthusiast", min: 101, max: 250 },
    { title: "Learning Expert", min: 251, max: 500 },
    { title: "Learning Master", min: 501, max: 1000 },
    { title: "Learning Legend", min: 1001, max: Infinity }
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
        // Fetch user profile data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        let userData = {};
        if (userDoc.exists()) {
          userData = userDoc.data();
        }

        // Fetch blogs count from blogs collection
        const blogsQuery = query(
          collection(db, "blog"),
          where("uid", "==", user.uid)
        );
        const blogsSnapshot = await getDocs(blogsQuery);
        const blogsCount = blogsSnapshot.size; // Count of matching documents
      

        // Set profile state
        setProfile({
          username: userData.username || "অজ্ঞাত ব্যবহারকারী",
          profilePic: userData.profilePic || "👤",
          reputation: userData.reputation || 0,
          reputationTitle: userData.reputationTitle || "Newbie",
          contribution: userData.contribution || 0,
          contributionTitle: userData.contributionTitle || "New Contributor",
          learning: userData.learning || 0,
          learningTitle: userData.learningTitle || "Learning Novice",
          blogsCount: blogsCount, // Set from blogs collection
          tutorialsCount: userData.tutorialsCount || 0,
          commentsCount: userData.commentsCount || 0,
          bio: userData.bio || "এখনো কোনো বায়ো সেট করা হয়নি।",
          interests: userData.interests || []
        });
        setTempBio(userData.bio || "");
        setTempInterests(userData.interests || []);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [user]);

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      setTempImage(URL.createObjectURL(e.target.files[0]));
      setImageLoading(true);
      setImageError("");
      const data = new FormData();
      data.append("file", e.target.files[0]);
      data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const file = await res.json();
        if (file.error) {
          throw new Error(file.error.message);
        }
        setProfile((prev) => ({ ...prev, profilePic: file.secure_url }));
      } catch (err) {
        setImageError("প্রোফাইল ছবি আপলোড করতে ব্যর্থ: " + err.message);
      } finally {
        setImageLoading(false);
      }
    }
  };

  const saveProfilePic = async () => {
    if (!user || !profile.profilePic) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profilePic: profile.profilePic });
      setIsEditingProfilePic(false);
      setTempImage(null);
      setImageError("");
    } catch (err) {
      setImageError("প্রোফাইল ছবি সংরক্ষণ ব্যর্থ: " + err.message);
    }
  };

  const cancelProfilePic = () => {
    setIsEditingProfilePic(false);
    setTempImage(null);
    setImageError("");
    setProfile((prev) => ({ ...prev, profilePic: profile.profilePic || "👤" }));
  };

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

  // Calculate progress and next threshold
  const getProgress = (score, thresholds) => {
    const current = thresholds.find((t) => score >= t.min && score <= t.max) || thresholds[0];
    const next = thresholds.find((t) => t.min > score) || current;
    const percentage = current.max === Infinity ? 100 : ((score - current.min) / (current.max - current.min)) * 100;
    const pointsNeeded = next.min > score ? next.min - score : 0;
    return { percentage: Math.min(percentage, 100), nextTitle: next.title, pointsNeeded, currentTitle: current.title };
  };

  const reputationProgress = getProgress(profile.reputation, reputationThresholds);
  const contributionProgress = getProgress(profile.contribution, contributionThresholds);
  const learningProgress = getProgress(profile.learning, learningThresholds);

  const CustomProgressBar = ({ value, score, title, nextTitle, pointsNeeded, color, description, earnMethod }) => (
    <div
      className="score-item text-center group"
      data-tooltip-id={`${description.toLowerCase()}-tooltip`}
      data-tooltip-content={earnMethod}
      aria-label={`${description}: ${score}, ${pointsNeeded} to ${nextTitle}`}
    >
      <div className="w-36 h-36 mx-auto relative mb-4">
        <CircularProgressbar
          value={value}
          styles={buildStyles({
            pathColor: color.path,
            textColor: "transparent",
            trailColor: "#F3F4F6",
            pathTransition: "stroke-dashoffset 0.8s ease 0s",
            strokeLinecap: "round"
          })}
          strokeWidth={6}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className={`text-3xl font-bold ${color.textClass}`}>{score}</div>
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <div className={`text-sm font-semibold ${color.textClass} mb-2`}>{title}</div>
        <div className="text-xs text-gray-600 mb-3">
          {pointsNeeded > 0 ? (
            <>
              <span className="text-gray-500">{pointsNeeded} more to</span>
              <div className="font-medium text-gray-700">{nextTitle}</div>
            </>
          ) : (
            <span className="text-green-600 font-medium">Max Level!</span>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${color.bgClass}`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return <div>লোডিং...</div>;
  }

  return (
    <section className="science-hub-profile max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {imageError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 max-w-5xl mx-auto">
          {imageError}
        </div>
      )}
      <div className="profile-header flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <div className="profile-avatar-large flex flex-col items-center">
          {isEditingProfilePic ? (
            <div className="flex flex-col items-center gap-2">
              {tempImage ? (
                <img
                  src={tempImage}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
                />
              ) : profile.profilePic && profile.profilePic !== "👤" ? (
                <img
                  src={profile.profilePic}
                  alt="User profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}
              <label className="w-full flex items-center justify-center p-2 border border-blue-200 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
                <span className="text-blue-700">{tempImage ? "ছবি পরিবর্তন করুন" : "ছবি আপলোড করুন"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={imageLoading}
                  aria-label="প্রোফাইল ছবি"
                />
              </label>
              {imageLoading && (
                <div className="text-blue-600 flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>ছবি আপলোড হচ্ছে...</span>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={cancelProfilePic}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-all"
                >
                  বাতিল
                </button>
                <button
                  onClick={saveProfilePic}
                  className="bg-gradient-to-r from-blue-500 to-green-400 hover:from-green-400 hover:to-blue-500 text-white px-4 py-2 rounded-md transition-all"
                  disabled={imageLoading || !profile.profilePic || profile.profilePic === "👤"}
                >
                  সংরক্ষণ
                </button>
              </div>
            </div>
          ) : (
            <>
              {profile.profilePic && profile.profilePic !== "👤" ? (
                <img
                  src={profile.profilePic}
                  alt="User profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-300"
                />
              ) : (
                <span className="text-6xl">👤</span>
              )}
              <button
                onClick={() => setIsEditingProfilePic(true)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                সম্পাদনা করুন
              </button>
            </>
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
              {profile.learningTitle}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-scores grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white rounded-xl shadow-md p-8 mt-6 border border-blue-100">
        <CustomProgressBar
          value={reputationProgress.percentage}
          score={profile.reputation}
          title={reputationProgress.currentTitle}
          nextTitle={reputationProgress.nextTitle}
          pointsNeeded={reputationProgress.pointsNeeded}
          color={{
            path: "#3B82F6",
            text: "#1E40AF",
            textClass: "text-blue-700",
            bgClass: "bg-blue-500"
          }}
          description="Reputation"
          earnMethod="রিপুটেশন দেখায় আপনার মন্তব্য কতটা প্রভাব ফেলেছে। মন্তব্যে আপভোট পেয়ে এটি বাড়ান।"
        />
        <CustomProgressBar
          value={contributionProgress.percentage}
          score={profile.contribution}
          title={contributionProgress.currentTitle}
          nextTitle={contributionProgress.nextTitle}
          pointsNeeded={contributionProgress.pointsNeeded}
          color={{
            path: "#10B981",
            text: "#047857",
            textClass: "text-green-700",
            bgClass: "bg-green-500"
          }}
          description="Contribution"
          earnMethod="কন্ট্রিবিউশন নির্ধারণ করে আপনার ব্লগ কতটা কার্যকর ছিল। ব্লগ পোস্টে আপভোট পেয়ে স্কোর বাড়ান।"
        />
        <CustomProgressBar
          value={learningProgress.percentage}
          score={profile.learning}
          title={learningProgress.currentTitle}
          nextTitle={learningProgress.nextTitle}
          pointsNeeded={learningProgress.pointsNeeded}
          color={{
            path: "#8B5CF6",
            text: "#6D28D9",
            textClass: "text-purple-700",
            bgClass: "bg-purple-500"
          }}
          description="Learning"
          earnMethod="লার্নিং দেখায় আপনি কতটুকু শিখেছেন। টিউটোরিয়াল কুইজ শেষ করে অগ্রগতি অর্জন করুন।"
        />
      </div>

      <ReactTooltip
        id="reputation-tooltip"
        place="top"
        effect="solid"
        className="rounded-lg bg-blue-600 text-white text-xs px-2 py-1 shadow-md max-w-[200px] text-center"
      />
      <ReactTooltip
        id="contribution-tooltip"
        place="top"
        effect="solid"
        className="rounded-lg bg-green-600 text-white text-xs px-2 py-1 shadow-md max-w-[200px] text-center"
      />
      <ReactTooltip
        id="learning-tooltip"
        place="top"
        effect="solid"
        className="rounded-lg bg-purple-600 text-white text-xs px-2 py-1 shadow-md max-w-[200px] text-center"
      />

      <div className="profile-stats grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white rounded-xl shadow-md p-6 mt-6 border border-blue-100">
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.blogsCount}</div>
          <div className="stat-label text-blue-600">ব্লগ</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.tutorialsCount}</div>
          <div className="stat-label text-blue-600">টিউটোরিয়াল</div>
        </div>
        <div className="stat-item text-center">
          <div className="stat-value text-xl font-bold text-blue-800">{profile.commentsCount}</div>
          <div className="stat-label text-blue-600">মন্তব্য</div>
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
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => {
                  setTempInterests(profile.interests);
                  setIsEditingInterests(false);
                  setNewInterest("");
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
          <div className="flex flex-wrap gap-2">
            {profile.interests.length > 0 ? (
              profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))
            ) : (
              <p className="text-blue-900">কোনো আগ্রহ যোগ করা হয়নি।</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;