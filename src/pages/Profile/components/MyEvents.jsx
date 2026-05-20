import { CalendarDays, MapPin, Plus, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function MyEvents({ events, show, onToggle, deleteEvent }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 px-1">
        <div>
          
          <h5 className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 ml-0.5">
            Керування створеними заходами
          </h5>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
  

          <Link
            to="/create-event"
            className="no-underline flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-all shadow-lg shadow-blue-600/10 active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={2.8} />  
            <span>Створити</span>
          </Link>
        </div>
      </div>

      {/* EVENTS LIST */}
      {show && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {events.length === 0 ? (
            <div className="text-center py-12">
            <p className="text-gray-500 font-bold text-lg">Подій поки немає</p>
            <p className="text-gray-400 text-sm"> Час організувати щось незабутнє!</p>
          </div>
          ) : (
            events.map((ev) => (
              <div
                className="group relative bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 hover:border-blue-100 transition-all duration-300"
                key={ev.eventId}
              >
                {/* Елегантна лінія-акцент під радіус картки */}
                <div className="absolute left-0 top-8 bottom-8 w-1 bg-blue-500 rounded-r-full scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center"></div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <h6 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight leading-none">
                        {ev.title}
                      </h6>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-lg border border-transparent">
                        Active
                      </span>
                    </div>

                    {/* Мета-дані: підпис автора, як у стрічці профілю */}
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">
                      Подія • Організовано вами
                    </p>

                    <p className="text-sm text-gray-600 font-medium mb-4 line-clamp-2 leading-relaxed whitespace-pre-line">
                      {ev.description || "Користувач не додав опис події..."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {ev.location && (
                        <div className="flex items-center text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-tighter">
                          <span className="mr-1.5"><MapPin className="w-4 h-4 text-red-500"/></span> {ev.location}
                        </div>
                      )}
                      <div className="flex items-center text-xs font-bold text-gray-500 bg-blue-50 px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px]">
                        <span className="mr-1.5"><CalendarDays className="w-4 h-4 text-gray-500"/></span>
                        {new Date(ev.startTime).toLocaleDateString("uk-UA", {
                          day: "numeric",
                          month: "long",
                        })}
                      </div>
                      <div className="flex items-center text-xs font-bold text-gray-500 bg-purple-50 px-3 py-1.5 rounded-lg uppercase tracking-wider text-[10px]">
                        <span className="mr-1.5"><Users className="w-4 h-4 text-gray-500"/></span>
                        {ev.participantCount} учасників
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end border-t border-gray-50 sm:border-t-0 pt-4 sm:pt-0">
                    <button
                      className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-all active:scale-95 border border-transparent hover:border-red-100 shadow-sm"
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
                      <Trash2 className="h-5 w-5" strokeWidth={2.5} />
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