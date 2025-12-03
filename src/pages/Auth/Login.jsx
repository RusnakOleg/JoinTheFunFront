import { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

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
      const response = await authApi.login(form);

      const data = response.data; // AuthResponseDto

      // Зберігаємо токен у localStorage (аналог Blazored.LocalStorage)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      // Перехід на профіль
      navigate("/profile");
    } catch (err) {
      setMessage("Невірне ім'я користувача або пароль");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 fw-bold text-center">Вхід</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Ім'я користувача"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Ім'я користувача</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Пароль</label>
          </div>

          <button className="btn btn-primary w-100 py-2">Увійти</button>

          {message && (
            <div className="alert alert-danger mt-3 mb-0" role="alert">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
