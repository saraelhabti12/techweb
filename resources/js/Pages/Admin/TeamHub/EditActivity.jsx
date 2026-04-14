import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { CloudArrowUpIcon, UserPlusIcon, TrashIcon, DocumentIcon } from '@heroicons/react/24/outline';

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

    router.post(route('admin.teamhub.update', activity.id), formData, {
      onError: (err) => setErrors(err),
      onSuccess: () => router.visit(route('admin.teamhub.index')),
    });
  };

  const handleDeleteFile = (fileId) => {
    if (confirm('Are you sure you want to delete this file?')) {
      router.delete(route('admin.teamhub.file.destroy', fileId));
    }
  };

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Edit Hub Activity"
            description={`Adjust the details, collaborators and resources for "${activity.title}".`}
            actions={
                <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                    Go Back
                </DashboardButton>
            }
        >
            <DashboardCard className="max-w-3xl mx-auto border-transparent shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Activity Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                            />
                            {errors.title && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Activity Description / Brief
                            </label>
                            <textarea
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                rows={5}
                            />
                            {errors.comment && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.comment}</p>}
                        </div>

                        {activity.files && activity.files.length > 0 && (
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Currently Attached Resources</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {activity.files.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <DocumentIcon className="w-5 h-5 text-[#1F2BF3] shrink-0" />
                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{file.file_name}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                onClick={() => handleDeleteFile(file.id)}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <CloudArrowUpIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    Append New Assets
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    />
                                    <div className="w-full py-6 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center group-hover:border-[#1F2BF3]/50 transition-all text-center px-4">
                                        <CloudArrowUpIcon className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Click or drag to add files</span>
                                    </div>
                                </div>
                                {form.files.length > 0 && (
                                    <div className="mt-3 text-[10px] font-bold text-[#1F2BF3] uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center border border-blue-100 dark:border-blue-800">
                                        {form.files.length} New files pending upload
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <UserPlusIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    Collaborators
                                </label>
                                <div className="max-h-40 overflow-y-auto p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 custom-scrollbar space-y-2">
                                    {members.map((m) => (
                                        <label key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group">
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
                                                className="w-4 h-4 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                            />
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{m.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <DashboardButton 
                            type="submit" 
                            className="w-full md:w-auto !px-12 !py-4"
                        >
                            Save Changes & Sync Hub
                        </DashboardButton>
                    </div>
                </form>
            </DashboardCard>
        </DashboardPage>
    </AdminLayout>
  );
}
