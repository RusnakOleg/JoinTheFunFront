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
    imageUrl: "",
    creatorId: user?.userId,
  });

  const handleChange = (e) =>
    setModel({ ...model, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setModel({ ...model, imageUrl: reader.result.split(",")[1] });
    reader.readAsDataURL(file);
  };

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
    <div className="min-h-screen bg-[#f8f9fd] flex items-center justify-center p-4 animate-in fade-in duration-500">
      {/* Декоративний фон */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-8 sm:p-10 relative z-10 border border-white">
        {/* Кнопка назад */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-50 text-gray-400 hover:text-blue-600 hover:shadow-md transition-all active:scale-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
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

        <div className="text-center mt-6 mb-8">
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
            Нова подія
          </h3>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Створіть незабутній івент
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Завантаження фото
          <div className="relative">
            {!model.imageUrl ? (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-100 rounded-[1.5rem] cursor-pointer bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
                <div className="flex flex-col items-center justify-center pt-2">
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    📸
                  </span>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    Додати обкладинку
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="relative rounded-[1.5rem] overflow-hidden h-24 border border-blue-100 shadow-inner group">
                <img
                  src={`data:image/jpeg;base64,${model.imageUrl}`}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => setModel({ ...model, imageUrl: "" })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest transition-opacity"
                >
                  Видалити фото
                </button>
              </div>
            )}
          </div> */}

          {/* Назва */}
          <input
            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-sm font-bold placeholder:text-gray-300"
            name="title"
            placeholder="Назва вашої події"
            value={model.title}
            onChange={handleChange}
            required
          />

          {/* Опис */}
          <textarea
            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium min-h-[100px] max-h-[150px] resize-none placeholder:text-gray-300"
            name="description"
            placeholder="Розкажіть детальніше..."
            value={model.description}
            onChange={handleChange}
          ></textarea>

          {/* Локація та Час */}
          <div className="space-y-3">
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm group-focus-within:scale-110 transition-transform">
                📍
              </span>
              <input
                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all"
                name="location"
                placeholder="Місто / локація"
                value={model.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm">
                📅
              </span>
              <input
                type="datetime-local"
                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-[1.25rem] focus:bg-white focus:border-blue-500 outline-none text-sm font-bold transition-all"
                name="startTime"
                value={model.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Кнопка "Опублікувати" */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 mt-4 bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-gray-200 disabled:shadow-none"
          >
            {loading ? "Публікація..." : "Створити подію"}
          </button>
        </form>
      </div>
    </div>
  );
}
