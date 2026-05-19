import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { eventsApi } from "../../api/eventsApi";
import { participantsApi } from "../../api/participantsApi";
import { useAuth } from "../../context/AuthContext";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;

  const [events, setEvents] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [searchCity, setSearchCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  async function loadData() {
    setLoading(true);
    try {
      const eventsRes = await eventsApi.getAll();
      setEvents(eventsRes.data);

      const joinedRes = await participantsApi.getByUserId(userId);
      setJoinedEventIds(new Set(joinedRes.data.map((p) => p.eventId)));
    } catch (err) {
      console.error("Помилка завантаження подій:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    setLoading(true);
    try {
      const res = searchCity.trim()
        ? await eventsApi.getByLocation(searchCity)
        : await eventsApi.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error("Помилка пошуку:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setSearchCity("");
    setLoading(true);
    try {
      const eventsRes = await eventsApi.getAll();
      setEvents(eventsRes.data);
    } catch (err) {
      console.error("Помилка скидання:", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleJoin(eventId) {
    const isJoined = joinedEventIds.has(eventId);

    setJoinedEventIds((prev) => {
      const next = new Set(prev);
      isJoined ? next.delete(eventId) : next.add(eventId);
      return next;
    });

    setEvents((prev) =>
      prev.map((ev) =>
        ev.eventId === eventId
          ? {
              ...ev,
              participantCount: isJoined
                ? ev.participantCount - 1
                : ev.participantCount + 1,
            }
          : ev
      )
    );

    try {
      if (isJoined) {
        await participantsApi.remove({ eventId, userId });
      } else {
        await participantsApi.add({ eventId, userId, status: "going" });
      }
    } catch (err) {
      console.error("Join/Leave error:", err);
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Панель заголовка */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              Відкрий нові події
            </h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Знайди цікаві заходи у своєму місті
            </p>
          </div>

          <button
            className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/10 transition-all active:scale-95"
            onClick={() => navigate("/create-event")}
          >
            + Створити подію
          </button>
        </div>

        {/* Пошук */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 mb-8 flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
            placeholder="📍 Введіть назву міста (напр. Київ)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/10"
              onClick={handleSearch}
            >
              Пошук
            </button>
            <button
              className="bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl font-bold text-sm transition-all hover:bg-gray-200 active:scale-95"
              onClick={handleReset}
            >
              ✖
            </button>
          </div>
        </div>

        {/* Стрічка подій */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : events === null ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 font-medium">
            Завантаження списку подій...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-bold text-lg">Нічого не знайдено..</p>
            <p className="text-gray-400 text-sm">Спробуйте змінити параметри пошуку міста</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.eventId}
                className="group bg-white p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Верхня плашка: Іконка + Місто */}
                  <div className="flex items-center justify-between mb-4">
                    
                    <span className="bg-gray-50 text-gray-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-100">
                      📍 {ev.location}
                    </span>
                  </div>

                  {/* Назва та опис */}
                  <h5 className="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {ev.title}
                  </h5>

                  <p className="text-gray-500 text-xs sm:text-sm font-medium line-clamp-2 mb-5 h-9 leading-relaxed">
                    {ev.description || "Опис події відсутній"}
                  </p>

                  {/* Інформаційні деталі */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs shadow-inner">
                        📅
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {new Date(ev.startTime).toLocaleString("uk-UA", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-xs shadow-inner">
                        👥
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {ev.participantCount} учасників
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-xs shadow-inner">
                        👤
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate max-w-[180px]">
                        Автор: {ev.creatorUsername}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Кнопка дії (Завжди притиснута до низу картки) */}
                <button
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 border ${
                    joinedEventIds.has(ev.eventId)
                      ? "bg-gray-100 text-gray-400 border-transparent hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                      : "bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-lg shadow-blue-500/10"
                  }`}
                  onClick={() => toggleJoin(ev.eventId)}
                >
                  {joinedEventIds.has(ev.eventId) ? "Скасувати участь" : "Долучитися"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}