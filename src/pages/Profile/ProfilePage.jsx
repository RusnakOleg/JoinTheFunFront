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

  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState(new Set());

  const [showEvents, setShowEvents] = useState(true);
  const [showPosts, setShowPosts] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);

  const [newPost, setNewPost] = useState({
    content: "",
    imageUrl: "",
    userId,
  });

  // --------------------------
  // INITIAL LOAD
  // --------------------------
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const p = await profileApi.getByUserId(userId);
    setProfile(p.data);

    const interests = await interestsApi.getAll();
    setAllInterests(interests.data);

    const allPosts = await postsApi.getAll();
    const filtered = allPosts.data.filter(
      (x) => x.authorUsername === p.data.username
    );
    setPosts(filtered);

    const events = await eventsApi.getAll();
    const mine = events.data.filter(
      (x) => x.creatorUsername === p.data.username
    );
    setUserEvents(mine);

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

  // --------------------------
  // POST CREATION
  // --------------------------
  async function createPost() {
    await postsApi.create(newPost);
    setShowPostModal(false);
    await refreshPosts();
  }

  async function refreshPosts() {
    const allPosts = await postsApi.getAll();
    const filtered = allPosts.data.filter(
      (x) => x.authorUsername === profile.username
    );
    setPosts(filtered);
  }

  // --------------------------
  // LIKE TOGGLE
  // --------------------------
  async function toggleLike(postId) {
    const dto = { postId, userId };

    const likedResp = await likesApi.isLiked(postId, userId);
    const isLiked = likedResp.data;

    if (isLiked) await likesApi.unlike(dto);
    else await likesApi.like(dto);

    await refreshPosts();
  }

  // --------------------------
  // COMMENTS
  // --------------------------
  async function toggleComments(postId) {
    const newSet = new Set(visibleComments);

    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);

      if (!comments[postId]) {
        const resp = await commentsApi.getByPostId(postId);
        setComments((prev) => ({
          ...prev,
          [postId]: resp.data,
        }));
      }
    }

    setVisibleComments(newSet);
  }

  async function submitComment(postId, text) {
    const dto = {
      postId,
      userId,
      content: text,
    };

    await commentsApi.create(dto);

    const refreshed = await commentsApi.getByPostId(postId);
    setComments((prev) => ({
      ...prev,
      [postId]: refreshed.data,
    }));

    await refreshPosts();
  }

  // --------------------------
  // DELETE EVENT
  // --------------------------
  async function deleteEvent(eventId) {
    await eventsApi.delete(eventId);
    const all = await eventsApi.getAll();
    setUserEvents(
      all.data.filter((x) => x.creatorUsername === profile.username)
    );
  }

  // --------------------------
  // DELETE POST
  // --------------------------
  async function deletePost(postId) {
    await postsApi.delete(postId);
    await refreshPosts();
  }

  // --------------------------
  // UPDATE PROFILE
  // --------------------------
  async function updateProfile(data) {
    await profileApi.update(userId, data);
    await loadData();
  }

  if (!profile || !editModel) {
    return (
      <div className="text-center mt-5">
        <em>Завантаження...</em>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-center mb-4">Мій профіль</h3>

      <div className="row gx-4 gy-4">
        {/* LEFT COLUMN */}
        <div className="col-lg-4">
          <div
            style={{ maxHeight: "130vh", overflowY: "auto", paddingRight: 4 }}
          >
            <ProfileInfo profile={profile} />
            <ProfileEditForm
              editModel={editModel}
              setEditModel={setEditModel}
              allInterests={allInterests}
              updateProfile={updateProfile}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-lg-8">
          <MyEvents
            events={userEvents}
            onToggle={() => setShowEvents(!showEvents)}
            show={showEvents}
            deleteEvent={deleteEvent}
          />

          <MyPosts
            posts={posts}
            comments={comments}
            visibleComments={visibleComments}
            toggleComments={toggleComments}
            submitComment={submitComment}
            toggleLike={toggleLike}
            deletePost={deletePost}
            openCreatePost={() => setShowPostModal(true)}
            show={showPosts}
            onToggle={() => setShowPosts(!showPosts)}
          />
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
