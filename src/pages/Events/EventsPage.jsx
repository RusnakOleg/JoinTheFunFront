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
      console.error("Error loading events:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    setLoading(true);
    const res = searchCity.trim()
      ? await eventsApi.getByLocation(searchCity)
      : await eventsApi.getAll();
    setEvents(res.data);
    setLoading(false);
  }

  async function handleReset() {
    setSearchCity("");
    loadData();
  }

  async function toggleJoin(eventId) {
    const isJoined = joinedEventIds.has(eventId);

    // Оптимістичне оновлення UI
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
          : ev,
      ),
    );

    try {
      if (isJoined) {
        await participantsApi.remove({ eventId, userId });
      } else {
        await participantsApi.add({ eventId, userId, status: "going" });
      }
    } catch (err) {
      console.error("Join/Leave error:", err);
      loadData(); // Відкочуємо стан у разі помилки
    }
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : null;

  if (loading && !events)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FD]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Відкрий <span className="text-blue-600">Події</span>
            </h3>
            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-1">
              Знайди цікаві заходи у своєму місті
            </p>
          </div>

          <button
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-200 transition-all active:scale-95"
            onClick={() => navigate("/create-event")}
          >
            + Створити подію
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 mb-12 flex flex-col sm:flex-row gap-3">
          <input
            className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="📍 Введіть назву міста (напр. Київ)..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-100"
              onClick={handleSearch}
            >
              Пошук
            </button>
            <button
              className="bg-gray-100 text-gray-500 px-6 py-4 rounded-2xl font-black text-sm uppercase transition-all hover:bg-gray-200"
              onClick={handleReset}
            >
              ✖
            </button>
          </div>
        </div>

        {/* Grid of Events */}
        {events?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <span className="text-5xl mb-4 block">🏜️</span>
            <p className="text-gray-400 font-black uppercase tracking-widest">
              Нічого не знайдено
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events?.map((ev) => (
              <div
                key={ev.eventId}
                className="group bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/10"
              >
                {/* Event Image Cover
                <div className="h-52 relative overflow-hidden">
                  <img
                    src={
                      parseImage(ev.imageUrl) ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={ev.title}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                      📍 {ev.location}
                    </span>
                  </div>
                </div> */}

                {/* Event Details */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="text-xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {ev.title}
                    </h5>
                  </div>

                  <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 h-10">
                    {ev.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs">
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 text-xs">
                        👥
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {ev.participantCount} учасників
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 text-xs">
                        👤
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Автор: {ev.creatorUsername}
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                      joinedEventIds.has(ev.eventId)
                        ? "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-none shadow-none"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                    }`}
                    onClick={() => toggleJoin(ev.eventId)}
                  >
                    {joinedEventIds.has(ev.eventId)
                      ? "Скасувати участь"
                      : "Долучитися"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
