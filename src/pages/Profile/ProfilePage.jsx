import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { profileApi } from "../../api/profileApi";
import { interestsApi } from "../../api/interestsApi";
import { postsApi } from "../../api/postsApi";
import { eventsApi } from "../../api/eventsApi";
import { commentsApi } from "../../api/commentsApi";
import { likesApi } from "../../api/likesApi";

import ProfileInfo from "./components/ProfileInfo";
import ProfileEditForm from "./components/ProfileEditForm";
import MyEvents from "./components/MyEvents";
import MyPosts from "./components/MyPosts";
import CreatePostModal from "./components/CreatePostModal";

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user.userId;

  const [profile, setProfile] = useState(null);
  const [editModel, setEditModel] = useState(null);
  const [allInterests, setAllInterests] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [posts, setPosts] = useState([]);

  // Керування табами: "posts" (за замовчуванням) або "events"
  const [activeTab, setActiveTab] = useState("posts");

  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [showPostModal, setShowPostModal] = useState(false);

  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
    userId,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const p = await profileApi.getByUserId(userId);
    setProfile(p.data);

    const interests = await interestsApi.getAll();
    setAllInterests(interests.data);

    const allPosts = await postsApi.getAll();
    const filteredPosts = allPosts.data.filter(
      (x) => x.authorUsername === p.data.username,
    );
    setPosts(filteredPosts);

    const allEvents = await eventsApi.getAll();
    const mineEvents = allEvents.data.filter(
      (x) => x.creatorUsername === p.data.username,
    );
    setUserEvents(mineEvents);

    setEditModel({
      city: p.data.city,
      age: p.data.age,
      description: p.data.description,
      avatarUrl: p.data.avatarUrl,
      gender: p.data.gender,
      interestIds: interests.data
        .filter((i) => p.data.interests.includes(i.name))
        .map((i) => i.interestId),
    });
  }

  async function refreshPosts() {
    const allPosts = await postsApi.getAll();
    const filtered = allPosts.data.filter(
      (x) => x.authorUsername === profile.username,
    );
    setPosts(filtered);
  }

  async function createPost() {
    await postsApi.create(newPost);
    setShowPostModal(false);
    setNewPost({ content: "", imageUrl: "", userId });
    await refreshPosts();
  }

  async function toggleLike(postId) {
    const likedResp = await likesApi.isLiked(postId, userId);
    if (likedResp.data) await likesApi.unlike({ postId, userId });
    else await likesApi.like({ postId, userId });
    await refreshPosts();
  }

  async function toggleComments(postId) {
    const newSet = new Set(visibleComments);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
      if (!comments[postId]) {
        const resp = await commentsApi.getByPostId(postId);
        setComments((prev) => ({ ...prev, [postId]: resp.data }));
      }
    }
    setVisibleComments(newSet);
  }

  async function submitComment(postId, text) {
    await commentsApi.create({ postId, userId, content: text });
    const refreshed = await commentsApi.getByPostId(postId);
    setComments((prev) => ({ ...prev, [postId]: refreshed.data }));
    await refreshPosts();
  }

  async function deleteEvent(eventId) {
    await eventsApi.delete(eventId);
    const all = await eventsApi.getAll();
    setUserEvents(
      all.data.filter((x) => x.creatorUsername === profile.username),
    );
  }

  async function deletePost(postId) {
    if (window.confirm("Видалити цей пост?")) {
      await postsApi.delete(postId);
      await refreshPosts();
    }
  }

  async function updateProfile(data) {
    await profileApi.update(userId, data);
    await loadData();
  }

  if (!profile || !editModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fd]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fd] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок сторінки */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Мій кабінет
          </h1>
          <p className="text-gray-500 font-medium">
            Керуйте своїм профілем та публікаціями
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ЛІВА КОЛОНКА (без змін) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 custom-scrollbar">
              <ProfileInfo profile={profile} />
              <ProfileEditForm
                editModel={editModel}
                setEditModel={setEditModel}
                allInterests={allInterests}
                updateProfile={updateProfile}
              />
            </div>
          </div>

          {/* ПРАВА КОЛОНКА: Таби та Контент */}
          <div className="lg:col-span-8 space-y-6">
            {/* ПАНЕЛЬ ТАБІВ */}
            <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex gap-2">
              <button
                onClick={() => setActiveTab("posts")}
                className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === "posts"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                ПОСТИ ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === "events"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                ПОДІЇ ({userEvents.length})
              </button>
            </div>

            {/* КОНТЕНТ ОБРАНОГО ТАБА */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === "posts" ? (
                <MyPosts
                  posts={posts}
                  comments={comments}
                  visibleComments={visibleComments}
                  toggleComments={toggleComments}
                  submitComment={submitComment}
                  toggleLike={toggleLike}
                  deletePost={deletePost}
                  openCreatePost={() => setShowPostModal(true)}
                  show={true}
                  onToggle={() => {}}
                />
              ) : (
                <MyEvents
                  events={userEvents}
                  show={true}
                  onToggle={() => {}}
                  deleteEvent={deleteEvent}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showPostModal && (
        <CreatePostModal
          newPost={newPost}
          setNewPost={setNewPost}
          closeModal={() => setShowPostModal(false)}
          createPost={createPost}
        />
      )}
    </div>
  );
}
