import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Функція для визначення активного посилання
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo & Main Nav */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-2xl font-black text-blue-600 tracking-tighter flex items-center gap-2"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  J
                </div>
                <span className="hidden sm:block text-gray-900">
                  JoinTheFun
                </span>
              </Link>

              {isAuthenticated && (
                <div className="hidden md:flex items-center gap-1">
                  {[
                    { name: "Події", path: "/events" },
                    { name: "Пости", path: "/posts" },
                    { name: "Друзі", path: "/friends" },
                  ].map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                        isActive(link.path)
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-5 py-2.5 text-sm font-black text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Вхід
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 text-sm font-black text-white bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                  >
                    Реєстрація
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  {/* User Greeting */}
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Вітаємо,
                    </p>
                    <p className="text-sm font-black text-gray-900 leading-none">
                      {user.username}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
                      isActive("/profile")
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-blue-200"
                    }`}
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </Link>

                  {/* Logout */}
                  <button
                    onClick={logout}
                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                    title="Вийти"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="py-8">
        <Outlet />
      </main>
    </div>
  );
}
