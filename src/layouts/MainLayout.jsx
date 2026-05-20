import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#f8f9fd]">
      <nav className="sticky top-0 z-50 h-20 bg-white/70 backdrop-blur-xl border-b border-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
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
                  
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">
                      Вітаємо,
                    </p>
                    <p className="text-sm font-black text-gray-900 leading-none">
                      {user.username}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 ${
                      isActive("/profile")
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-blue-200"
                    }`}
                  >
                    <User className="w-6 h-6 text-blue-500"  strokeWidth={2.5}/>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"
                    title="Вийти"
                  >
                     <LogOut className="w-6 h-6 text-red-500"  strokeWidth={2.5}/>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}