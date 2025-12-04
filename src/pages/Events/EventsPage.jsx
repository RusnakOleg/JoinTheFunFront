import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { eventsApi } from "../../api/eventsApi";
import { participantsApi } from "../../api/participantsApi";
import { useAuth } from "../../context/AuthContext";

export default function EventsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const userId = user?.userId;

  const [events, setEvents] = useState(null);
  const [joinedEventIds, setJoinedEventIds] = useState(new Set());
  const [searchCity, setSearchCity] = useState("");

  useEffect(() => {
    if (userId) loadData();
  }, [userId]);

  async function loadData() {
    const eventsRes = await eventsApi.getAll();
    setEvents(eventsRes.data);

    const joinedRes = await participantsApi.getByUserId(userId);
    setJoinedEventIds(new Set(joinedRes.data.map((p) => p.eventId)));
  }

  async function search() {
    if (searchCity.trim() !== "") {
      const res = await eventsApi.getByLocation(searchCity);
      setEvents(res.data);
    } else {
      const res = await eventsApi.getAll();
      setEvents(res.data);
    }

    const joinedRes = await participantsApi.getByUserId(userId);
    setJoinedEventIds(new Set(joinedRes.data.map((p) => p.eventId)));
  }

  async function reset() {
    setSearchCity("");
    loadData();
  }

  async function joinEvent(eventId) {
    await participantsApi.add({
      eventId,
      userId,
      status: "going",
    });

    loadData();
  }

  async function leaveEvent(eventId) {
    await participantsApi.remove({
      eventId,
      userId,
    });

    loadData();
  }

  const parseImage = (base64) =>
    base64 ? `data:image/jpeg;base64,${base64}` : "";

  return (
    <div className="container mt-4">
      <h3 className="mb-4 fw-bold text-center">Список подій</h3>

      <div className="d-flex justify-content-center">
        <div style={{ width: "100%", maxWidth: "800px" }}>
          {/* Search + Create Button */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
            {/* Search */}
            <div
              className="d-flex"
              style={{ maxWidth: "500px", width: "100%" }}
            >
              <input
                className="form-control me-2"
                placeholder="Пошук за містом"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
              />

              <button className="btn btn-primary me-2" onClick={search}>
                Шукати
              </button>

              <button className="btn btn-secondary" onClick={reset}>
                Скинути
              </button>
            </div>

            {/* Create Event */}
            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/create-event")}
            >
              Створити подію
            </button>
          </div>

          {/* Events list */}
          {!events ? (
            <div className="text-muted text-center">
              <em>Події не завантажено...</em>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center">
              <strong>Нічого не знайдено.</strong>
            </div>
          ) : (
            events.map((ev) => (
              <div key={ev.eventId} className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title fw-semibold">{ev.title}</h5>
                  <p className="card-text">{ev.description}</p>

                  <ul className="list-unstyled mb-3">
                    <li>
                      <strong>Місце:</strong> {ev.location}
                    </li>
                    <li>
                      <strong>Час:</strong>{" "}
                      {new Date(ev.startTime).toLocaleString()}
                    </li>
                    <li>
                      <strong>Учасників:</strong> {ev.participantCount}
                    </li>
                    <li>
                      <strong>Автор:</strong> {ev.creatorUsername}
                    </li>
                  </ul>

                  {joinedEventIds.has(ev.eventId) ? (
                    <button
                      className="btn btn-danger"
                      onClick={() => leaveEvent(ev.eventId)}
                    >
                      Вийти з події
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={() => joinEvent(ev.eventId)}
                    >
                      Долучитися
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
