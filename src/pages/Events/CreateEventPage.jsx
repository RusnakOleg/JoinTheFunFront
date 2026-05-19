import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventsApi } from "../../api/eventsApi";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    imageUrl: "", // Залишаємо порожнім, оскільки фотографій немає
    creatorId: user?.userId,
  });

  const handleChange = (e) =>
    setModel({ ...model, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await eventsApi.create(model);
      navigate("/profile");
    } catch (err) {
      console.error("Помилка при створенні події:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* М'який декоративний фон, що наслідує сторінку авторизації */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-purple-50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[420px] bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 sm:p-8 relative z-10 border border-gray-100">
        {/* Кнопка Повернення */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-700 transition-all active:scale-90 border border-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Заголовок форми */}
        <div className="text-center mt-6 mb-8">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">
            Створення події
          </h3>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1.5">
            Організуйте новий івент
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Поле: Назва */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Назва події
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
              name="title"
              placeholder="Наприклад: Вечір настільних ігор"
              value={model.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Поле: Опис */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Детальний опис
            </label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300 min-h-[90px] max-h-[140px] resize-none leading-relaxed"
              name="description"
              placeholder="Про що цей захід, правила, що з собою брати..."
              value={model.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Поле: Локація (Місто / Місце зустрічі) */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Локація
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm group-focus-within:scale-105 transition-transform pointer-events-none">
                📍
              </span>
              <input
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm text-gray-900 placeholder:text-gray-300"
                name="location"
                placeholder="Місто, парк, антикафе тощо"
                value={model.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Поле: Час проведення */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-1.5 ml-1">
              Дата та час початку
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                📅
              </span>
              <input
                type="datetime-local"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-sm text-gray-700"
                name="startTime"
                value={model.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Кнопка відправки форми */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-95 transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Публікація...
              </>
            ) : (
              "Опублікувати подію"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}