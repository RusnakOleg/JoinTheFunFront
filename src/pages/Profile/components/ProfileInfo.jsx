export default function ProfileInfo({ profile }) {
  const getImage = (base64) => {
    if (!base64) return "https://via.placeholder.com/80"; // Заглушка, якщо фото немає
    return `data:image/jpeg;base64,${base64}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
      {/* HEADER: Avatar + Name */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative">
          <img
            src={getImage(profile.avatarUrl)}
            className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-blue-50"
            alt="avatar"
          />
          {/* Індикатор онлайн (опціонально для соцмережі) */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
        </div>

        <div>
          <h5 className="text-xl font-bold text-gray-900 leading-tight">
            {profile.username}
          </h5>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-1">
            <span>📍 {profile.city || "Місто не вказано"}</span>
            <span className="text-gray-300 mx-1">•</span>
            <span>{profile.age} років</span>
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}
      {profile.description && (
        <div className="mb-5">
          <p className="text-gray-700 leading-relaxed italic text-sm bg-gray-50 p-3 rounded-xl border-l-4 border-blue-400">
            "{profile.description}"
          </p>
        </div>
      )}

      {/* INTERESTS: Переробив на бейджі, так набагато стильніше */}
      <div>
        <h6 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Інтереси
        </h6>
        <div className="flex flex-wrap gap-2">
          {profile.interests && profile.interests.length > 0 ? (
            profile.interests.map((interest, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-default"
              >
                {interest}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm italic">
              Інтереси не додано
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
