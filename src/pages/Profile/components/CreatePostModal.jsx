export default function CreatePostModal({
  newPost,
  setNewPost,
  closeModal,
  createPost,
}) {
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      setNewPost({
        ...newPost,
        imageUrl: reader.result.split(",")[1],
      });

    reader.readAsDataURL(file);
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Новий пост</h5>
            <button className="btn-close" onClick={closeModal}></button>
          </div>

          <div className="modal-body">
            <div className="form-floating mb-3">
              <textarea
                className="form-control"
                placeholder="Зміст"
                style={{ height: 100 }}
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              ></textarea>
              <label>Зміст</label>
            </div>

            <div className="mb-3">
              <label className="form-label">Зображення:</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageUpload}
              />
              {newPost.imageUrl && (
                <img
                  src={`data:image/jpeg;base64,${newPost.imageUrl}`}
                  className="img-fluid mt-2"
                />
              )}
            </div>

            <div className="d-flex justify-content-end">
              <button className="btn btn-primary" onClick={createPost}>
                Опублікувати
              </button>
              <button className="btn btn-secondary ms-2" onClick={closeModal}>
                Скасувати
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
