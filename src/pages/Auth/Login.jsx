import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
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
      await login(form);
      navigate("/profile", { replace: true });
    } catch (err) {
      setMessage("Невірне ім'я користувача або пароль");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 border border-white relative overflow-hidden group hover:shadow-blue-900/20 transition-all duration-500">
        {/* Декоративний елемент на фоні */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors duration-700"></div>

        {/* Logo Section */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white text-3xl font-black rounded-2xl mb-4 shadow-xl shadow-blue-200 transition-transform group-hover:scale-110 duration-500">
            J
          </div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
            З поверненням!
          </h3>
          <p className="text-gray-400 mt-2 text-sm font-bold uppercase tracking-widest">
            JoinTheFun
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Username Field */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 mb-2 ml-1 uppercase tracking-[0.15em]">
              Ім'я користувача
            </label>
            <input
              type="text"
              name="username"
              placeholder="Твій нікнейм"
              className="w-full px-5 py-3.5 text-sm font-medium rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-300"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                Пароль
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] text-blue-600 hover:text-blue-700 font-black uppercase tracking-wider"
              >
                Забули?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 text-sm font-medium rounded-2xl bg-gray-50/50 border border-gray-100 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-300"
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
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-3 animate-shake">
              <span className="text-base">⚠️</span> {message}
            </div>
          )}

          {/* Submit Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-[0.97] mt-2"
            type="submit"
          >
            Увійти в систему
          </button>

          {/* Registration Link */}
          <div className="text-center pt-6">
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-wider">
              Ще не з нами?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 ml-1"
              >
                Створити акаунт
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
