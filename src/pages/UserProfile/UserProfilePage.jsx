import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { profileApi } from "../../api/profileApi";
import { postsApi } from "../../api/postsApi";
import { commentsApi } from "../../api/commentsApi";
import { likesApi } from "../../api/likesApi";
import { eventsApi } from "../../api/eventsApi";
import { followApi } from "../../api/followApi";
import { participantsApi } from "../../api/participantsApi";

import { useAuth } from "../../context/AuthContext";

const parseImg = (b64) => {
  return b64 ? `data:image/jpeg;base64,${b64}` : "https://via.placeholder.com/150";
};

export default function UserProfilePage() {
  const { userId: profileUserId } = useParams();
  const { user } = useAuth();
  const currentUserId = user?.userId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());

  const [comments, setComments] = useState({}); 
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [commentInputs, setCommentInputs] = useState({});

  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [profileUserId]);

  async function loadData() {
    setLoading(true);
    try {
      const profileRes = await profileApi.getByUserId(profileUserId);
      const profData = profileRes.data;
      setProfile(profData);

      const [postsRes, eventsRes, followRes, joinedRes] = await Promise.all([
        postsApi.getAll(),
        eventsApi.getAll(),
        followApi.isFollowing(currentUserId, profileUserId),
        participantsApi.getByUserId(currentUserId),
      ]);

      const filteredPosts = postsRes.data.filter(
        (p) => p.authorUsername === profData.username,
      );
      const filteredEvents = eventsRes.data.filter(
        (e) => e.creatorUsername === profData.username,
      );

      setPosts(filteredPosts);
      setEvents(filteredEvents);
      setIsFollowing(followRes.data);
      setJoinedEventIds(new Set(joinedRes.data.map((p) => p.eventId)));

      const likesSet = new Set();
      for (const p of filteredPosts) {
        const liked = await likesApi.isLiked(p.postId, currentUserId);
        if (liked.data) likesSet.add(p.postId);
      }
      setLikedPosts(likesSet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // --- ACTIONS: FOLLOW, LIKE, JOIN ---
  async function toggleFollow() {
    const dto = { followerId: currentUserId, followedId: profileUserId };
    isFollowing ? await followApi.unfollow(dto) : await followApi.follow(dto);
    setIsFollowing(!isFollowing);
  }

  async function toggleLike(postId) {
    const alreadyLiked = likedPosts.has(postId);
    const dto = { postId, userId: currentUserId };
    alreadyLiked ? await likesApi.unlike(dto) : await likesApi.like(dto);

    setLikedPosts((prev) => {
      const updated = new Set(prev);
      alreadyLiked ? updated.delete(postId) : updated.add(postId);
      return updated;
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.postId === postId
          ? { ...p, likeCount: alreadyLiked ? p.likeCount - 1 : p.likeCount + 1 }
          : p,
      ),
    );
  }

  async function toggleJoinEvent(eventId) {
    const isJoined = joinedEventIds.has(eventId);
    const dto = { eventId, userId: currentUserId };

    if (isJoined) {
      await participantsApi.leave(dto);
      setJoinedEventIds((prev) => {
        const n = new Set(prev);
        n.delete(eventId);
        return n;
      });
      setEvents((prev) =>
        prev.map((e) =>
          e.eventId === eventId
            ? { ...e, participantCount: e.participantCount - 1 }
            : e,
        ),
      );
    } else {
      await participantsApi.join(dto);
      setJoinedEventIds((prev) => new Set(prev).add(eventId));
      setEvents((prev) =>
        prev.map((e) =>
          e.eventId === eventId
            ? { ...e, participantCount: e.participantCount + 1 }
            : e,
        ),
      );
    }
  }

  // --- ACTIONS: COMMENTS ---
  async function toggleCommentsVisibility(id, type) {
    const key = `${type}_${id}`;
    const newVisible = new Set(visibleComments);

    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
      if (!comments[key]) {
        const res =
          type === "post"
            ? await commentsApi.getByPostId(id)
            : await commentsApi.getByEventId(id);
        setComments((prev) => ({ ...prev, [key]: res.data }));
      }
    }
    setVisibleComments(newVisible);
  }

  async function handleAddComment(id, type) {
    const key = `${type}_${id}`;
    const text = commentInputs[key];
    if (!text?.trim()) return;

    const dto = {
      content: text,
      userId: currentUserId,
      [type === "post" ? "postId" : "eventId"]: id,
    };

    await commentsApi.create(dto);
    setCommentInputs((prev) => ({ ...prev, [key]: "" }));

    const res =
      type === "post"
        ? await commentsApi.getByPostId(id)
        : await commentsApi.getByEventId(id);
    setComments((prev) => ({ ...prev, [key]: res.data }));

    if (type === "post") {
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === id
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p,
        ),
      );
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-lg">Профіль не знайдено</p>
      </div>
    );
  }

  const currentTabItems = activeTab === "posts" ? posts : events;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* ЛІВА КОЛОНКА */}
        <aside className="lg:col-span-4 w-full">
          <div className="lg:fixed lg:top-24 lg:w-[calc((100vw-32px)*0.333-16px)] lg:max-w-[312px] w-full bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 z-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={parseImg(profile.avatarUrl)}
                  className="w-32 h-32 rounded-[2rem] object-cover border border-gray-100 shadow-inner bg-gray-50"
                  alt={profile.username}
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              </div>

              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {profile.username}
              </h2>
              
              <span className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase tracking-tighter">
                {profile.age} р.
              </span>

              <div className="mt-6 w-full space-y-4 text-left">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">
                    Місто
                  </h4>
                  <div className="px-4 py-3 bg-gray-50 border border-transparent rounded-2xl font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <span>📍</span> {profile.city || "Не вказано"}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">
                    Про себе
                  </h4>
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-500 text-sm leading-relaxed italic border border-transparent">
                    {profile.description || "Користувач не додав опис профілю"}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                    Інтереси
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests?.length > 0 ? (
                      profile.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-wider"
                        >
                          #{interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-300 italic ml-1">Без інтересів</span>
                    )}
                  </div>
                </div>
              </div>

              {profileUserId !== String(currentUserId) && (
                <button
                  onClick={toggleFollow}
                  className={`w-full mt-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 border ${
                    isFollowing
                      ? "bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200"
                      : "bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-lg shadow-blue-600/10"
                  }`}
                >
                  {isFollowing ? "Відписатись" : "Підписатись"}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ПРАВА КОЛОНКА */}
        <main className="lg:col-span-8 lg:col-start-5 space-y-6">
          <div className="bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100 flex gap-2">
            {["posts", "events"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab === "posts" ? "Пости" : "Події"} ({tab === "posts" ? posts.length : events.length})
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {currentTabItems.length === 0 ? (
              <div className="text-center py-12">
            <p className="text-gray-500 font-bold text-lg">Подій поки немає</p>
          </div>
            ) : (
              currentTabItems.map((item) => {
                const isPost = activeTab === "posts";
                const id = isPost ? item.postId : item.eventId;
                const type = isPost ? "post" : "event";
                const key = `${type}_${id}`;
                const isVisible = visibleComments.has(key);

                // Якщо це Пост — рендеримо стандартну картку поста
                if (isPost) {
                  return (
                    <article
                      key={key}
                      className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={parseImg(profile.avatarUrl)}
                          className="w-10 h-10 rounded-xl object-cover bg-gray-50"
                          alt="Author"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm leading-none">
                            {profile.username}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Пост
                          </p>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 font-medium whitespace-pre-line">
                        {item.content}
                      </p>

                      {item.imageUrl && (
                        <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100 max-h-[400px]">
                          <img
                            src={parseImg(item.imageUrl)}
                            className="w-full object-cover"
                            alt="Post attachment"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-50 text-xs">
                        <button
                          onClick={() => toggleLike(id)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all font-bold ${
                            likedPosts.has(id) ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {likedPosts.has(id) ? "❤️" : "🤍"} {item.likeCount}
                        </button>

                        <button
                          onClick={() => toggleCommentsVisibility(id, type)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold transition-all ${
                            isVisible ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          💬 Коментарі
                        </button>
                      </div>

                      {/* Блок коментарів для Постів */}
                      {isVisible && renderCommentsBlock(id, type, key)}
                    </article>
                  );
                }

                // Якщо це Подія — рендеримо нову стильну картку, яку ти надіслав
                return (
                  <div
                    key={key}
                    className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 hover:border-blue-100 transition-all duration-300"
                  >
                    {/* Елегантна лінія-акцент під радіус картки */}
                    <div className="absolute left-0 top-8 bottom-8 w-1 bg-blue-500 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <h6 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-none">
                            {item.title}
                          </h6>
                          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-transparent">
                            Active
                          </span>
                        </div>

                        {/* Мета-дані: підпис автора */}
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">
                          Подія • Організовано користувачем {profile.username}
                        </p>

                        <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2 leading-relaxed whitespace-pre-line">
                          {item.description || "Користувач не додав опис події..."}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.location && (
                            <div className="flex items-center text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                              <span className="mr-1.5">📍</span> {item.location}
                            </div>
                          )}
                          <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px]">
                            <span className="mr-1.5">📅</span>
                            {item.startTime && new Date(item.startTime).toLocaleDateString("uk-UA", {
                              day: "numeric",
                              month: "long",
                            })}
                          </div>
                          <div className="flex items-center text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px]">
                            <span className="mr-1.5">👥</span>
                            {item.participantCount} учасників
                          </div>
                          <button
                            onClick={() => toggleJoinEvent(id)}
                            className={`ml-auto px-5 py-2.5 rounded-xl font-black  tracking-wider transition-all active:scale-95 ${
                              joinedEventIds.has(id)
                                ? "bg-gray-100 text-gray-400"
                                : "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/10"
                            }`}
                          >
                            {joinedEventIds.has(id) ? "Скасувати" : "Приєднатись"}
                          </button>
                        </div>               
                      </div>
                    </div>                   
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );

  // Винесена функція рендеру коментарів для чистоти коду
  function renderCommentsBlock(id, type, key) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
          {comments[key]?.map((c, i) => (
            <div key={i} className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100/50">
              <span className="font-black text-[10px] text-blue-600 uppercase block mb-0.5">
                {c.authorUsername}
              </span>
              <p className="text-sm text-gray-600 font-medium">
                {c.content}
              </p>
            </div>
          ))}
          {(!comments[key] || comments[key].length === 0) && (
            <p className="text-center text-xs text-gray-400 py-4 italic">
              Будьте першим, хто прокоментує!
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-50 border border-transparent rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white focus:border-blue-500 transition-all font-medium"
            placeholder="Напишіть коментар..."
            value={commentInputs[key] || ""}
            onChange={(e) =>
              setCommentInputs((prev) => ({
                ...prev,
                [key]: e.target.value,
              }))
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddComment(id, type);
            }}
          />
          <button
            onClick={() => handleAddComment(id, type)}
            className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center active:scale-95"
          >
            🚀
          </button>
        </div>
      </div>
    );
  }
}