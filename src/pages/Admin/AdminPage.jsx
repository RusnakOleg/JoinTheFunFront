import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi"; // перевірь правильність шляху до твого adminApi

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Функція завантаження списку користувачів
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
          <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Панель Адміністратора
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

        {/* Таблиця користувачів */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-gray-800 bg-gray-900/50">
            <h3 className="font-semibold text-lg text-gray-200">Зареєстровані профілі</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/30 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Користувач</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Місто</th>
                  <th className="p-4 font-semibold">Статус</th>
                  <th className="p-4 font-semibold text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Користувачів не знайдено.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const banned = isUserBanned(u.lockoutEnd);

                    return (
                      <tr key={u.id || u.userId} className="hover:bg-gray-850/40 transition-colors duration-200">
                        {/* Юзернейм */}
                        <td className="p-4">
                          <div className="font-semibold text-gray-200">{u.username}</div>
                          <div className="text-xs text-gray-500">ID: {u.userId?.substring(0, 8)}...</div>
                        </td>
                        
                        {/* Email */}
                        <td className="p-4 text-gray-300 text-sm">
                          {u.email || "—"}
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