import React, { useEffect, useState, useMemo } from "react";
import { eventsApi } from "../../api/eventsApi"; 
import { adminApi } from "../../api/adminApi";   
import { Calendar, Trash2, MapPin, User, AlertCircle, Search, X } from "lucide-react";

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

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Контрольований стан для інпуту пошуку міста
  const [searchCity, setSearchCity] = useState("");
  
  // Дебаунс-значення для уникнення зайвих рендерів на кожен символ
  const debouncedCity = useDebounce(searchCity, 300);

  // Функція завантаження всіх подій
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsApi.getAll();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Помилка завантаження подій:", err);
      setError("Не вдалося завантажити список подій для модерації.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Очищення інпуту пошуку
  const handleResetSearch = () => {
    setSearchCity("");
  };

  // Оптимізована фільтрація подій за містом за допомогою useMemo
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    const cleanCity = debouncedCity.trim().toLowerCase();
    
    return events.filter((ev) => {
      if (cleanCity && !ev.location?.toLowerCase().includes(cleanCity)) {
        return false;
      }
      return true;
    });
  }, [events, debouncedCity]);

  // Хендлер видалення події
  const handleDelete = async (eventId, eventTitle) => {
    if (window.confirm(`Ви впевнені, що хочете остаточно видалити подію "${eventTitle}"?`)) {
      try {
        await adminApi.deleteEvent(eventId);
        // Оновлюємо локальний стейт
        setEvents(events.filter((e) => e.id !== eventId && e.eventId !== eventId));
      } catch (err) {
        console.error("Помилка видалення події:", err);
        alert("Помилка при спробі видалити подію.");
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

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-10 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-amber-600">
            Модерація подій
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Перегляд усіх подій та видалення тих, які порушують правила спільноти JoinTheFun.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/*  Панель пошуку в темно-кіберпанк стилі */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl shadow-xl mb-6 flex items-center gap-3 relative">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              className="w-full pl-11 pr-10 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium text-gray-200 placeholder-gray-500"
              placeholder="Введіть назву міста для фільтрації подій (напр. Київ)..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
            {searchCity && (
              <button
                onClick={handleResetSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Таблиця подій */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-200">Активні події на платформі</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-gray-800 rounded-lg text-gray-400 border border-gray-700">
              Знайдено: {filteredEvents.length}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Подія</th>
                  <th className="p-4 font-semibold">Організатор</th>
                  <th className="p-4 font-semibold">Дата та місце</th>
                  <th className="p-4 font-semibold text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 font-medium">
                      {searchCity ? "Нічого не знайдено за цим містом." : "Подій поки що немає або не вдалося знайти."}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((ev) => {
                    const eventId = ev.id || ev.eventId;
                    return (
                      <tr key={eventId} className="hover:bg-gray-850/40 transition-colors duration-200">
                        {/* Назва події */}
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-gray-200 text-base truncate">{ev.title}</div>
                          <div className="text-xs text-gray-400 line-clamp-2 mt-1">{ev.description || "Без опису"}</div>
                        </td>
                        
                        {/* Організатор */}
                        <td className="p-4 text-gray-300 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-400" />
                            <span>{ev.creatorUsername || "Невідомий автор"}</span>
                          </div>
                        </td>
                        
                        {/* Дата та Локація */}
                        <td className="p-4 text-gray-400 text-sm">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-400" />
                              {ev.startTime ? new Date(ev.startTime).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' }) : "Не вказано"}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="truncate max-w-[180px]">{ev.location || "Онлайн / Не вказано"}</span>
                            </div>
                          </div>
                        </td>
                        
                        {/* Кнопка дії */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(eventId, ev.title)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-xs font-semibold rounded-xl border border-red-500/20 hover:border-red-600 transition-all duration-200 active:scale-95 shadow-lg shadow-red-950/20"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Видалити</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}