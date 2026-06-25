import React, { useRef, useState } from "react";

export default function AvatarUpload({ userId, avatar, name, onUpload }) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/upload-avatar/${userId}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      onUpload(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);

      // allows selecting the same file again
      e.target.value = "";
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={
          avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name || "User",
          )}`
        }
        alt="Avatar"
        onClick={() => fileInputRef.current?.click()}
        className="h-16 w-16 cursor-pointer rounded-full object-cover ring-2 ring-purple-500/20 transition hover:opacity-80"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-xs text-white">
          Uploading...
        </div>
      )}
    </div>
  );
}
