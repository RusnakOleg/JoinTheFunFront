import { useEffect, useState } from "react";
import { profileApi } from "../../api/profileApi";
import { interestsApi } from "../../api/interestsApi";
import { Link } from "react-router-dom";

export default function FriendsPage() {
  const [searchCity, setSearchCity] = useState("");
  const [selectedInterestId, setSelectedInterestId] = useState(0);
  const [profiles, setProfiles] = useState(null);
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      const [interestsResp, profilesResp] = await Promise.all([
        interestsApi.getAll(),
        profileApi.getAll(),
      ]);
      setInterests(interestsResp.data);
      setProfiles(profilesResp.data);
    } catch (err) {
      console.error("Помилка завантаження даних:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    setLoading(true);
    try {
      let resp;
      if (searchCity.trim() !== "") {
        resp = await profileApi.getByCity(searchCity);
      } else if (selectedInterestId !== 0) {
        resp = await profileApi.getByInterestId(selectedInterestId);
      } else {
        resp = await profileApi.getAll();
      }
      setProfiles(resp.data);
    } catch (err) {
      console.error("Помилка пошуку:", err);
    } finally {
      setLoading(false);
    }
  }

  async function resetFilters() {
    setSearchCity("");
    setSelectedInterestId(0);
    setLoading(true);
    try {
      const resp = await profileApi.getAll();
      setProfiles(resp.data);
    } finally {
      setLoading(false);
    }
  }

  const parseImg = (b64) => {
    return b64
      ? `data:image/jpeg;base64,${b64}`
      : "https://via.placeholder.com/150";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-3xl font-black text-gray-900 mb-8 text-center tracking-tight">
          Знайти нових друзів 🔍
        </h3>

        {/* Фільтри */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Місто
              </label>
              <input
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Київ, Львів..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Інтерес
              </label>
              <select
                className="w-full px-5 py-3 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-medium appearance-none"
                value={selectedInterestId}
                onChange={(e) => setSelectedInterestId(Number(e.target.value))}
              >
                <option value="0">Усі категорії</option>
                {interests.map((i) => (
                  <option key={i.interestId} value={i.interestId}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Пошук
              </button>
              <button
                onClick={resetFilters}
                className="px-6 bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
              >
                Скинути
              </button>
            </div>
          </div>
        </div>

        {/* Результати */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : profiles === null ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-300 text-gray-400 font-medium">
              Завантаження профілів...
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-gray-100">
              <p className="text-gray-500 font-bold text-lg">
                На жаль, нікого не знайдено 😔
              </p>
              <p className="text-gray-400 text-sm">
                Спробуйте змінити параметри пошуку
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {profiles.map((profile) => (
                <Link
                  to={`/user-profile/${profile.userId}`}
                  key={profile.userId}
                  className="group"
                >
                  <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="relative">
                      <img
                        src={parseImg(profile.avatarUrl)}
                        className="w-20 h-20 rounded-2xl object-cover shadow-inner bg-gray-100"
                        alt={profile.username}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h5 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                          {profile.username}
                        </h5>
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black rounded-full uppercase tracking-tighter">
                          {profile.city} • {profile.age} р.
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mb-3 line-clamp-2 italic">
                        {profile.description || "Користувач не додав опис"}
                      </p>

                      <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                        {profile.interests?.length > 0 ? (
                          profile.interests.map((interest, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-lg uppercase tracking-wider"
                            >
                              #{interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider italic">
                            Без інтересів
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
