import { useState } from "react";
import { authApi } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
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
      const response = await authApi.register(form);
      console.log(response.data);

      navigate("/login"); // редірект як у Blazor
    } catch (error) {
      setMessage("Не вдалося зареєструватися");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-start mt-5">
      <div
        className="card shadow-sm p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="mb-4 fw-bold text-center">Реєстрація</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>

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

          <button className="btn btn-primary w-100 py-2 mb-3" type="submit">
            Зареєструватися
          </button>

          <div className="text-center">
            <small>
              Вже зареєстровані? <a href="/login">Авторизуватись</a>
            </small>
          </div>

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
