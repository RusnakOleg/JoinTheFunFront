import React, { useEffect, useState } from "react";
import { interestsApi } from "../../api/interestsApi";
import { adminApi } from "../../api/adminApi";
import { Plus, Trash2, Tag, AlertCircle, Loader2 } from "lucide-react";

export default function AdminInterestsPage() {
  const [interests, setInterests] = useState([]);
  const [newInterestName, setNewInterestName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Завантаження всіх інтересів
  const fetchInterests = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await interestsApi.getAll();
      setInterests(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("Помилка завантаження інтересів:", err);
      setError("Не вдалося завантажити список інтересів.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  // Додавання нового інтересу
  const handleCreateInterest = async (e) => {
    e.preventDefault();
    const name = newInterestName.trim();
    
    if (!name) return;

    try {
      setSubmitting(true);
      await adminApi.createInterest({ name: name });
      setNewInterestName("");
      await fetchInterests();
    } catch (err) {
      console.error("Помилка створення інтересу:", err);
      alert("Не вдалося створити інтерес. Можливо, він уже існує.");
    } finally {
      setSubmitting(false);
    }
  };

  // Видалення інтересу
  const handleDeleteInterest = async (id, name) => {
    if (!id) {
      alert("Помилка: Не вдалося визначити ID цього інтересу. Перевірте структуру даних API.");
      return;
    }

    if (window.confirm(`Ви впевнені, що хочете видалити інтерес "${name}"?`)) {
      try {
        await adminApi.deleteInterest(id);
        // Видаляємо елемент зі стейту за будь-яким з можливих ID
        setInterests(interests.filter((item) => {
          const itemId = item.id || item.interestId || item.Id;
          return itemId !== id;
        }));
      } catch (err) {
        console.error("Помилка видалення інтересу:", err);
        alert("Не вдалося видалити інтерес.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-500" />
          <span className="text-sm text-gray-500 font-medium">Синхронізація матриці інтересів...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-10 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* ЗАГОЛОВОК СТОРІНКИ */}
        <div className="mb-8">
          <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-amber-600">
              Керування інтересами
            </h1>
          <p className="text-gray-400 mt-2 text-sm">
               Додавання, перегляд та видалення інтересів платформи JoinTheFun.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* ФОРМА ДОДАВАННЯ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Створити новий інтерес</h3>
          <form onSubmit={handleCreateInterest} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newInterestName}
                onChange={(e) => setNewInterestName(e.target.value)}
                placeholder="Наприклад: Сноубординг, Настільні ігри..."
                className="w-full pl-11 pr-10 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium text-gray-200 placeholder-gray-500"
                maxLength={40}
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newInterestName.trim()}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-indigo-950/50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>Додати</span>
            </button>
          </form>
        </div>

        {/* СПИСОК ІНТЕРЕСІВ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-200">Інтереси на платформі</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-gray-800 rounded-lg text-gray-400 border border-gray-700">
            Знайдено: {interests.length}
          </span>
          </div>
          

          {interests.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">
              База даних порожня. Створіть перший інтерес вище!
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((item, index) => {
   
                  const interestId =item.interestId 
                  const name = item.name 
                  
                  return (
                    <div
                      key={interestId || `interest-${index}`}
                      className="group flex justify-between items-center p-3.5 bg-gray-950/40 border border-gray-800 hover:border-gray-700/80 rounded-xl transition-all duration-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-sm shadow-indigo-400" />
                        <span className="text-gray-300 text-sm font-medium truncate group-hover:text-gray-100 transition-colors">
                          {name}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteInterest(interestId, name)}
                        className="p-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg border border-red-500/10 hover:border-red-600 transition-all active:scale-90 shrink-0 md:opacity-0 group-hover:opacity-100"
                        title={`Видалити "${name}"`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}