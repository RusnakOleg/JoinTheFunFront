import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import { postsApi } from "../../api/postsApi";
import { commentsApi } from "../../api/commentsApi";
import { likesApi } from "../../api/likesApi";

export default function FollowingPostsPage() {
  const { user } = useAuth();
  const userId = user?.userId;

  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [visibleComments, setVisibleComments] = useState(new Set());

  useEffect(() => {
    if (!userId) return;
    loadPosts();
  }, [userId]);

  async function loadPosts() {
    const res = await postsApi.getFollowing(userId);
    const loadedPosts = res.data;

    setPosts(loadedPosts);

    const nc = {};
    loadedPosts.forEach((p) => {
      nc[p.postId] = {
        postId: p.postId,
        userId: userId,
        content: "",
      };
    });

    setNewComments(nc);
  }

  async function refreshPosts() {
    const res = await postsApi.getFollowing(userId);
    setPosts(res.data);
  }

  // ---------------- LIKE ----------------
  async function toggleLike(postId) {
    const dto = { postId, userId };

    const liked = await likesApi.isLiked(postId, userId);

    if (liked.data) await likesApi.unlike(dto);
    else await likesApi.like(dto);

    refreshPosts();
  }

  // ---------------- COMMENTS ----------------
  async function toggleComments(postId) {
    const newSet = new Set(visibleComments);

    if (newSet.has(postId)) {
      newSet.delete(postId);
      setVisibleComments(newSet);
      return;
    }

    newSet.add(postId);
    setVisibleComments(newSet);

    if (!comments[postId]) {
      const res = await commentsApi.getByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: res.data }));
    }
  }

  async function submitComment(postId) {
    const dto = newComments[postId];
    if (!dto.content.trim()) return;

    await commentsApi.create(dto);

    setNewComments((prev) => ({
      ...prev,
      [postId]: { ...prev[postId], content: "" },
    }));

    const updated = await commentsApi.getByPostId(postId);
    setComments((prev) => ({ ...prev, [postId]: updated.data }));

    refreshPosts();
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : "";

  // ---------------- RENDER ----------------
  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold text-center">Пости</h3>

      <div className="d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "700px" }}>
          {!posts ? (
            <div className="text-center text-muted">Завантаження...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted">
              <em>Постів не знайдено.</em>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.postId} className="card mb-4 shadow-sm">
                <div className="card-body">
                  <h6 className="card-subtitle mb-2 text-muted">
                    {post.authorUsername}
                  </h6>

                  <p className="card-text">{post.content}</p>

                  {post.imageUrl && (
                    <div className="text-center mb-3">
                      <img
                        src={parseImage(post.imageUrl)}
                        className="img-fluid rounded"
                        style={{ maxWidth: "500px" }}
                      />
                    </div>
                  )}

                  <div className="d-flex align-items-center mb-2 flex-wrap">
                    <span className="me-3">👍 {post.likeCount}</span>
                    <span className="me-3">💬 {post.commentCount}</span>

                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => toggleLike(post.postId)}
                    >
                      Лайк
                    </button>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => toggleComments(post.postId)}
                    >
                      {visibleComments.has(post.postId)
                        ? "Сховати коментарі"
                        : "Показати коментарі"}
                    </button>
                  </div>

                  {/* COMMENTS */}
                  {visibleComments.has(post.postId) && (
                    <div className="mt-3">
                      {comments[post.postId] ? (
                        <div className="list-group mb-3">
                          {comments[post.postId].map((c, i) => (
                            <div key={i} className="list-group-item">
                              <strong>{c.authorUsername}: </strong>
                              {c.content}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted">
                          <em>Завантаження коментарів...</em>
                        </div>
                      )}

                      {/* NEW COMMENT FORM */}
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={newComments[post.postId]?.content || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [post.postId]: {
                                ...prev[post.postId],
                                content: e.target.value,
                              },
                            }))
                          }
                          placeholder="Ваш коментар..."
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => submitComment(post.postId)}
                        >
                          Надіслати
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
