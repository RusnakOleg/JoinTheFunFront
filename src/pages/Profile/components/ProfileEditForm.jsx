import { useState } from "react";

export default function ProfileEditForm({
  editModel,
  setEditModel,
  allInterests,
  updateProfile,
}) {
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setEditModel({
      ...editModel,
      [e.target.name]: e.target.value,
    });
  };

  const toggleInterest = (id) => {
    const selected = editModel.interestIds.includes(id);

    setEditModel({
      ...editModel,
      interestIds: selected
        ? editModel.intermentRejrestIds.filter((x) => x !== id)
        : [...editModel.interestIds, id],
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setEditModel({ ...editModel, avatarUrl: reader.result.split(",")[1] });

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(editModel);
    setSaving(false);
  };

  return (
    <div className="card p-4 shadow-sm">
      <h6 className="fw-semibold mb-3">Редагування</h6>

      <form onSubmit={handleSubmit}>
        <div className="form-floating mb-3">
          <input
            name="city"
            className="form-control"
            placeholder="Місто"
            value={editModel.city}
            onChange={handleChange}
          />
          <label>Місто</label>
        </div>

        <div className="form-floating mb-3">
          <input
            name="age"
            type="number"
            className="form-control"
            placeholder="Вік"
            value={editModel.age}
            onChange={handleChange}
          />
          <label>Вік</label>
        </div>

        <div className="form-floating mb-3">
          <textarea
            name="description"
            className="form-control"
            style={{ height: 100 }}
            placeholder="Опис"
            value={editModel.description}
            onChange={handleChange}
          ></textarea>
          <label>Опис</label>
        </div>

        {/* Avatar */}
        <div className="mb-3">
          <label className="form-label">Аватар:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleAvatarUpload}
          />

          {editModel.avatarUrl && (
            <div className="mt-2">
              <img
                src={`data:image/jpeg;base64,${editModel.avatarUrl}`}
                className="img-thumbnail"
                style={{ maxWidth: "150px" }}
              />
            </div>
          )}
        </div>

        {/* Gender */}
        <div className="mb-3">
          <label className="form-label">Стать:</label>
          <select
            name="gender"
            className="form-select"
            value={editModel.gender}
            onChange={handleChange}
          >
            <option value="Male">Чоловіча</option>
            <option value="Female">Жіноча</option>
          </select>
        </div>

        {/* Interests */}
        <div className="mb-3">
          <label className="form-label">Інтереси:</label>
          <div className="row">
            {allInterests.map((i) => (
              <div className="col-6 mb-1" key={i.interestId}>
                <input
                  type="checkbox"
                  checked={editModel.interestIds.includes(i.interestId)}
                  onChange={() => toggleInterest(i.interestId)}
                />{" "}
                {i.name}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Збереження..." : "Зберегти"}
        </button>
      </form>
    </div>
  );
}
