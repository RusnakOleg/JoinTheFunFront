import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            JoinTheFun
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav me-auto">
              {/* Pages only for authenticated users */}
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/events">
                      Події
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/posts">
                      Пости
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/friends">
                      Друзі
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {/* Правий бік navbar */}
            <ul className="navbar-nav ms-auto">
              {!isAuthenticated ? (
                <>
                  {/* <li className="nav-item">
                    <Link className="btn btn-outline-light me-2" to="/login">
                      Вхід
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="btn btn-primary" to="/register">
                      Реєстрація
                    </Link>
                  </li> */}
                </>
              ) : (
                <>
                  <li className="nav-item d-flex align-items-center me-3 text-white">
                    Привіт, <strong className="ms-1">{user.username}</strong>
                  </li>

                  <li className="nav-item">
                    <Link className="btn btn-outline-light me-2" to="/profile">
                      Мій профіль
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button className="btn btn-danger" onClick={logout}>
                      Вийти
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
