// src/pages/EditPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    imageUrl: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      setError("");
      setLoading(true);
      try {
        const { data } = await api.get(`/artworks/${id}`);
        if (!ignore) {
          setForm({
            title: data.title || "",
            author: data.author || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
          });
        }
      } catch (e) {
        if (!ignore) setError(e.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Support multipart if new image selected
      if (image) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("author", form.author);
        fd.append("description", form.description);
        fd.append("image", image);
        await api.put(`/artworks/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.put(`/artworks/${id}`, {
          title: form.title,
          author: form.author,
          description: form.description,
        });
      }
      navigate(`/artworks/${id}`, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-bold">작품 수정</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="block text-sm">Title</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Author</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea
            className="w-full rounded-md border px-3 py-2"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm">Replace Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="current"
              style={{ marginTop: 8, width: 160, borderRadius: 8 }}
            />
          )}
        </div>

        {saving ? (
          <button
            className="w-full rounded-md bg-gray-500 px-4 py-2 text-white"
            disabled
          >
            저장 중...
          </button>
        ) : (
          <button className="w-full rounded-md bg-black px-4 py-2 text-white">
            저장하기
          </button>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
