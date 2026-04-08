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

  // Стан для коментарів та їх видимості
  const [comments, setComments] = useState({}); // { post_1: [...], event_5: [...] }
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
          ? {
              ...p,
              likeCount: alreadyLiked ? p.likeCount - 1 : p.likeCount + 1,
            }
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
      // Завантажуємо коментарі, якщо їх ще немає в стейті
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

    // Оновлюємо список коментарів
    const res =
      type === "post"
        ? await commentsApi.getByPostId(id)
        : await commentsApi.getByEventId(id);
    setComments((prev) => ({ ...prev, [key]: res.data }));

    // Оновлюємо лічильник (тільки для візуалізації, якщо є в об'єкті)
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

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : null;

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-gray-100 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <img
                src={
                  parseImage(profile.avatarUrl) ||
                  "https://via.placeholder.com/150"
                }
                className="w-32 h-32 rounded-[2rem] object-cover ring-4 ring-blue-50 mb-4"
                alt="Avatar"
              />
              <h2 className="text-2xl font-black text-gray-900">
                {profile.username}
              </h2>
              <p className="text-blue-500 font-bold text-sm uppercase tracking-widest mt-1">
                {profile.city} • {profile.age} р.
              </p>

              <div className="mt-6 w-full space-y-4 text-left">
                <div className="p-4 bg-gray-50 rounded-2xl text-gray-600 text-sm leading-relaxed">
                  {profile.description || "Опис профілю відсутній..."}
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                    Інтереси
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((it, idx) => (
                      <span
                        key={idx}
                        className="bg-white border border-gray-100 text-gray-600 px-3 py-1 rounded-xl text-xs font-bold shadow-sm"
                      >
                        #{it}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {profileUserId !== currentUserId && (
                <button
                  onClick={toggleFollow}
                  className={`w-full mt-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg ${isFollowing ? "bg-gray-100 text-gray-500" : "bg-blue-600 text-white shadow-blue-200"}`}
                >
                  {isFollowing ? "Відписатись" : "Підписатись"}
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN */}
        <main className="lg:col-span-8 space-y-6">
          <div className="bg-white p-2 rounded-2xl flex gap-2 shadow-sm border border-gray-100">
            {["posts", "events"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === t ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"}`}
              >
                {t === "posts" ? "Пости" : "Події"} (
                {t === "posts" ? posts.length : events.length})
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {(activeTab === "posts" ? posts : events).map((item) => {
              const isPost = activeTab === "posts";
              const id = isPost ? item.postId : item.eventId;
              const type = isPost ? "post" : "event";
              const key = `${type}_${id}`;
              const isVisible = visibleComments.has(key);

              return (
                <article
                  key={key}
                  className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <img
                        src={parseImage(profile.avatarUrl)}
                        className="w-10 h-10 rounded-xl object-cover"
                        alt="Author"
                      />
                      <div>
                        <p className="font-black text-gray-900 text-sm leading-none">
                          {profile.username}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {isPost
                            ? "Пост"
                            : `Подія • ${item.startTime?.split("T")[0]}`}
                        </p>
                      </div>
                      {!isPost && (
                        <span className="ml-auto text-blue-600 font-black text-xs uppercase tracking-tighter bg-blue-50 px-3 py-1 rounded-lg">
                          📍 {item.location}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                      {item.content || item.description}
                    </p>

                    {/* Post Image */}
                    {isPost && item.imageUrl && (
                      <div className="rounded-[2rem] overflow-hidden mb-6 border border-gray-50">
                        <img
                          src={parseImage(item.imageUrl)}
                          className="w-full object-cover max-h-[400px]"
                          alt="Post"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      {isPost && (
                        <button
                          onClick={() => toggleLike(id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs ${likedPosts.has(id) ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"}`}
                        >
                          {likedPosts.has(id) ? "❤️" : "🤍"} {item.likeCount}
                        </button>
                      )}

                      <button
                        onClick={() => toggleCommentsVisibility(id, type)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${isVisible ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"}`}
                      >
                        💬 Коментарі
                      </button>

                      {!isPost && (
                        <button
                          onClick={() => toggleJoinEvent(id)}
                          className={`ml-auto px-6 py-2 rounded-xl font-black text-xs uppercase transition-all ${joinedEventIds.has(id) ? "bg-gray-100 text-gray-400" : "bg-green-500 text-white shadow-lg shadow-green-200"}`}
                        >
                          {joinedEventIds.has(id)
                            ? "Скасувати"
                            : `Приєднатись (${item.participantCount})`}
                        </button>
                      )}
                    </div>

                    {/* Comments Expansion */}
                    {isVisible && (
                      <div className="mt-6 pt-6 border-t border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                          {comments[key]?.map((c, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-2xl">
                              <span className="font-black text-[10px] text-blue-600 uppercase block mb-1">
                                {c.authorUsername}
                              </span>
                              <p className="text-sm text-gray-600 font-medium">
                                {c.content}
                              </p>
                            </div>
                          ))}
                          {(!comments[key] || comments[key].length === 0) && (
                            <p className="text-center text-xs text-gray-400 py-4">
                              Будьте першим, хто прокоментує!
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                            placeholder="Напишіть коментар..."
                            value={commentInputs[key] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleAddComment(id, type)}
                            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all"
                          >
                            🚀
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
