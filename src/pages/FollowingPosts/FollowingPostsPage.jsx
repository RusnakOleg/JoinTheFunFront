import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { postsApi } from "../../api/postsApi";
import { commentsApi } from "../../api/commentsApi";
import { likesApi } from "../../api/likesApi";
import { Heart, MessageCircle, MessageCircleMore, SendHorizontal } from "lucide-react";

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

      const likesSet = new Set();
      await Promise.all(
        loadedPosts.map(async (p) => {
          const liked = await likesApi.isLiked(p.postId, userId);
          if (liked.data) likesSet.add(p.postId);
        })
      );
      setLikedPosts(likesSet);
    } catch (err) {
      console.error("Помилка завантаження постів:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- LIKE LOGIC ---
  async function toggleLike(postId) {
    const alreadyLiked = likedPosts.has(postId);
    const dto = { postId, userId };

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
          : p
      )
    );

    try {
      alreadyLiked ? await likesApi.unlike(dto) : await likesApi.like(dto);
    } catch (err) {
      console.error("Like error", err);
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

      const res = await commentsApi.getByPostId(postId);
      setComments((prev) => ({ ...prev, [key]: res.data }));

      setPosts((prev) =>
        prev.map((p) =>
          p.postId === postId ? { ...p, commentCount: p.commentCount + 1 } : p
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || "Помилка при додаванні коментаря");
    }
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto"> {/* Зменшено загальну ширину контенту з max-w-3xl */}
        <h3 className="text-3xl font-black text-gray-900 mb-8 text-center tracking-tight">
          Стрічка підписок
        </h3>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : posts === null ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 font-medium">
              Завантаження публікацій...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-bold text-lg">
                Тут поки порожньо.. 
              </p>
              <p className="text-gray-400 text-sm">
                Підпишіться на когось, щоб бачити їхні пости!
              </p>
            </div>
          ) : (
            posts.map((post) => {
              const key = `post_${post.postId}`;
              const isVisible = visibleComments.has(key);

              return (
                <article
                  key={post.postId}
                  className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  {/* Header (Компактний автор) */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center font-black text-blue-600 text-base uppercase shadow-inner">
                      {post.authorUsername?.charAt(0)}
                    </div>
                    <div>
                    <p className="font-black text-gray-900 tracking-tight leading-none mb-1 text-base">
                        {post.authorUsername}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                       {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                    </p>
                    </div>
                  </div>

                  {/* Текст поста (Компактніший шрифт) */}
                  <p className="text-gray-600 leading-relaxed mb-4 font-medium text-sm sm:text-base">
                    {post.content}
                  </p>

                  {/* Зображення поста (Зменшена висота) */}
                  {post.imageUrl && (
                    <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100 shadow-inner bg-gray-50">
                      <img
                        src={parseImage(post.imageUrl)}
                        className="w-full object-cover max-h-[350px]"
                        alt="Post content"
                      />
                    </div>
                  )}

                  {/* Кнопки взаємодії */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => toggleLike(post.postId)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all font-black text-xs active:scale-95 border ${
                        likedPosts.has(post.postId)
                          ? "bg-red-50 text-red-500 border-red-100 shadow-sm shadow-red-100/50"
                          : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-500"
                      }`}
                    >
                      <span>{likedPosts.has(post.postId) ? <Heart  className="w-4 h-4 text-red-500" strokeWidth={2.8} fill="#ff0000"/> : <Heart  className="w-4 h-4 text-white-500" strokeWidth={2.8}  fill="#ffffff"/>}</span>
                      <span>{post.likeCount}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(post.postId)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs transition-all active:scale-95 border ${
                        isVisible
                          ? "bg-blue-50 text-blue-600 border-blue-100"
                          : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100 hover:text-gray-500"
                      }`}
                    >
                      <MessageCircle className="w-4 h-4 text-white-500" strokeWidth={2.8} /> {post.commentCount}
                    </button>
                  </div>

                  {/* Секція коментарів */}
                  {isVisible && (
                    <div className="mt-4 pt-4 border-t border-gray-50 space-y-3">
                      <div className="max-h-52 overflow-y-auto space-y-2.5 pr-1">
                        {comments[key]?.map((c, i) => (
                          <div
                            key={i}
                            className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-100/50 text-left"
                          >
                            <span className="font-black text-[9px] text-blue-600 uppercase block mb-0.5 tracking-wider">
                              {c.authorUsername}
                            </span>
                            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-normal">
                              {c.content}
                            </p>
                          </div>
                        ))}
                        {(!comments[key] || comments[key].length === 0) && (
                          <p className="text-center text-[11px] text-gray-400 py-3 italic font-medium">
                            Будьте першим, хто прокоментує!
                          </p>
                        )}
                      </div>

                      {/* Поле введення нового коментаря */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-xs sm:text-sm"
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
                          onClick={() => handleAddComment(post.postId)}
                          className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/10 text-xs font-bold"
                        >
                          <SendHorizontal className="w-4 h-4 text-white-500" strokeWidth={2.8}/>
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}