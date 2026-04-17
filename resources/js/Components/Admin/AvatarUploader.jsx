import React, { useRef, useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function AvatarUploader({ user }) {
  const { data, setData, post, processing } = useForm({ avatar: null });
  const [preview, setPreview] = useState(user.avatar ? `/storage/${user.avatar}` : null);
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  const getInitials = (name) => {
    return name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : '?';
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setData('avatar', file);
  };

  const handleUpload = () => {
    if (!data.avatar) return;
    post(route('admin.members.avatar', user.id), {
      forceFormData: true,
      onSuccess: () => router.reload(),
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onClick={handleClick}
        className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-500 text-4xl font-black shadow-inner cursor-pointer hover:opacity-80 transition-all border-4 border-white dark:border-gray-900 overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          getInitials(user.name)
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />

      <div className="flex gap-2">
        <button
            onClick={handleClick}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
        >
            Choose
        </button>
        {data.avatar && (
            <button
                onClick={handleUpload}
                disabled={processing}
                className="px-4 py-2 bg-[#1F2BF3] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
                <ArrowUpTrayIcon className="w-4 h-4" />
                Upload
            </button>
        )}
      </div>
    </div>
  );
}
