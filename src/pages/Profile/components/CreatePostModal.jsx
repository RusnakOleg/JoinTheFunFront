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
    // Додав py-4, щоб модалка не прилипала до країв екрана
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 py-4 overflow-y-auto">
      {/* Оверлей з розмиттям */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Контент модалки: max-w-md -> max-w-sm для ширини. p-8 -> p-5 */}
      <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 border border-gray-100 animate-in zoom-in-95 duration-200">
        {/* Header: mb-6 -> mb-4. text-2xl -> text-xl. p-2 -> p-1.5 */}
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold text-gray-900 tracking-tight">
            Новий пост
          </h5>
          <button
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            onClick={closeModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* space-y-6 -> space-y-4 */}
        <div className="space-y-4">
          {/* Textarea Section: p-4 -> p-3. min-h-[140px] -> min-h-[100px]. text-lg -> text-base */}
          <div className="relative">
            <textarea
              className="w-full p-3 min-h-[100px] text-gray-700 text-base bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Про що ви зараз думаєте?"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            ></textarea>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            {/* mb-1 -> mb-0.5. text-xl -> text-lg */}
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-0.5">
              <span className="text-lg">📸</span> Додати фото
            </label>

            <div className="relative group">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              {/* py-8 -> py-4. rounded-3xl -> rounded-2xl. p-3 -> p-2 */}
              <div className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600 mb-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                {/* text-sm -> text-xs */}
                <span className="text-xs font-semibold text-gray-400">
                  Натисніть або перетягніть
                </span>
              </div>
            </div>

            {/* Preview Image: h-48 -> h-36. rounded-2xl -> rounded-xl */}
            {newPost.imageUrl && (
              <div className="relative mt-3 rounded-xl overflow-hidden shadow-md border border-gray-100">
                <img
                  src={`data:image/jpeg;base64,${newPost.imageUrl}`}
                  className="w-full h-36 object-cover"
                  alt="preview"
                />
                {/* top-2 right-2 -> top-1.5 right-1.5. p-1.5 -> p-1 */}
                <button
                  onClick={() => setNewPost({ ...newPost, imageUrl: "" })}
                  className="absolute top-1.5 right-1.5 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Footer Buttons: gap-3 -> gap-2. py-4 -> py-3. text-base -> text-sm */}
          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 py-3 text-sm bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:bg-blue-300"
              onClick={createPost}
              disabled={!newPost.content.trim() && !newPost.imageUrl}
            >
              Опублікувати
            </button>
            <button
              className="px-5 py-3 text-sm bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98]"
              onClick={closeModal}
            >
              Скасувати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
