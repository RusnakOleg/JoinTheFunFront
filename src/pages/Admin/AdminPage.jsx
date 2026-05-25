import React, { useEffect, useState, useMemo } from "react";
import { adminApi } from "../../api/adminApi"; 
import { Search, X } from "lucide-react"; 
import { Link } from "react-router-dom";


// хук для затримки оновлення тексту (Debounce)
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

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Стані для контрольованих інпутів пошуку
  const [searchUsername, setSearchUsername] = useState("");
  const [searchCity, setSearchCity] = useState("");

  // Дебаунс-значення для текстових полів
  const debouncedUsername = useDebounce(searchUsername, 300);
  const debouncedCity = useDebounce(searchCity, 300);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
      setError("Не вдалося завантажити список модерації.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Оптимізована фільтрація за допомогою useMemo
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    const cleanUsername = debouncedUsername.trim().toLowerCase();
    const cleanCity = debouncedCity.trim().toLowerCase();

    return users.filter((u) => {
      // Фільтр нікнейму
      if (cleanUsername && !u.username?.toLowerCase().includes(cleanUsername)) {
        return false;
      }

      // Фільтр міста
      if (cleanCity && !u.city?.toLowerCase().includes(cleanCity)) {
        return false;
      }

      return true;
    });
  }, [users, debouncedUsername, debouncedCity]);

  // Логіка перевірки статусу бану
  const isUserBanned = (lockoutEnd) => {
    if (!lockoutEnd) return false;
    return new Date(lockoutEnd) > new Date();
  };

  // Хендлер блокування
  const handleBan = async (userId) => {
    if (window.confirm("Ви впевнені, що хочете заблокувати цього користувача на 7 днів?")) {
      try {
        await adminApi.banUser(userId, 7);
        fetchUsers(); // Перезавантажуємо дані, щоб оновити інтерфейс
      } catch (err) {
        alert("Помилка при спробі заблокувати користувача.");
      }
    }
  };

  // Хендлер розблокування
  const handleUnban = async (userId) => {
    try {
      await adminApi.unbanUser(userId);
      fetchUsers(); // Перезавантажуємо дані
    } catch (err) {
      alert("Помилка при спробі розблокувати користувача.");
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
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text text-amber-600">
            Модерація користувачів
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Управління користувачами, модерація облікових записів та контроль безпеки JoinTheFun.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 🔍 Блок пошуку (Темний дизайн під адмінку) */}
        <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl shadow-xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Пошук за нікнеймом */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                className="w-full pl-11 pr-10 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium text-gray-200 placeholder-gray-500"
                placeholder="Пошук за нікнеймом..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
              />
              {searchUsername && (
                <button
                  onClick={() => setSearchUsername("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Пошук за містом */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                className="w-full pl-11 pr-10 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium text-gray-200 placeholder-gray-500"
                placeholder="Фільтр за містом..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
              {searchCity && (
                <button
                  onClick={() => setSearchCity("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Таблиця користувачів */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
            <h3 className="font-semibold text-lg text-gray-200">Зареєстровані профілі</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-gray-800 rounded-lg text-gray-400 border border-gray-700">
              Знайдено: {filteredUsers.length}
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30 text-gray-400 text-xs uppercase tracking-wider ">
                  <th className="p-4 font-semibold">Користувач</th>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Місто</th>
                  <th className="p-4 font-semibold">Статус</th>
                  <th className="p-4 font-semibold text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Користувачів не знайдено.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const banned = isUserBanned(u.lockoutEnd);

                    return (
                      <tr key={u.id || u.userId} className="hover:bg-gray-850/40 transition-colors duration-200">
                        {/* Юзернейм */}
                        <td className="p-4">
                        <Link 
                          to={`/admin/user/${u.userId}`} 
                          className="font-semibold text-gray-200 hover:text-indigo-400 transition-colors underline "
                        >
                          {u.username}
                        </Link>
                      </td>
                        
                        {/* ID */}
                        <td className="p-4 text-gray-300 text-sm">
                          {u.userId}
                        </td>
                        
                        {/* Місто */}
                        <td className="p-4 text-gray-400 text-sm">
                          {u.city || "Не вказано"}
                        </td>
                        
                        {/* Статус бейдж */}
                        <td className="p-4">
                          {banned ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                              Забанений до {new Date(u.lockoutEnd).toLocaleDateString()}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              Активний
                            </span>
                          )}
                        </td>
                        
                        {/* Кнопки дій */}
                        <td className="p-4 text-right">
                          {banned ? (
                            <button
                              onClick={() => handleUnban(u.userId)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-md shadow-emerald-900/20 active:scale-95"
                            >
                              Розбанити
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBan(u.userId)}
                              className="px-4 py-1.5 bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white text-xs font-semibold rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-200 active:scale-95"
                            >
                              Забанити
                            </button>
                          )}
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