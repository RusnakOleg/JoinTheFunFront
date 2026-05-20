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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Оверлей з розмиттям під стиль сторінки */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      ></div>

      {/* Контент модалки: округленість [2rem], фірмові тіні профілю */}
      <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl shadow-blue-900/10 p-6 border border-gray-100 animate-in zoom-in-95 duration-200 z-10">
        
        {/* Header: font-black та tracking-tight */}
        <div className="flex justify-between items-center mb-5">
          <h5 className="text-2xl font-black text-gray-900 tracking-tight">
            Новий пост
          </h5>
          <button
            className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
            onClick={closeModal}
          >
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
                strokeWidth={2.5} /* Трішки товща лінія, щоб пасувала до font-black */
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Текстова зона: rounded-2xl, фон bg-gray-50, прибираємо фокус-ринг на користь border-blue-500 як у коментарях */}
          <div className="relative">
            <textarea
              className="w-full p-4 min-h-[120px] text-gray-700 text-sm font-medium bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
              placeholder="Про що ви зараз думаєте?"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
            ></textarea>
          </div>

          {/* Секція завантаження зображення */}
          <div>
            {/* Лейбл: точна копія стилю заголовків ("Місто", "Про себе") */}
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
              Додати фото
            </label>

            <div className="relative group">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              {/* Рамка завантаження: заокруглення rounded-2xl */}
              <div className="w-full py-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all">
                <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 mb-2">
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
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Натисніть або перетягніть
                </span>
              </div>
            </div>

            {/* Прев'ю зображення: велике заокруглення та тінь */}
            {newPost.imageUrl && (
              <div className="relative mt-4 rounded-2xl overflow-hidden shadow-md border border-gray-100 max-h-[200px]">
                <img
                  src={`data:image/jpeg;base64,${newPost.imageUrl}`}
                  className="w-full object-cover"
                  alt="preview"
                />
                <button
                  onClick={() => setNewPost({ ...newPost, imageUrl: "" })}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-xl hover:bg-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Кнопки дій: rounded-2xl, font-bold, active:scale-95 та фірмові тіні */}
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 py-3.5 text-xs font-black uppercase tracking-widest bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/10 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
              onClick={createPost}
              disabled={!newPost.content.trim() && !newPost.imageUrl}
            >
              Опублікувати
            </button>
            <button
              className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
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