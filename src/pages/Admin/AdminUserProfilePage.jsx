import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { profileApi } from "../../api/profileApi";
import { postsApi } from "../../api/postsApi";
import { eventsApi } from "../../api/eventsApi";
import { adminApi } from "../../api/adminApi";
import { User, Calendar, FileText, Trash2, MapPin, ShieldAlert, ArrowLeft, AlertCircle } from "lucide-react";
import { parseImg } from "../../helpers/imageParser";

export default function AdminUserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Стан для активного таба: за замовчуванням виводимо "posts"
  const [activeTab, setActiveTab] = useState("posts");

  // Завантаження всіх даних про користувача паралельно
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileRes, postsRes, eventsRes] = await Promise.all([
        profileApi.getByUserId(userId),
        postsApi.getAll(),
        eventsApi.getAll()
      ]);

      setUserProfile(profileRes.data);

      // Фільтруємо пости автора за іменем або ID
      const filteredPosts = postsRes.data.filter(
        (post) => 
          post.userId === userId || 
          post.creatorId === userId || 
          post.authorUsername === profileRes.data.username
      );
      setUserPosts(filteredPosts);

      // Фільтруємо події автора за іменем або ID
      const filteredEvents = eventsRes.data.filter(
        (event) => 
          event.userId === userId || 
          event.creatorId === userId || 
          event.creatorUsername === profileRes.data.username
      );
      setUserEvents(filteredEvents);

    } catch (err) {
      console.error("Помилка завантаження даних користувача:", err);
      setError("Не вдалося завантажити повну інформацію про користувача.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadUserData();
  }, [userId]);

  // Перевірка бану
  const isUserBanned = (lockoutEnd) => {
    if (!lockoutEnd) return false;
    return new Date(lockoutEnd) > new Date();
  };

  // Хендлери дій адміна
  const handleBanToggle = async () => {
    const banned = isUserBanned(userProfile?.lockoutEnd);
    if (banned) {
      try {
        await adminApi.unbanUser(userId);
        loadUserData();
      } catch (err) {
        alert("Помилка при спробі розблокувати користувача.");
      }
    } else {
      if (window.confirm("Ви впевнені, що хочете заблокувати цього користувача на 7 днів?")) {
        try {
          await adminApi.banUser(userId, 7);
          loadUserData();
        } catch (err) {
          alert("Помилка при спробі заблокувати користувача.");
        }
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Видалити цю публікацію остаточно?")) {
      try {
        await postsApi.delete(postId);
        setUserPosts(userPosts.filter((p) => p.id !== postId && p.postId !== postId));
      } catch (err) {
        alert("Не вдалося видалити пост.");
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Видалити цю подію остаточно?")) {
      try {
        await eventsApi.delete(eventId);
        setUserEvents(userEvents.filter((e) => e.id !== eventId && e.eventId !== eventId));
      } catch (err) {
        alert("Не вдалося видалити подію.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-white flex flex-col items-center justify-center">
        <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Користувача не знайдено."}</span>
        </div>
        <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад до списку
        </button>
      </div>
    );
  }

  const banned = isUserBanned(userProfile.lockoutEnd);

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-10 text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Кнопка Повернення */}
        <button 
          onClick={() => navigate("/admin")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-400 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Назад до користувачів
        </button>

        {/*  КАРТКА ПРОФІЛЮ КОРИСТУВАЧА */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-gray-100">{userProfile.username}</h1>
                {banned ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                    Забанений
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Активний
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-xs mt-1">ID: {userId}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-500" /> {userProfile.city || "Місто не вказано"}</span>
                {userProfile.age && <span>• {userProfile.age} років</span>}
              </div>
            </div>
          </div>

          {/* Кнопка бану / розбану */}
          <button
            onClick={handleBanToggle}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 border ${
              banned 
                ? "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent shadow-lg shadow-emerald-950/30" 
                : "bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border-red-500/20 hover:border-red-600"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{banned ? "Розблокувати" : "Забанити на 7 днів"}</span>
          </button>
        </div>

        {/* Про себе */}
        {userProfile.description && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Про користувача</h4>
            <p className="text-gray-300 text-sm italic leading-relaxed">"{userProfile.description}"</p>
          </div>
        )}

        {/* ПАНЕЛЬ СВІТЧУ (ТАБИ) */}
        <div className="bg-gray-900 p-2 border border-gray-800 rounded-2xl shadow-xl flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "posts"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-850"
            }`}
          >
            <FileText className="w-4 h-4" />
            ПОСТИ ({userPosts.length})
          </button>
          
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
              activeTab === "events"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-850"
            }`}
          >
            <Calendar className="w-4 h-4" />
            ПОДІЇ ({userEvents.length})
          </button>
        </div>

        {/*  КОНТЕНТ ОБРАНОГО ТАБА */}
        <div className="transition-all duration-300">
          {activeTab === "posts" ? (
          /* СПИСОК ПОСТІВ */
            <div className="space-y-4">
            {userPosts.length === 0 ? (
                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl text-center text-gray-500 text-sm">
                Немає активних публікацій від цього профілю.
                </div>
            ) : (
                userPosts.map((post) => {
                const currentPostId = post.id || post.postId;
                return (
                    <div 
                    key={currentPostId} 
                    className="bg-gray-900 border border-gray-800 p-5 rounded-2xl relative hover:border-gray-700 transition-colors shadow-md flex flex-col"
                    >
                    {/* Контентний блок */}
                    <div className="space-y-4 w-full pr-12"> {/* pr-12 захищає текст від налізання на кнопку видалення */}
                        
                        {/* Текст поста */}
                        <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {post.content || post.title}
                        </p>

                        {/* Дата публікації */}
                        {post.createdAt && (
                        <span className="text-[10px] text-gray-500 block pt-1">
                            Опубліковано: {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        )}
                    </div>

                    {/* Фото поста на всю ширину картки (з однаковими відступами з обох боків) */}
                    {post.imageUrl && (
                        <div className="relative rounded-xl overflow-hidden border border-gray-800/60 bg-gray-950/50 w-full mt-4">
                        <img 
                            src={parseImg(post.imageUrl)} 
                            alt="Post attachment" 
                            className="w-full h-auto max-h-[450px] object-cover block"
                        />
                        </div>
                    )}

                    {/* Кнопка видалення, позиціонована чітко в кутку */}
                    <button
                        onClick={() => handleDeletePost(currentPostId)}
                        className="absolute top-5 right-5 p-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl border border-red-500/10 transition-all shrink-0 active:scale-95 shadow-md"
                        title="Видалити пост"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                    </div>
                );
                })
            )}
            </div>
          ) : (
            /* СПИСОК ПОДІЙ */
            <div className="space-y-4">
            {userEvents.length === 0 ? (
                <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-2xl text-center text-gray-500 text-sm">
                Користувач не створив жодної події.
                </div>
            ) : (
                userEvents.map((ev) => {
                const currentEventId = ev.id || ev.eventId;
                return (
                    <div 
                    key={currentEventId} 
                    className="group relative bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 shadow-md flex flex-col justify-between gap-4"
                    >
                    
                    {/* Основна інформація */}
                    <div className="space-y-3 pr-12"> 
                        <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="font-extrabold text-gray-100 text-lg  transition-colors tracking-tight">
                            {ev.title}
                        </h4>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase rounded-md border border-emerald-500/20">
                            Активна
                        </span>
                        </div>

                        {/* Опис події */}
                        <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-2 whitespace-pre-line">
                        {ev.description || "Користувач не додав опис події..."}
                        </p>

                        {/* Теги з мета-даними  */}
                        <div className="flex flex-wrap gap-2 pt-1">
                        {/* Місце проведення */}
                        <div className="flex items-center text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0" />
                            <span className="truncate max-w-[200px]">{ev.location || "Онлайн / Не вказано"}</span>
                        </div>

                        {/* Дата та час */}
                        <div className="flex items-center text-xs font-semibold text-gray-300 bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700">
                            <Calendar className="w-3.5 h-3.5 text-amber-500 mr-1.5 shrink-0" />
                            {ev.startTime 
                            ? new Date(ev.startTime).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' }) 
                            : "Не вказано"
                            }
                        </div>

                        {/* Кількість учасників */}
                        {ev.participantCount !== undefined && (
                            <div className="flex items-center text-xs font-semibold text-gray-300 bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700">
                            <span className="text-indigo-400 font-bold mr-1">●</span>
                            {ev.participantCount} учасників
                            </div>
                        )}
                        </div>
                    </div>

                    {/* Кнопка видалення події в правому кутку */}
                    <button
                        onClick={() => handleDeleteEvent(currentEventId)}
                        className="absolute top-6 right-6 inline-flex items-center justify-center p-2.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-xl border border-red-500/20 hover:border-red-600 transition-all duration-200 active:scale-95 shadow-lg"
                        title="Видалити подію"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                    </div>
                );
                })
            )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}