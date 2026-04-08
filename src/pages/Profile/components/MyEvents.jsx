import { Link } from "react-router-dom";

export default function MyEvents({ events, show, onToggle, deleteEvent }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-1">
        <div>
          <h5 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Мої події
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black">
              {events.length}
            </span>
          </h5>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Керування створеними заходами
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-black text-gray-500 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm active:scale-95"
            onClick={onToggle}
          >
            {show ? "▲ Сховати" : "▼ Список"}
          </button>

          <Link
            to="/create-event"
            className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 text-center"
          >
            + Створити
          </Link>
        </div>
      </div>

      {/* EVENTS LIST */}
      {show && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-4">
                🏜️
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
                Подій поки немає
              </p>
              <p className="text-gray-300 text-sm mt-2 font-medium">
                Час організувати щось незабутнє!
              </p>
            </div>
          ) : (
            events.map((ev) => (
              <div
                className="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-100 transition-all"
                key={ev.eventId}
              >
                {/* Акцентна лінія */}
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-blue-500 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h6 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {ev.title}
                      </h6>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-lg border border-green-100">
                        Active
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2 italic">
                      {ev.description || "Опис відсутній..."}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                        <span className="mr-2">📍</span> {ev.location}
                      </div>
                      <div className="flex items-center text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl">
                        <span className="mr-2">📅</span>
                        {new Date(ev.startTime).toLocaleDateString("uk-UA", {
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                      <div className="flex items-center text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                        <span className="mr-2">👥</span>
                        {ev.participantCount}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                    <button
                      className="flex items-center justify-center w-12 h-12 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all active:scale-90"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Ви впевнені, що хочете видалити цю подію?",
                          )
                        ) {
                          deleteEvent(ev.eventId);
                        }
                      }}
                      title="Видалити подію"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
