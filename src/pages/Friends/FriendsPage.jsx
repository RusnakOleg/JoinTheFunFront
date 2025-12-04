import { useEffect, useState } from "react";
import { profileApi } from "../../api/profileApi";
import { interestsApi } from "../../api/interestsApi";
import { Link } from "react-router-dom";

export default function FriendsPage() {
  const [searchCity, setSearchCity] = useState("");
  const [selectedInterestId, setSelectedInterestId] = useState(0);

  const [profiles, setProfiles] = useState(null);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    const interestsResp = await interestsApi.getAll();
    setInterests(interestsResp.data);

    const profilesResp = await profileApi.getAll();
    setProfiles(profilesResp.data);
  }

  async function search() {
    if (searchCity.trim() !== "") {
      const resp = await profileApi.getByCity(searchCity);
      setProfiles(resp.data);
    } else if (selectedInterestId !== 0) {
      const resp = await profileApi.getByInterestId(selectedInterestId);
      setProfiles(resp.data);
    } else {
      const all = await profileApi.getAll();
      setProfiles(all.data);
    }
  }

  async function resetFilters() {
    setSearchCity("");
    setSelectedInterestId(0);

    const resp = await profileApi.getAll();
    setProfiles(resp.data);
  }

  const parseImg = (b64) => {
    if (!b64) return "";
    return `data:image/jpeg;base64,${b64}`;
  };

  return (
    <div className="container mt-4" style={{ maxWidth: "800px" }}>
      <h3 className="fw-bold text-center mb-4">Пошук друзів</h3>

      {/* Фільтри */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3 align-items-end">
          {/* Місто */}
          <div className="col-md-6">
            <label className="form-label">Місто</label>
            <input
              className="form-control"
              placeholder="Пошук за містом"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>

          {/* Інтерес */}
          <div className="col-md-6">
            <label className="form-label">Інтерес</label>
            <select
              className="form-select"
              value={selectedInterestId}
              onChange={(e) => setSelectedInterestId(Number(e.target.value))}
            >
              <option value="0">Усі інтереси</option>
              {interests.map((i) => (
                <option key={i.interestId} value={i.interestId}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary me-2" onClick={search}>
              Шукати
            </button>
            <button className="btn btn-secondary" onClick={resetFilters}>
              Скинути
            </button>
          </div>
        </div>
      </div>

      {/* Результати */}
      {profiles === null ? (
        <div className="text-center text-muted">
          <em>Профілі не завантажено...</em>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center">
          <strong>Нічого не знайдено.</strong>
        </div>
      ) : (
        profiles.map((profile) => (
          <Link
            to={`/user-profile/${profile.userId}`}
            key={profile.userId}
            className="text-decoration-none text-dark"
          >
            <div className="card p-3 mb-3 shadow-sm">
              <div className="d-flex align-items-center">
                <img
                  src={parseImg(profile.avatarUrl)}
                  className="rounded-circle me-3"
                  style={{ width: 64, height: 64, objectFit: "cover" }}
                />

                <div>
                  <h5 className="mb-1">{profile.username}</h5>
                  <p className="mb-1 text-muted">
                    {profile.city}, {profile.age}
                  </p>
                  <p className="mb-1">{profile.description}</p>
                  <p className="mb-0">
                    <strong>Інтереси:</strong>{" "}
                    {profile.interests?.join(", ") || "немає"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}
