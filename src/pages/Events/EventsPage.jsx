import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { eventsApi } from "../../api/eventsApi";
import { participantsApi } from "../../api/participantsApi";
import { useAuth } from "../../context/AuthContext";
import { CalendarDays, MapPin, Plus, User, Users } from "lucide-react";

// Хук для затримки оновлення тексту (Debounce)
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.userId;

  // Кешуємо всі завантажені події та Set з ID подій, де користувач бере участь
  const [allEvents, setAllEvents] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  
  // Контрольовані стани для інпутів (для миттєвого відображення введення)
  const [searchCity, setSearchCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Дебаунс-значення для текстового поля міста
  const debouncedCity = useDebounce(searchCity, 300);

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  async function loadData() {
    setLoading(true);
    try {
      // Завантажуємо все паралельно
      const [eventsRes, joinedRes] = await Promise.all([
        eventsApi.getAll(),
        participantsApi.getByUserId(userId)
      ]);

      setAllEvents(eventsRes.data);
      setJoinedEventIds(new Set(joinedRes.data.map((p) => p.eventId)));
    } catch (err) {
      console.error("Помилка завантаження даних подій:", err);
    } finally {
      setLoading(false);
    }
  }

  // Очищення фільтрів
  function handleReset() {
    setSearchCity("");
    setFilterStatus("all");
  }

  // Оптимізована та миттєва фільтрація за допомогою useMemo
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];

    const cleanCity = debouncedCity.trim().toLowerCase();

    return allEvents.filter((ev) => {
      // 1. Фільтр за містом (частковий збіг, незалежно від регістру)
      if (cleanCity && !ev.location?.toLowerCase().includes(cleanCity)) {
        return false;
      }

      // 2. Фільтр за статусом участі
      const isJoined = joinedEventIds.has(ev.eventId);
      if (filterStatus === "joined" && !isJoined) return false;
      if (filterStatus === "not_joined" && isJoined) return false;

      return true;
    });
  }, [allEvents, debouncedCity, filterStatus, joinedEventIds]);

  // Функція запису/видалення з події (зі збереженням локального стану)
  async function toggleJoin(eventId) {
    const isJoined = joinedEventIds.has(eventId);

    // Оптимістично оновлюємо статус участі в Set
    setJoinedEventIds((prev) => {
      const next = new Set(prev);
      isJoined ? next.delete(eventId) : next.add(eventId);
      return next;
    });

    // Оптимістично змінюємо лічильник учасників у масиві всіх подій
    setAllEvents((prev) =>
      prev ? prev.map((ev) =>
        ev.eventId === eventId
          ? {
              ...ev,
              participantCount: isJoined
                ? ev.participantCount - 1
                : ev.participantCount + 1,
            }
          : ev
      ) : null
    );

    try {
      if (isJoined) {
        await participantsApi.remove({ eventId, userId });
      } else {
        await participantsApi.add({ eventId, userId, status: "going" });
      }
    } catch (err) {
      console.error("Join/Leave error:", err);
      loadData(); // Якщо сервер повернув помилку — перекачуємо актуальні дані
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-green-500/10 transition-all active:scale-95"
            onClick={() => navigate("/create-event")}
          >
            <Plus className="w-4 h-4" strokeWidth={2.8} /> 
            <span>Створити подію</span>
          </button>
        </div>

        {/* Панель пошуку та фільтрації */}
        <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 mb-8 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-2">
            <input
              className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
              placeholder="Введіть назву міста (напр. Київ)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 text-gray-700 px-5 py-3 rounded-2xl font-bold text-sm border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none cursor-pointer appearance-none min-w-[180px]"
            >
              <option value="all">Усі події</option>
              <option value="joined">Я беру участь</option>
              <option value="not_joined">Я не беру участь</option>
            </select>

            <button
              className="bg-gray-100 text-gray-500 px-5 py-3 rounded-2xl font-bold text-sm transition-all hover:bg-gray-200 active:scale-95 w-full sm:w-auto"
              onClick={handleReset}
            >
              Скинути
            </button>
          </div>
        </div>

        {/* Стрічка подій */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : allEvents === null ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 font-medium">
            Завантаження списку подій...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12  rounded-[2rem] p-8  ">
            <p className="text-gray-500 font-bold text-lg">Нічого не знайдено</p>
            <p className="text-gray-400 text-sm mt-1">
              {filterStatus === "joined" 
                ? "Ви ще не долучилися до жодної події." 
                : filterStatus === "not_joined"
                ? "Ви берете участь в усіх знайдених подіях."
                : "Спробуйте змінити параметри пошуку міста."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev) => (
              <div
                key={ev.eventId}
                className="group bg-white p-5 sm:p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Верхня плашка: Іконка + Місто */}
                  <div className="flex items-center justify-between mb-4">                    
                    <span className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-gray-100">
                      <MapPin className="w-4 h-4 text-red-500" /> {ev.location}
                    </span>         
                  </div>

                  {/* Назва та опис */}
                  <h5 className="text-lg font-black text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {ev.title}
                  </h5>

                  <p className="text-gray-500 text-xs sm:text-sm font-medium line-clamp-2 mb-3 h-9 leading-relaxed">
                    {ev.description || "Опис події відсутній"}
                  </p>

                  {/* Інформаційні деталі */}
                  <div className="space-y-2.5 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs shadow-inner">
                        <CalendarDays className="w-4 h-4 text-gray-500"/>
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {new Date(ev.startTime).toLocaleString("uk-UA", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-xs shadow-inner">
                        <Users className="w-4 h-4 text-gray-500"/>
                      </div>
                      <span className="text-xs font-bold text-gray-600">
                        {ev.participantCount} учасників
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-xs shadow-inner">
                        <User className="w-4 h-4 text-gray-500"/>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate max-w-[180px]">
                        Автор: {ev.creatorUsername}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Кнопка дії */}
                <button
                  className={`w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 border ${
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