import React from "react";
import { useForm, router, Link } from '@inertiajs/react';
import { ArrowLeftIcon, DocumentTextIcon, CalendarIcon, UserIcon, FolderIcon, TagIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from "@/Components/UI/DashboardPage";
import DashboardCard from "@/Components/UI/DashboardCard";
import DashboardButton from "@/Components/UI/DashboardButton";
import DashboardInput from "@/Components/UI/DashboardInput";

export default function Edit({ task, projects, users, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        due_date: task.due_date ?? '',
        deadline: task.deadline ?? '',
        status: task.status ?? 'todo',
        project_id: task.project_id ?? '',
        assigned_to: task.assigned_to ?? '',
        members: task.members ? task.members.map(m => m.id) : [],
        files: [], 
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT'); 
        formData.append('title', data.title ?? '');
        formData.append('description', data.description ?? '');
        formData.append('due_date', data.due_date ?? '');
        formData.append('deadline', data.deadline ?? '');
        formData.append('status', data.status ?? 'todo');
        formData.append('project_id', data.project_id ?? '');
        formData.append('assigned_to', data.assigned_to ?? '');

        if (data.members && data.members.length > 0) {
            data.members.forEach(memberId => {
                formData.append('members[]', memberId);
            });
        }

        if (data.files && data.files.length > 0) {
            for (let i = 0; i < data.files.length; i++) {
                formData.append('files[]', data.files[i]);
            }
        }

        router.post(route('admin.tasks.update', task.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => console.log("✅ Task updated successfully!"),
            onError: (errors) => console.error("❌ Validation failed:", errors)
        });
    };

    const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
    const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Edit Task" 
                description={`Updating task: ${task.title}`}
                actions={
                    <DashboardButton 
                        variant="secondary" 
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back
                    </DashboardButton>
                }
            >
                <div className="max-w-3xl mx-auto">
                    <DashboardCard>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <DashboardInput
                                        label="Title"
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        icon={DocumentTextIcon}
                                        placeholder="Enter task title"
                                    />
                                    {errors.title && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.title}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className={labelClass}>Description</label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={`${inputClass} min-h-[120px] resize-none`}
                                        placeholder="Describe the task details..."
                                    />
                                    {errors.description && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.description}</p>}
                                </div>

                                <div>
                                    <label htmlFor="project_id" className={labelClass}>Project</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors">
                                            <FolderIcon className="w-5 h-5" />
                                        </div>
                                        <select
                                            id="project_id"
                                            value={data.project_id}
                                            onChange={(e) => setData('project_id', e.target.value)}
                                            className={`${inputClass} pl-11`}
                                        >
                                            <option value="">Select a project</option>
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>{project.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.project_id && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.project_id}</p>}
                                </div>

                                <div className="md:col-span-2">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className={labelClass}>Assign Members</label>
                                        <span className="text-[9px] font-black text-[#1F2BF3] bg-[#1F2BF3]/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                                            {data.members.length} Selected
                                        </span>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <input 
                                            type="text"
                                            placeholder="Search and manage team members..."
                                            className={`${inputClass} !py-2.5 text-sm`}
                                            onChange={(e) => {
                                                const term = e.target.value.toLowerCase();
                                                const items = document.querySelectorAll('.member-item');
                                                items.forEach(item => {
                                                    const name = item.getAttribute('data-name').toLowerCase();
                                                    item.style.display = name.includes(term) ? 'flex' : 'none';
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[280px] overflow-y-auto border border-gray-100 dark:border-gray-800 rounded-2xl p-3 bg-gray-50/50 dark:bg-gray-900/30 custom-scrollbar">
                                        {users.map((user) => (
                                            <label key={user.id} data-name={user.name} className="member-item flex items-center justify-between p-3 hover:bg-white dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700 group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            value={user.id}
                                                            checked={data.members.includes(user.id)}
                                                            onChange={(e) => {
                                                                const id = parseInt(e.target.value);
                                                                if (e.target.checked) {
                                                                    setData('members', [...data.members, id]);
                                                                } else {
                                                                    setData('members', data.members.filter((memberId) => memberId !== id));
                                                                }
                                                            }}
                                                            className="w-4.5 h-4.5 rounded-lg border-gray-300 dark:border-gray-600 text-[#1F2BF3] focus:ring-[#1F2BF3] transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-[#1F2BF3] transition-colors line-clamp-1">{user.name}</span>
                                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">{user.role}</span>
                                                    </div>
                                                </div>
                                                {data.members.includes(user.id) && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#1F2BF3] shadow-[0_0_8px_rgba(31,43,243,0.5)]" />
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                    {errors.members && <p className="text-rose-500 text-[10px] font-black uppercase mt-2 ml-2">{errors.members}</p>}
                                </div>

                                <div>
                                    <DashboardInput
                                        label="Due Date"
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        icon={CalendarIcon}
                                    />
                                    {errors.due_date && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.due_date}</p>}
                                </div>

                                <div>
                                    <DashboardInput
                                        label="Deadline"
                                        id="deadline"
                                        type="date"
                                        value={data.deadline}
                                        onChange={(e) => setData('deadline', e.target.value)}
                                        icon={CalendarIcon}
                                    />
                                    {errors.deadline && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.deadline}</p>}
                                </div>

                                <div>
                                    <label htmlFor="status" className={labelClass}>Status</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors">
                                            <TagIcon className="w-5 h-5" />
                                        </div>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className={`${inputClass} pl-11`}
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="blocked">Blocked</option>
                                        </select>
                                    </div>
                                    {errors.status && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.status}</p>}
                                </div>

                                <div>
                                    <label htmlFor="files" className={labelClass}>Upload Files</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors">
                                            <PaperClipIcon className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="files"
                                            type="file"
                                            multiple
                                            onChange={(e) => setData('files', e.target.files)}
                                            className={`${inputClass} pl-11 pt-[11px]`}
                                        />
                                    </div>
                                    {errors.files && <p className="text-rose-500 text-[10px] font-black uppercase mt-1.5 ml-2">{errors.files}</p>}
                                </div>
                            </div>

                            {data.project_id && (
                                <div className="mt-8 p-6 bg-blue-50/30 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl transition-all animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-4">Client Information</h4>
                                    {(() => {
                                        const p = projects.find(p => p.id === parseInt(data.project_id));
                                        if (!p) return null;
                                        return (
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Name</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{p.client?.name || p.client_name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Phone</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{p.client?.phone || p.client_phone || 'N/A'}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-[10px] text-gray-400 uppercase font-black mb-1">Email</p>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{p.client?.email || p.client_email || 'N/A'}</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            <div className="pt-6 flex justify-end">
                                <DashboardButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto min-w-[200px]"
                                >
                                    {processing ? 'Saving Changes...' : 'Update Task'}
                                </DashboardButton>
                            </div>
                        </form>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
