// src/components/artworks/ArtworkCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function ArtworkCard({
  id,
  title = "Untitled",
  author = "Unknown",
  imageUrl,
  description,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-3">
      <Link to={id ? `/artworks/${id}` : "#"}>
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "#9ca3af" }}>No Image</span>
          )}
        </div>
      </Link>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{author}</div>
        {description && (
          <p style={{ marginTop: 6, fontSize: 12, color: "#4b5563" }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
