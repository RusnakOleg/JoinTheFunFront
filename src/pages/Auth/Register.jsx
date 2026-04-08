import { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await authApi.register(form);
      navigate("/login");
    } catch (error) {
      setMessage(
        "Не вдалося зареєструватися. Спробуйте інший email або нікнейм.",
      );
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 border border-white relative overflow-hidden group hover:shadow-blue-900/20 transition-all duration-500">
        {/* Декоративна пляма на фоні */}
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-100/50 rounded-full blur-3xl group-hover:bg-indigo-200/50 transition-colors duration-700"></div>

        {/* Header Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white text-3xl font-black rounded-2xl mb-4 shadow-xl shadow-blue-200 transition-transform group-hover:rotate-6 duration-500">
            J
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
            Створити профіль
          </h3>
          <p className="text-gray-400 mt-2 text-[10px] font-black uppercase tracking-[0.2em]">
            Приєднуйся до JoinTheFun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Email Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">
              Електронна пошта
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              className="w-full px-5 py-3 text-sm font-medium rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-300"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">
              Ім'я користувача
            </label>
            <input
              type="text"
              name="username"
              placeholder="Твій нікнейм"
              className="w-full px-5 py-3 text-sm font-medium rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-300"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-widest">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 text-sm font-medium rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-300"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl grayscale hover:grayscale-0 transition-all active:scale-90"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-[11px] font-bold border border-red-100 animate-in zoom-in-95 duration-300">
              ⚠️ {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.97] mt-4"
            type="submit"
          >
            Стати частиною спільноти
          </button>

          {/* Footer Link */}
          <div className="text-center pt-6 border-t border-gray-50/50">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider">
              Вже маєте акаунт?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 ml-1"
              >
                Увійти
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
