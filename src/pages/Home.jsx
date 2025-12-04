import { Link } from "react-router-dom";
import "./Home.css"; // додамо стилі (нижче)

export default function Home() {
  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section text-light text-center d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Ласкаво просимо до JoinTheFun</h1>
          <p className="lead mt-3 fw-semibold text-shadow">
            Соціальна платформа, де ти можеш знаходити події, ділитись досвідом
            і заводити нові знайомства.
          </p>

          <div className="mt-4">
            <Link to="/register" className="btn btn-primary btn-lg me-3">
              Зареєструватися
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              Увійти
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mt-5">
        <h2 className="text-center mb-4 fw-bold">
          Що ви можете робити на JoinTheFun?
        </h2>

        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card p-4 shadow-sm h-100">
              <h4>📅 Знаходити події</h4>
              <p className="text-muted">
                Приєднуйтесь до локальних і онлайн подій, або створюйте власні!
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-4 shadow-sm h-100">
              <h4>📝 Створювати пости</h4>
              <p className="text-muted">
                Діліться думками, ідеями та фотографіями з іншими користувачами.
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="card p-4 shadow-sm h-100">
              <h4>🤝 Знаходити друзів</h4>
              <p className="text-muted">
                Шукайте людей за інтересами, містом та спільними захопленнями.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
