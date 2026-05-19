import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full bg-[#f8f9fd] font-sans text-gray-900 overflow-x-hidden">
      
      <section 
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "calc(100vh - 80px)" }} 
      >
        
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop")`,
          }}
        >
          {/* Декоративні розмиті плями */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[150px]"></div>
        </div>

        {/* Контент */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center animate-in fade-in zoom-in duration-1000">
          <div className="inline-block px-4 py-1.5 mb-4 border border-white/20 bg-white/10 backdrop-blur-md rounded-full">
            <span className="text-blue-300 text-[10px] font-black uppercase tracking-[0.3em]">
              Твоя нова соціальна мережа
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[1.1]">
            Живи яскраво з <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              JoinTheFun
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-sm md:text-base text-gray-300 font-medium leading-relaxed mb-8 opacity-90">
            Платформа для тих, хто втомився від нескінченного скролінгу і хоче
            справжніх подій, живих знайомств та щирих емоцій.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/40 active:scale-95"
            >
              Створити акаунт
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[11px] rounded-xl transition-all active:scale-95"
            >
              Увійти
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}