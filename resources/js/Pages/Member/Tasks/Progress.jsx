import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Briefcase, User, FileText, Link as LinkIcon, Plus, CheckCircle2, Clock, Download, Navigation, AlertCircle, TrendingUp } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function TaskProgress({ auth, task }) {
    const { data, setData, post, processing, errors } = useForm({
        task_id: task.id,
        type: 'text',
        content: '',
        file: null,
        url: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.progress.store'), {
            preserveScroll: true,
            onSuccess: () => setData({ type: 'text', content: '', file: null, url: '' })
        });
    };

    const statusConfig = {
        todo: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'To Do' },
        in_progress: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Navigation, label: 'In Progress' },
        completed: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, label: 'Completed' },
        blocked: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle, label: 'Blocked' }
    };

    const updateStatus = (status) => {
        router.patch(route('member.tasks.updateStatus', task.id), { status }, {
            preserveScroll: true
        });
    };

    const currentStatus = statusConfig[task.status] || statusConfig.todo;

    return (
        <MemberLayout auth={auth}>
            <Head title={`Task: ${task.title}`} />

            <DashboardPage 
                title="Task Progress" 
                description="Manage task details and track real-time progress updates."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </DashboardButton>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <DashboardCard className="p-8">
                            <div className="flex justify-between items-start gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${currentStatus.color}`}>
                                        <currentStatus.icon className="w-3 h-3 mr-2" />
                                        {currentStatus.label}
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                        {task.title}
                                    </h1>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Briefcase className="w-3.5 h-3.5 mr-2 text-[#1F2BF3]" />
                                            {task.project?.name}
                                        </div>
                                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5 mr-2 text-[#1F2BF3]" />
                                            Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-1">
                                    Task Description
                                </label>
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {task.description || 'No description provided for this task.'}
                                </div>
                            </div>

                            {/* Task Resources (Admin Uploads) */}
                            {task.files && task.files.length > 0 && (
                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-[#1F2BF3]" />
                                        Task Resources
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {task.files.map((file) => (
                                            <div key={file.id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-[#1F2BF3]/30 transition-all shadow-sm">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1F2BF3]">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate uppercase tracking-tight" title={file.original_name}>
                                                            {file.original_name}
                                                        </p>
                                                        <p className="text-[9px] font-black uppercase text-gray-400">Attached Resource</p>
                                                    </div>
                                                </div>
                                                <a 
                                                    href={`/storage/${file.file_path}`} 
                                                    target="_blank"
                                                    className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-[#1F2BF3]"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </DashboardCard>

                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter ml-2 flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#1F2BF3]" />
                                Progress Timeline
                            </h2>
                            
                            {task.progress_updates.length > 0 ? (
                                <div className="space-y-4">
                                    {task.progress_updates.map(update => (
                                        <DashboardCard key={update.id} className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                                            {update.user?.name || 'Team Member'}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {new Date(update.created_at).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    {update.type}
                                                </div>
                                            </div>

                                            <div className="pl-11">
                                                {update.type === 'text' && (
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                                                        {update.content}
                                                    </p>
                                                )}

                                                {update.type === 'file' && update.file_path && (
                                                    <a
                                                        href={`/storage/${update.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1F2BF3]/5 text-[#1F2BF3] text-xs font-black uppercase tracking-widest hover:bg-[#1F2BF3]/10 transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4 mr-2" />
                                                        View Attachment
                                                    </a>
                                                )}

                                                {update.type === 'link' && update.url && (
                                                    <a
                                                        href={update.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 rounded-xl bg-[#1F2BF3]/5 text-[#1F2BF3] text-xs font-black uppercase tracking-widest hover:bg-[#1F2BF3]/10 transition-colors break-all"
                                                    >
                                                        <LinkIcon className="w-4 h-4 mr-2" />
                                                        {update.url}
                                                    </a>
                                                )}
                                            </div>
                                        </DashboardCard>
                                    ))}
                                </div>
                            ) : (
                                <DashboardCard className="p-12 text-center" noHover>
                                    <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No updates posted yet</p>
                                </DashboardCard>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Status Update Card */}
                        <DashboardCard className="p-6">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-[#1F2BF3]" />
                                Quick Status
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {Object.entries(statusConfig).map(([status, config]) => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(status)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                            task.status === status 
                                            ? config.color + ' ring-1 ring-inset ' + config.color.replace('text-', 'ring-')
                                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-800/30'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <config.icon className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{config.label}</span>
                                        </div>
                                        {task.status === status && <CheckCircle2 className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </DashboardCard>

                        <DashboardCard className="p-6">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Plus className="w-4 h-4 text-[#1F2BF3]" />
                                Post Update
                            </h3>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Update Type</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold text-sm appearance-none"
                                    >
                                        <option value="text">Text Update</option>
                                        <option value="file">File Upload</option>
                                        <option value="link">URL/Link</option>
                                    </select>
                                </div>

                                {data.type === 'text' && (
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Details</label>
                                        <textarea
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold text-sm min-h-[120px]"
                                            placeholder="Describe your progress..."
                                        />
                                        {errors.content && <p className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'file' && (
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Upload File</label>
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                onChange={e => setData('file', e.target.files[0])}
                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-[#1F2BF3] file:text-white hover:file:opacity-90 cursor-pointer"
                                            />
                                        </div>
                                        {errors.file && <p className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.file}</p>}
                                    </div>
                                )}

                                {data.type === 'link' && (
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">URL</label>
                                        <input
                                            type="url"
                                            value={data.url}
                                            onChange={e => setData('url', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold text-sm"
                                            placeholder="https://..."
                                        />
                                        {errors.url && <p className="text-rose-500 text-[10px] font-black uppercase mt-1">{errors.url}</p>}
                                    </div>
                                )}

                                <DashboardButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Posting...' : 'Post Update'}
                                </DashboardButton>
                            </form>
                        </DashboardCard>

                        {/* Project Info Card */}
                        <DashboardCard className="p-6 bg-gradient-to-br from-[#1F2BF3] to-[#1F2BF3]/80 border-none group" noHover>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Project Context
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Active Project</p>
                                    <p className="text-lg font-black text-white uppercase tracking-tighter group-hover:translate-x-1 transition-transform">{task.project?.name}</p>
                                </div>

                                {task.project?.client_name && (
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-3">Client Information</p>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black">
                                                {task.project.client_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase tracking-tight">{task.project.client_name}</p>
                                                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                                                    {task.project.client_company || 'Premium Partner'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}
