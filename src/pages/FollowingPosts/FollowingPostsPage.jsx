import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { postsApi } from "../../api/postsApi";
import { commentsApi } from "../../api/commentsApi";
import { likesApi } from "../../api/likesApi";

export default function FollowingPostsPage() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [posts, setPosts] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadPosts();
  }, [userId]);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await postsApi.getFollowing(userId);
      const loadedPosts = res.data;
      setPosts(loadedPosts);

      // Отримуємо лайки паралельно для швидкості
      const likesSet = new Set();
      await Promise.all(
        loadedPosts.map(async (p) => {
          const liked = await likesApi.isLiked(p.postId, userId);
          if (liked.data) likesSet.add(p.postId);
        }),
      );
      setLikedPosts(likesSet);
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- LIKE LOGIC ---
  async function toggleLike(postId) {
    const alreadyLiked = likedPosts.has(postId);
    const dto = { postId, userId };

    // Оновлюємо UI миттєво (Optimistic Update)
    setLikedPosts((prev) => {
      const next = new Set(prev);
      alreadyLiked ? next.delete(postId) : next.add(postId);
      return next;
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

    try {
      alreadyLiked ? await likesApi.unlike(dto) : await likesApi.like(dto);
    } catch (err) {
      console.error("Like error", err);
      // Якщо помилка — повертаємо назад (можна додати логіку rollback)
    }
  }

  // --- COMMENTS LOGIC ---
  async function toggleComments(postId) {
    const key = `post_${postId}`;
    const newVisible = new Set(visibleComments);

    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
      if (!comments[key]) {
        const res = await commentsApi.getByPostId(postId);
        setComments((prev) => ({ ...prev, [key]: res.data }));
      }
    }
    setVisibleComments(newVisible);
  }

  async function handleAddComment(postId) {
    const key = `post_${postId}`;
    const text = commentInputs[key];
    if (!text?.trim()) return;

    const dto = { postId, userId, content: text };

    try {
      await commentsApi.create(dto);
      setCommentInputs((prev) => ({ ...prev, [key]: "" }));

      // Оновлюємо список коментарів
      const res = await commentsApi.getByPostId(postId);
      setComments((prev) => ({ ...prev, [key]: res.data }));

      // Оновлюємо лічильник у пості
      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId ? { ...p, commentCount: p.commentCount + 1 } : p,
        ),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Помилка при додаванні коментаря");
    }
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : null;

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-3xl font-black text-gray-900 mb-8 text-center uppercase tracking-tighter">
          Стрічка <span className="text-blue-600">підписок</span>
        </h3>

        <div className="space-y-8">
          {posts?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200 text-gray-400 font-bold">
              Тут поки порожньо. Підпишіться на когось! ✨
            </div>
          ) : (
            posts?.map((post) => {
              const key = `post_${post.postId}`;
              const isVisible = visibleComments.has(key);

              return (
                <article
                  key={post.postId}
                  className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-blue-900/10"
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600 uppercase">
                        {post.authorUsername.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-sm leading-none">
                          {post.authorUsername}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          Нещодавно
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 leading-relaxed mb-6 font-medium text-lg">
                      {post.content}
                    </p>

                    {/* Image */}
                    {post.imageUrl && (
                      <div className="rounded-[2rem] overflow-hidden mb-6 shadow-inner border border-gray-50">
                        <img
                          src={parseImage(post.imageUrl)}
                          className="w-full object-cover max-h-[500px]"
                          alt="Post content"
                        />
                      </div>
                    )}

                    {/* Interactions */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      <button
                        onClick={() => toggleLike(post.postId)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition-all font-black text-xs active:scale-90 ${
                          likedPosts.has(post.postId)
                            ? "bg-red-50 text-red-500 shadow-sm"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {likedPosts.has(post.postId) ? "❤️" : "🤍"}{" "}
                        {post.likeCount}
                      </button>

                      <button
                        onClick={() => toggleComments(post.postId)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all active:scale-90 ${
                          isVisible
                            ? "bg-blue-50 text-blue-600"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        💬 {post.commentCount} коментарів
                      </button>
                    </div>

                    {/* Comments Section */}
                    {isVisible && (
                      <div className="mt-6 pt-6 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-2">
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                          {comments[key]?.map((c, i) => (
                            <div
                              key={i}
                              className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50"
                            >
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

                        {/* New Comment Input */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                            placeholder="Напишіть щось цікаве..."
                            value={commentInputs[key] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleAddComment(post.postId)}
                            className="bg-blue-600 text-white px-5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
                          >
                            🚀
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
