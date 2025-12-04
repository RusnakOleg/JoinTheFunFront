import { Link } from "react-router-dom";

export default function MyEvents({ events, show, onToggle, deleteEvent }) {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0">Мої події</h5>

        <div>
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            onClick={onToggle}
          >
            {show ? "▲ Сховати" : "▼ Показати"}
          </button>

          {/* НОВА КНОПКА */}
          <Link to="/create-event" className="btn btn-outline-success btn-sm">
            Створити подію
          </Link>
        </div>
      </div>

      {show && (
        <>
          {events.length === 0 ? (
            <p className="text-muted">Подій не знайдено.</p>
          ) : (
            events.map((ev) => (
              <div className="card p-3 mb-3 shadow-sm" key={ev.eventId}>
                <strong>{ev.title}</strong> – {ev.location} (
                {new Date(ev.startTime).toLocaleDateString()})
                <br />
                <small>Кількість учасників: {ev.participantCount}</small>
                <button
                  className="btn btn-sm btn-danger float-end"
                  onClick={() => deleteEvent(ev.eventId)}
                >
                  Видалити
                </button>
              </div>
            ))
          )}
        </>
      )}
    </>
  );
}
