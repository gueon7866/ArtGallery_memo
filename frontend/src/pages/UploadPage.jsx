// src/pages/UploadPage.jsx
import React, { useState } from "react";
import api from "../services/api";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setLoading(true);
    try {
      const form = new FormData();
      form.append("title", title);
      form.append("author", author);
      form.append("description", description);
      if (image) form.append("image", image);

      const { data } = await api.post("/artworks", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setOk("업로드 완료!");
      setTitle("");
      setAuthor("");
      setDescription("");
      setImage(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold">작품 업로드</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm">Title</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Author</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-green-700">{ok}</p>}

        <button
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "업로드 중..." : "업로드"}
        </button>
      </form>
    </div>
  );
}
