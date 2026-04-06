import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AddActivity({ members, auth }) {
  const [newActivity, setNewActivity] = useState({
    title: '',
    comment: '',
    members: [],
    files: [],
  });

  const [errors, setErrors] = useState({});

  const handleFileChange = (e) => {
    setNewActivity((prev) => ({
      ...prev,
      files: [...prev.files, ...Array.from(e.target.files)],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData();
    formData.append('title', newActivity.title);
    formData.append('comment', newActivity.comment);
    newActivity.members.forEach((m) => formData.append('members[]', m));
    newActivity.files.forEach((file) => formData.append('files[]', file));

    Inertia.post(route('admin.teamhub.store'), formData, {
      onSuccess: () => {
        setNewActivity({ title: '', comment: '', members: [], files: [] });
      },
      onError: (err) => setErrors(err),
    });
  };

  return (
    <AdminLayout auth={auth}  title="Add New Activity">
      <div className="max-w-xl mx-auto p-6 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-2xl shadow-md space-y-6">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-4">
          Add New Activity
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <input
              type="text"
              placeholder="Activity Name"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          <div>
            <textarea
              placeholder="Comment"
              value={newActivity.comment}
              onChange={(e) => setNewActivity({ ...newActivity, comment: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
            {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-purple-700">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {newActivity.files.length > 0 && (
              <ul className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {newActivity.files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
            {errors.files && <p className="text-red-500 text-sm mt-1">{errors.files}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium text-purple-700">Select Members</label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <label key={m.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={m.id}
                    checked={newActivity.members.includes(m.id)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setNewActivity((prev) => ({
                        ...prev,
                        members: checked
                          ? [...prev.members, m.id]
                          : prev.members.filter((id) => id !== m.id),
                      }));
                    }}
                    className="accent-purple-600"
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
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Activity
          </button>
        </div>
        </form>
      </div>
    </AdminLayout>
  );
}


