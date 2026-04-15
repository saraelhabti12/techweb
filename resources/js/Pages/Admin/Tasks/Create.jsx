import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Create({ projects, users, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        deadline: '',
        status: 'todo',
        project_id: '',
        assigned_to: '',
        members: [],
        files: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.tasks.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Create New Task"
                description="Assign tasks to members and link them to projects."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500 font-bold">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                rows={4}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500 font-bold">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Project</label>
                                <select
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="">Select project</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>{project.name}</option>
                                    ))}
                                </select>
                                {errors.project_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.project_id}</p>}

                                {data.project_id && (
                                    <div className="mt-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-2">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Client Details</h4>
                                        {(() => {
                                            const p = projects.find(p => p.id === parseInt(data.project_id));
                                            if (!p) return null;
                                            return (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold">Name</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.client?.name || p.client_name || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold">Phone</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.client?.phone || p.client_phone || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold">Email</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.client?.email || p.client_email || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-bold">City</p>
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.client?.city || p.client_city || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Assign To</label>
                                <select
                                    value={data.assigned_to}
                                    onChange={(e) => setData('assigned_to', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="">Select member</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                {errors.assigned_to && <p className="mt-1 text-sm text-red-500 font-bold">{errors.assigned_to}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Members (Optional)</label>
                            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-800/50 custom-scrollbar">
                                {users.map((user) => (
                                    <label key={user.id} className="flex items-center space-x-3 cursor-pointer">
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
                                            className="w-4 h-4 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3]"
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{user.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Due Date</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.due_date && <p className="mt-1 text-sm text-red-500 font-bold">{errors.due_date}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Deadline</label>
                                <input
                                    type="date"
                                    value={data.deadline}
                                    onChange={(e) => setData('deadline', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.deadline && <p className="mt-1 text-sm text-red-500 font-bold">{errors.deadline}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-500 font-bold">{errors.status}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Upload Files</label>
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setData('files', [...data.files, ...Array.from(e.target.files)])}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-2.5 shadow-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2BF3]/10 file:text-[#1F2BF3] hover:file:bg-[#1F2BF3]/20"
                                />
                                {data.files.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                        {data.files.map((file, index) => (
                                            <li key={index} className="text-[10px] font-bold text-[#1F2BF3] truncate">
                                                • {file.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.files && <p className="mt-1 text-sm text-red-500 font-bold">{errors.files}</p>}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto"
                            >
                                {processing ? 'Creating...' : 'Create Task'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
