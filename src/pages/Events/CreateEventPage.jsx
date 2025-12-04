import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { eventsApi } from "../../api/eventsApi";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [model, setModel] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    imageUrl: "",
    creatorId: user.userId, // тимчасово
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setModel({
      ...model,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setModel({ ...model, imageUrl: reader.result.split(",")[1] });

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await eventsApi.create(model);
      navigate("/profile"); // або navigate("/events")
    } catch (err) {
      console.error("Помилка при створенні події:", err);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h3 className="fw-bold text-center mb-4">Створити подію</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            name="title"
            placeholder="Назва"
            value={model.title}
            onChange={handleChange}
            required
          />
          <label>Назва події</label>
        </div>

        <div className="form-floating mb-3">
          <textarea
            className="form-control"
            name="description"
            style={{ height: 100 }}
            placeholder="Опис"
            value={model.description}
            onChange={handleChange}
          ></textarea>
          <label>Опис</label>
        </div>

        <div className="form-floating mb-3">
          <input
            className="form-control"
            name="location"
            placeholder="Локація"
            value={model.location}
            onChange={handleChange}
            required
          />
          <label>Місто / локація</label>
        </div>

        <div className="form-floating mb-3">
          <input
            type="datetime-local"
            className="form-control"
            name="startTime"
            value={model.startTime}
            onChange={handleChange}
            required
          />
          <label>Дата та час початку</label>
        </div>

        {/* <div className="mb-3">
          <label className="form-label">Зображення:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageUpload}
          />

          {model.imageUrl && (
            <img
              src={`data:image/jpeg;base64,${model.imageUrl}`}
              className="img-fluid mt-2"
              style={{ maxHeight: 300, objectFit: "cover" }}
            />
          )}
        </div> */}

        <button className="btn btn-primary w-100 py-2" disabled={loading}>
          {loading ? "Створення..." : "Створити подію"}
        </button>
      </form>
    </div>
  );
}
