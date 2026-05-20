import { Image } from "lucide-react";
import { useState } from "react";
import { ukraineCities } from "../../../data/ukraineCities";

export default function ProfileEditForm({
  editModel,
  setEditModel,
  allInterests,
  updateProfile,
}) {
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setEditModel({
      ...editModel,
      [e.target.name]: e.target.value,
    });
  };

  const toggleInterest = (id) => {
    const selected = editModel.interestIds.includes(id);

    setEditModel({
      ...editModel,
      interestIds: selected
        ? editModel.interestIds.filter((x) => x !== id)
        : [...editModel.interestIds, id],
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setEditModel({ ...editModel, avatarUrl: reader.result.split(",")[1] });

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(editModel);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h6 className="text-xl font-bold text-gray-800">Редагувати профіль</h6>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Налаштування
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Аватар Секція */}
        <div className="flex flex-col items-center sm:flex-row gap-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-gray-200">
              {editModel.avatarUrl ? (
                <img
                  src={`data:image/jpeg;base64,${editModel.avatarUrl}`}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Image className="w-6 h-6 " strokeWidth={2.8} />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-bold text-gray-700">
              Фото профілю
            </label>
            <input
              type="file"
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer transition-all"
              onChange={handleAvatarUpload}
            />
          </div>
        </div>

        {/* Місто та Вік в один рядок */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Випадаючий список міст */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Місто
            </label>
            <div className="relative">
              <select
                name="city"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer text-gray-700 font-medium"
                value={editModel.city || ""}
                onChange={handleChange}
              >
                <option value="" disabled hidden>Місто...</option>
                {ukraineCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {/* Кастомна стрілочка для гарного вигляду селекту */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">
              Вік
            </label>
            <input
              name="age"
              type="number"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              placeholder="25"
              value={editModel.age}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Стать */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Стать
          </label>
          <div className="relative">
            <select
              name="gender"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer"
              value={editModel.gender}
              onChange={handleChange}
            >
              <option value="Male">Чоловіча</option>
              <option value="Female">Жіноча</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Опис */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Про себе
          </label>
          <textarea
            name="description"
            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[100px] resize-none"
            placeholder="Розкажіть щось цікаве..."
            value={editModel.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Інтереси - Інтерактивні теги */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-500 uppercase ml-1">
            Ваші інтереси
          </label>
          <div className="flex flex-wrap gap-2">
            {allInterests.map((i) => {
              const isActive = editModel.interestIds.includes(i.interestId);
              return (
                <button
                  key={i.interestId}
                  type="button"
                  onClick={() => toggleInterest(i.interestId)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500"
                  }`}
                >
                  {isActive && <span className="mr-1">✓</span>}
                  {i.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Кнопка збереження */}
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl shadow-blue-500/25 mt-4"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Збереження...
            </span>
          ) : (
            "Оновити профіль"
          )}
        </button>
      </form>
    </div>
  );
}