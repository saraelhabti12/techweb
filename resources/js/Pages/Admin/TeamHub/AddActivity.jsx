import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { CloudArrowUpIcon, UserPlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

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

    router.post(route('admin.teamhub.store'), formData, {
      onSuccess: () => {
        setNewActivity({ title: '', comment: '', members: [], files: [] });
      },
      onError: (err) => setErrors(err),
    });
  };

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Launch Team Activity"
            description="Start a new collaboration hub, assign members and upload initial resources."
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
                                Activity Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Website V2 Rebranding"
                                value={newActivity.title}
                                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                            />
                            {errors.title && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Description & Initial Brief
                            </label>
                            <textarea
                                placeholder="Detail the objectives and expectations for this activity..."
                                value={newActivity.comment}
                                onChange={(e) => setNewActivity({ ...newActivity, comment: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                rows={5}
                            />
                            {errors.comment && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.comment}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <CloudArrowUpIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    Upload Assets
                                </label>
                                <div className="relative group">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                    />
                                    <div className="w-full py-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center group-hover:border-[#1F2BF3]/50 transition-all">
                                        <CloudArrowUpIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center px-4">Drag assets here or click to browse</span>
                                    </div>
                                </div>
                                {newActivity.files.length > 0 && (
                                    <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/50">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-2">Queued Files ({newActivity.files.length})</h4>
                                        <ul className="space-y-1">
                                            {newActivity.files.map((file, idx) => (
                                                <li key={idx} className="text-xs font-bold text-gray-600 dark:text-gray-400 truncate flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-[#1F2BF3]" />
                                                    {file.name}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {errors.files && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.files}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <UserPlusIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    Assign Collaborators
                                </label>
                                <div className="max-h-48 overflow-y-auto p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 custom-scrollbar space-y-2">
                                    {members.map((m) => (
                                        <label key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer group">
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
                                                className="w-4 h-4 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-black text-gray-500 group-hover:bg-[#1F2BF3] group-hover:text-white transition-colors">
                                                {m.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{m.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.members && <p className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.members}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <DashboardButton 
                            type="submit" 
                            className="w-full md:w-auto !px-12 !py-4"
                        >
                            Initialize Hub Activity
                        </DashboardButton>
                    </div>
                </form>
            </DashboardCard>
        </DashboardPage>
    </AdminLayout>
  );
}
