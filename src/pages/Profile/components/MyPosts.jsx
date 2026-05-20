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
    <div className="max-w-2xl mx-auto w-full">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-1">
        <div>
          
          <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 ml-0.5">
            Ваша персональна хроніка
          </h5>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          

          <button
            className="flex-1 sm:flex-none px-5 py-3 text-xs font-black uppercase tracking-widest  bg-green-500 hover:bg-green-600 text-white rounded-xl  transition-all shadow-lg shadow-blue-600/10 active:scale-95"
            onClick={openCreatePost}
          >
            + Новий пост
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      {show && posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              className="group bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden hover:border-blue-100 transition-all duration-300 relative"
              key={post.postId}
            >
              {/* Delete Button - Адаптована кнопка видалення */}
              <button
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 text-gray-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-100 border border-transparent shadow-sm flex items-center justify-center active:scale-95 z-10"
                onClick={() => {
                  if (window.confirm("Видалити цей пост назавжди?")) {
                    deletePost(post.postId);
                  }
                }}
                title="Видалити пост"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <div className="p-6 sm:p-8">
                {/* Author Info */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-500/10">
                    {post.authorUsername[0].toUpperCase()}
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

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-4 font-medium text-base whitespace-pre-wrap">
                  {post.content}
                </p>

                {/* Post Image */}
                {post.imageUrl && (
                  <div className="rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100 shadow-inner max-h-[450px]">
                    <img
                      src={`data:image/jpeg;base64,${post.imageUrl}`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-102"
                      alt="Media content"
                    />
                  </div>
                )}

                {/* Interaction Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleLike(post.postId)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 text-gray-500 font-black text-xs hover:bg-pink-50 hover:text-pink-500 transition-all active:scale-95"
                    >
                      <span>❤️</span> {post.likeCount}
                    </button>
                    <button
                      onClick={() => toggleComments(post.postId)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs transition-all active:scale-95 ${
                        visibleComments.has(post.postId)
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                          : "bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    >
                      <span>💬</span> {post.commentCount}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {visibleComments.has(post.postId) && (
                  <div className="mt-5 pt-5 border-t border-gray-50 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                      {comments[post.postId] ? (
                        <>
                          {comments[post.postId].map((c) => (
                            <div
                              className="bg-gray-50 p-3.5 rounded-2xl border border-transparent relative"
                              key={c.commentId}
                            >
                              <span className="font-black text-[10px] text-blue-600 uppercase block mb-0.5 tracking-wide">
                                {c.authorUsername}
                              </span>
                              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                                {c.content}
                              </p>
                            </div>
                          ))}
                          {comments[post.postId].length === 0 && (
                            <p className="text-center text-xs text-gray-400 font-medium italic py-4">
                              Коментарів ще немає — будьте першим!
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex justify-center py-4">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Comment Input */}
                    <div className="flex gap-3 items-center mt-3">
                      <div className="relative flex-grow">
                        <input
                          className="w-full pl-4 pr-12 py-3 text-sm bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium placeholder:text-gray-300"
                          placeholder="Ваша думка..."
                          value={commentInputs[post.postId] || ""}
                          onChange={(e) =>
                            handleChange(post.postId, e.target.value)
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && (commentInputs[post.postId] || "").trim()) {
                              submitComment(post.postId, commentInputs[post.postId]);
                              handleChange(post.postId, "");
                            }
                          }}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-20"
                          disabled={!(commentInputs[post.postId] || "").trim()}
                          onClick={() => {
                            submitComment(post.postId, commentInputs[post.postId]);
                            handleChange(post.postId, "");
                          }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-4 h-4 fill-current"
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
        <div className="text-center py-12">
            <p className="text-gray-500 font-bold text-lg">Ваша стрічка порожня</p>
            <p className="text-gray-400 text-sm"> Створіть свій перший шедевр!</p>
          </div>

        
      ) : null}
    </div>
  );
}