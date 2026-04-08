import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fd] font-sans text-gray-900 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop")`,
          }}
        >
          {/* Декоративні розмиті плями для глибини */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[150px]"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center animate-in fade-in zoom-in duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 border border-white/20 bg-white/10 backdrop-blur-md rounded-full">
            <span className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">
              Твоя нова соціальна мережа
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
            Живи яскраво з <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              JoinTheFun
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-300 font-medium leading-relaxed mb-12 opacity-90">
            Платформа для тих, хто втомився від нескінченного скролінгу і хоче
            справжніх подій, живих знайомств та щирих емоцій.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40 active:scale-95"
            >
              Створити акаунт
            </Link>
            <Link
              to="/login"
              className="px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all active:scale-95"
            >
              Увійти
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative z-10 -mt- container mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white hover:border-blue-200 transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-blue-50 flex items-center justify-center rounded-2xl text-3xl mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
              📅
            </div>
            <h4 className="text-2xl font-black mb-4 text-gray-900 tracking-tight">
              Події поруч
            </h4>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Відкривай концерти, вечірки та воркшопи. Створюй власні івенти та
              збирай навколо себе крутих людей.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white hover:border-indigo-200 transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-indigo-50 flex items-center justify-center rounded-2xl text-3xl mb-8 group-hover:bg-indigo-600 group-hover:text-white group-hover:-rotate-12 transition-all duration-500">
              📝
            </div>
            <h4 className="text-2xl font-black mb-4 text-gray-900 tracking-tight">
              Свіжі пости
            </h4>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Ділися моментами, пиши про свої захоплення та надихай інших. Твій
              голос має значення.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white hover:border-emerald-200 transition-all duration-500 hover:-translate-y-3">
            <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center rounded-2xl text-3xl mb-8 group-hover:bg-emerald-600 group-hover:text-white group-hover:rotate-12 transition-all duration-500">
              🤝
            </div>
            <h4 className="text-2xl font-black mb-4 text-gray-900 tracking-tight">
              Нові друзі
            </h4>
            <p className="text-gray-500 font-medium leading-relaxed text-sm">
              Знаходь однодумців за спільними інтересами. Будуй справжні
              зв'язки, які виходять за межі екрану.
            </p>
          </div>
        </div>

        {/* Фінальний заклик */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-4">
            Готові приєднатися?
          </h3>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Нас вже понад 10,000 користувачів
          </p>
        </div>
      </section>
    </div>
  );
}
