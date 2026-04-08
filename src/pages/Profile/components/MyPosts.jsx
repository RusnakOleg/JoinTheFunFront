import { useState } from "react";

export default function MyPosts({
  posts,
  comments,
  visibleComments,
  toggleComments,
  submitComment,
  toggleLike,
  deletePost,
  openCreatePost,
  show,
  onToggle,
}) {
  const [commentInputs, setCommentInputs] = useState({});

  const handleChange = (postId, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-12 mb-8 gap-4 px-2">
        <div>
          <h5 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
            Мої пости
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-200">
              {posts.length}
            </span>
          </h5>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Ваша персональна хроніка
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-black text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
            onClick={onToggle}
          >
            {show ? "▲ Сховати" : "▼ Показати"}
          </button>

          <button
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
            onClick={openCreatePost}
          >
            + Новий пост
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      {show && posts.length > 0 ? (
        <div className="space-y-10">
          {posts.map((post) => (
            <article
              className="group bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-50 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all relative"
              key={post.postId}
            >
              {/* Delete Button */}
              <button
                className="absolute top-6 right-6 p-2.5 bg-red-50 text-red-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white active:scale-90 z-10"
                onClick={() => {
                  if (window.confirm("Видалити цей пост назавжди?"))
                    deletePost(post.postId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="p-8">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-inner">
                    {post.authorUsername[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 leading-none mb-1 text-base">
                      {post.authorUsername}
                    </p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      Авторська публікація
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 font-medium text-lg whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="rounded-[2rem] overflow-hidden mb-6 bg-gray-50 border border-gray-100 shadow-inner">
                    <img
                      src={`data:image/jpeg;base64,${post.imageUrl}`}
                      className="w-full max-h-[600px] object-cover transition-transform duration-700 hover:scale-105"
                      alt="Media content"
                    />
                  </div>
                )}

                {/* Interaction Stats & Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleLike(post.postId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 font-black text-xs hover:bg-pink-50 hover:text-pink-500 transition-all active:scale-90"
                    >
                      <span>❤️</span> {post.likeCount}
                    </button>
                    <button
                      onClick={() => toggleComments(post.postId)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all active:scale-90 ${
                        visibleComments.has(post.postId)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <span>💬</span> {post.commentCount}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {visibleComments.has(post.postId) && (
                  <div className="mt-6 pt-6 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-3">
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                      {comments[post.postId] ? (
                        <>
                          {comments[post.postId].map((c) => (
                            <div
                              className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 relative"
                              key={c.commentId}
                            >
                              <span className="font-black text-[10px] text-blue-600 uppercase block mb-1">
                                {c.authorUsername}
                              </span>
                              <p className="text-sm text-gray-700 font-medium leading-snug">
                                {c.content}
                              </p>
                            </div>
                          ))}
                          {comments[post.postId].length === 0 && (
                            <p className="text-center text-xs text-gray-400 font-bold py-4">
                              Коментарів ще немає — будьте першим!
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-center py-4">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex gap-3 items-center mt-4">
                      <div className="relative flex-grow">
                        <input
                          className="w-full pl-5 pr-12 py-3.5 text-sm bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-300"
                          placeholder="Ваша думка..."
                          value={commentInputs[post.postId] || ""}
                          onChange={(e) =>
                            handleChange(post.postId, e.target.value)
                          }
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            submitComment(
                              post.postId,
                              commentInputs[post.postId] || "",
                            )
                          }
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-20"
                          disabled={!(commentInputs[post.postId] || "").trim()}
                          onClick={() => {
                            submitComment(
                              post.postId,
                              commentInputs[post.postId] || "",
                            );
                            handleChange(post.postId, "");
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current"
                          >
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : show ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="text-5xl mb-4">✍️</div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
            Ваша стрічка порожня
          </p>
          <button
            onClick={openCreatePost}
            className="mt-4 text-blue-600 font-black text-xs uppercase hover:underline"
          >
            Створити свій перший шедевр
          </button>
        </div>
      ) : null}
    </div>
  );
}
