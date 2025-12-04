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

  const getImage = (base64) => {
    if (!base64) return "";
    return `data:image/jpeg;base64,${base64}`;
  };

  const handleChange = (postId, value) => {
    setCommentInputs({
      ...commentInputs,
      [postId]: value,
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h5 className="fw-semibold mb-0">Мої пости</h5>

        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={onToggle}
          >
            {show ? "⬆ Сховати" : "⬇ Показати"}
          </button>

          <button className="btn btn-success btn-sm" onClick={openCreatePost}>
            Створити пост
          </button>
        </div>
      </div>

      {show &&
        posts.map((post) => (
          <div
            className="card p-3 mb-4 shadow-sm position-relative"
            key={post.postId}
          >
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              onClick={() => deletePost(post.postId)}
            >
              ×
            </button>

            <p className="fw-semibold mb-1">{post.authorUsername}</p>
            <p>{post.content}</p>

            {post.imageUrl && (
              <div className="text-center mb-3">
                <img
                  src={`data:image/jpeg;base64,${post.imageUrl}`}
                  className="img-fluid rounded"
                  style={{ maxWidth: "500px" }}
                />
              </div>
            )}

            <div className="d-flex align-items-center flex-wrap mb-2">
              <span className="me-3">👍 {post.likeCount}</span>
              <span className="me-3">💬 {post.commentCount}</span>

              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => toggleLike(post.postId)}
              >
                Лайк
              </button>

              <button
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => toggleComments(post.postId)}
              >
                {visibleComments.has(post.postId)
                  ? "Сховати коментарі"
                  : "Показати коментарі"}
              </button>
            </div>

            {/* Comments */}
            {visibleComments.has(post.postId) && (
              <div className="list-group mb-3">
                {comments[post.postId] ? (
                  comments[post.postId].map((c) => (
                    <div className="list-group-item" key={c.commentId}>
                      <strong>{c.authorUsername}:</strong> {c.content}
                    </div>
                  ))
                ) : (
                  <div className="text-muted">
                    <em>Завантаження...</em>
                  </div>
                )}
              </div>
            )}

            {/* New comment input */}
            <div className="input-group">
              <input
                className="form-control"
                placeholder="Ваш коментар..."
                value={commentInputs[post.postId] || ""}
                onChange={(e) => handleChange(post.postId, e.target.value)}
              />
              <button
                className="btn btn-success"
                onClick={() => {
                  submitComment(post.postId, commentInputs[post.postId] || "");
                  handleChange(post.postId, "");
                }}
              >
                Надіслати
              </button>
            </div>
          </div>
        ))}
    </>
  );
}
