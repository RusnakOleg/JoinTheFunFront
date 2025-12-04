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
  const { userId: profileUserId } = useParams(); // id з URL
  const { user } = useAuth(); // авторизований юзер
  const currentUserId = user?.userId;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());

  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});

  const [showEvents, setShowEvents] = useState(true);
  const [showPosts, setShowPosts] = useState(true);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    loadData();
  }, [profileUserId]);

  async function loadData() {
    try {
      const profileRes = await profileApi.getByUserId(profileUserId);
      setProfile(profileRes.data);

      const postsRes = await postsApi.getAll();
      const filteredPosts = postsRes.data.filter(
        (p) => p.authorUsername === profileRes.data.username
      );
      setPosts(filteredPosts);

      const eventsRes = await eventsApi.getAll();
      const filteredEvents = eventsRes.data.filter(
        (e) => e.creatorUsername === profileRes.data.username
      );
      setEvents(filteredEvents);

      // new comments model for each post
      const nc = {};
      filteredPosts.forEach((p) => {
        nc[p.postId] = {
          postId: p.postId,
          userId: currentUserId,
          content: "",
        };
      });
      setNewComments(nc);

      // follow state
      const followRes = await followApi.isFollowing(
        currentUserId,
        profileUserId
      );
      setIsFollowing(followRes.data);

      // events joined
      const joined = await participantsApi.getByUserId(currentUserId);
      setJoinedEventIds(new Set(joined.data.map((p) => p.eventId)));
    } catch (err) {
      console.error(err);
    }
  }

  // ---------------- FOLLOW ----------------
  async function toggleFollow() {
    const dto = { followerId: currentUserId, followedId: profileUserId };

    if (isFollowing) await followApi.unfollow(dto);
    else await followApi.follow(dto);

    setIsFollowing(!isFollowing);
  }

  // ---------------- LIKE ----------------
  async function toggleLike(postId) {
    const dto = { postId, userId: currentUserId };
    const liked = await likesApi.isLiked(postId, currentUserId);

    if (liked.data) await likesApi.unlike(dto);
    else await likesApi.like(dto);

    refreshPosts();
  }

  async function refreshPosts() {
    const postsRes = await postsApi.getAll();
    setPosts(
      postsRes.data.filter((p) => p.authorUsername === profile.username)
    );
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

  // ---------------- JOIN EVENT ----------------
  async function joinEvent(eventId) {
    await participantsApi.add({
      eventId,
      userId: currentUserId,
      status: "going",
    });
    reloadEventData();
  }

  async function leaveEvent(eventId) {
    await participantsApi.remove({ eventId, userId: currentUserId });
    reloadEventData();
  }

  async function reloadEventData() {
    const eventsRes = await eventsApi.getAll();
    setEvents(
      eventsRes.data.filter((e) => e.creatorUsername === profile.username)
    );

    const joined = await participantsApi.getByUserId(currentUserId);
    setJoinedEventIds(new Set(joined.data.map((p) => p.eventId)));
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : "";

  // ------------------- RENDER -------------------
  if (!profile)
    return <div className="text-center text-muted mt-4">Завантаження...</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* LEFT COLUMN */}
        <div className="col-md-4">
          <div className="position-sticky" style={{ top: "6rem" }}>
            <div className="card p-4 shadow-sm mb-4">
              <div className="d-flex align-items-center mb-3">
                <img
                  src={parseImage(profile.avatarUrl)}
                  className="rounded-circle me-3"
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />
                <div>
                  <h4>{profile.username}</h4>
                  <p className="text-muted">
                    {profile.city}, {profile.age}
                  </p>
                </div>
              </div>

              <p>{profile.description}</p>
              <p>
                <strong>Інтереси: </strong>
                {profile.interests.join(", ")}
              </p>

              {profileUserId !== currentUserId && (
                <button
                  className={`btn btn-sm ${
                    isFollowing ? "btn-danger" : "btn-primary"
                  }`}
                  onClick={toggleFollow}
                >
                  {isFollowing ? "Відписатись" : "Підписатись"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-md-8">
          {/* EVENTS */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold">Події користувача</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowEvents(!showEvents)}
            >
              {showEvents ? "⬆ Сховати" : "⬇ Показати"}
            </button>
          </div>

          {showEvents &&
            (events.length === 0 ? (
              <p className="text-muted">Подій немає.</p>
            ) : (
              events.map((ev) => (
                <div key={ev.eventId} className="card mb-3 shadow-sm">
                  <div className="card-body">
                    <h6>{ev.title}</h6>
                    <p>
                      {ev.location} —{" "}
                      {new Date(ev.startTime).toLocaleDateString()}
                    </p>
                    <p>Учасників: {ev.participantCount}</p>

                    {joinedEventIds.has(ev.eventId) ? (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => leaveEvent(ev.eventId)}
                      >
                        Вийти
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => joinEvent(ev.eventId)}
                      >
                        Долучитись
                      </button>
                    )}
                  </div>
                </div>
              ))
            ))}

          {/* POSTS */}
          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h5 className="fw-semibold">Пости користувача</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowPosts(!showPosts)}
            >
              {showPosts ? "⬆ Сховати" : "⬇ Показати"}
            </button>
          </div>

          {showPosts &&
            (posts.length === 0 ? (
              <p className="text-muted">Постів немає.</p>
            ) : (
              posts.map((post) => (
                <div key={post.postId} className="card p-3 mb-4 shadow-sm">
                  <p className="fw-semibold">{post.authorUsername}</p>
                  <p>{post.content}</p>

                  {post.imageUrl && (
                    <div className="text-center mb-3">
                      <img
                        src={parseImage(post.imageUrl)}
                        className="img-fluid rounded"
                        style={{ maxWidth: 500 }}
                      />
                    </div>
                  )}

                  <div className="d-flex align-items-center mb-2">
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
                        ? "Сховати"
                        : "Показати"}
                    </button>
                  </div>

                  {visibleComments.has(post.postId) && (
                    <div className="mb-3">
                      {comments[post.postId] ? (
                        comments[post.postId].map((c, i) => (
                          <div key={i} className="list-group-item">
                            <strong>{c.authorUsername}: </strong>
                            {c.content}
                          </div>
                        ))
                      ) : (
                        <div className="text-muted">Завантаження...</div>
                      )}
                    </div>
                  )}

                  {/* COMMENT INPUT */}
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
              ))
            ))}
        </div>
      </div>
    </div>
  );
}
