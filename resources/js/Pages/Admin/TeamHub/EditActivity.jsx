import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AdminLayout from '@/Layouts/AdminLayout';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function EditActivity({ activity, members, auth }) {
  const [form, setForm] = useState({
    title: activity.title || '',
    comment: activity.content || '',
    members: activity.members.map((m) => m.id) || [],
    files: [],
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setForm((prev) => ({
      ...prev,
      files: [...prev.files, ...Array.from(e.target.files)],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', form.title);
    formData.append('comment', form.comment);
    form.members.forEach((m) => formData.append('members[]', m));
    form.files.forEach((file) => formData.append('files[]', file));

    Inertia.post(route('admin.teamhub.update', activity.id), formData, {
      onError: (err) => setErrors(err),
      onSuccess: () => Inertia.visit(route('admin.teamhub.index')),
    });
  };

  const handleDeleteFile = (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      Inertia.delete(route('admin.teamhub.file.destroy', fileId), {
        onSuccess: () => alert('File deleted successfully'),
      });
    }
  };

  return (
    <AdminLayout auth={auth} title={`Edit Activity - ${activity.title}`}>
      <div className="p-6 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-2xl max-w-xl mx-auto space-y-4">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-purple-700">Edit Activity</h1>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <input
              type="text"
              placeholder="Activity Name"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 dark:bg-gray-800 dark:text-gray-200"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea
              placeholder="Comment"
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:bg-gray-800 dark:text-gray-200"
            />
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
          </div>
          {activity.files && activity.files.length > 0 && (
            <div>
              <label className="block mb-1 font-medium text-purple-700">Existing Files :</label>
              <ul className="space-y-1">
                {activity.files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between">
                    <a
                      href={`/storage/${file.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-700 hover:text-purple-900 underline text-sm"
                    >
                      {file.file_name}
                    </a>
                    <button
                      type="button"
                      className="text-red-500 text-xs ml-2"
                      onClick={() => handleDeleteFile(file.id)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <label className="block mb-1 font-medium text-purple-700">Upload New Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 dark:bg-gray-800 dark:text-gray-200"
            />
            {form.files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-200 dark:text-gray-300">
                {form.files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
            {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-purple-700">Select Members :</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={m.id}
                    checked={form.members.includes(m.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => ({
                        ...prev,
                        members: checked
                          ? [...prev.members, m.id]
                          : prev.members.filter((id) => id !== m.id),
                      }));
                    }}
                    className="accent-purple-600 w-4 h-4"
                  />
                  <span className="text-gray-900 dark:text-gray-200">{m.name}</span>
                </label>
              ))}
            </div>
            {errors.members && <p className="text-red-500 text-sm mt-1">{errors.members}</p>}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Update Activity
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}



