export default function ProfileInfo({ profile }) {
  const getImage = (base64) => {
    if (!base64) return "";
    return `data:image/jpeg;base64,${base64}`;
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <div className="d-flex align-items-center mb-3">
        <img
          src={getImage(profile.avatarUrl)}
          className="rounded-circle me-3"
          style={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
          }}
          alt="avatar"
        />
        <div>
          <h5 className="mb-1">{profile.username}</h5>
          <p className="mb-0 text-muted">
            {profile.city}, {profile.age}
          </p>
        </div>
      </div>

      <p>{profile.description}</p>

      <p>
        <strong>Інтереси:</strong>{" "}
        {profile.interests && profile.interests.length > 0
          ? profile.interests.join(", ")
          : "немає"}
      </p>
    </div>
  );
}
