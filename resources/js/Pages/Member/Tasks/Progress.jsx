import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';


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

    return (
        <MemberLayout auth={auth}>
            <Head title={`Task: ${task.title}`} />

            <div className="space-y-6">
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Retour
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Task Details & Updates */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{task.title}</h1>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                            Project: {task.project?.name}
                                        </span>
                                        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            Due: {task.due_date || 'No deadline'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`${
                                    task.status === 'todo' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                                    task.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                                    'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                } text-sm px-3 py-1 rounded-full font-semibold`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="mt-6 prose dark:prose-invert max-w-none">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    {task.description || 'No description provided'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Progress Updates</h2>
                            </div>

                            {task.progress_updates.length > 0 ? (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {task.progress_updates.map(update => (
                                        <UpdateItem key={update.id} update={update} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    No progress updates yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Context & Action */}
                    <div className="space-y-6">
                        {/* Project & Client Context Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-[#1F2BF3]">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Project Context</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Project Name</label>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{task.project?.name}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.project?.description}</p>
                                </div>

                                {(task.project?.client || task.project?.client_name) && (
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Client Information</label>
                                        <div className="flex items-center space-x-3 mb-3">
                                            {(task.project?.client?.logo || task.project?.client_logo) ? (
                                                <img 
                                                    src={`/storage/${task.project?.client?.logo || task.project?.client_logo}`} 
                                                    alt="Client Logo" 
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-[#1F2BF3] font-bold">
                                                    {(task.project?.client?.name || task.project?.client_name || 'C').charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                    {task.project?.client?.name || task.project?.client_name}
                                                </p>
                                                <p className="text-[10px] text-gray-500">
                                                    {task.project?.client?.company_name || 'Individual Client'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {(task.project?.client?.email || task.project?.client_email) && (
                                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="w-12 font-medium">Email:</span>
                                                    <span className="truncate">{task.project?.client?.email || task.project?.client_email}</span>
                                                </div>
                                            )}
                                            {(task.project?.client?.phone || task.project?.client_phone) && (
                                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                    <span className="w-12 font-medium">Phone:</span>
                                                    <span>{task.project?.client?.phone || task.project?.client_phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add Update Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Add Update</h2>
                            <form onSubmit={submit}>
                                <input type="hidden" name="task_id" value={task.id} />

                                <div className="mb-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Update Type</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-3 py-2.5"
                                    >
                                        <option value="text">Text Update</option>
                                        <option value="file">File Upload</option>
                                        <option value="link">URL/Link</option>
                                    </select>
                                </div>

                                {data.type === 'text' && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Details</label>
                                        <textarea
                                            value={data.content}
                                            onChange={e => setData('content', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-3 py-2.5"
                                            rows="4"
                                            placeholder="What did you work on?"
                                        />
                                        {errors.content && <p className="text-red-500 text-xs mt-1 font-bold">{errors.content}</p>}
                                    </div>
                                )}

                                {data.type === 'file' && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">Upload File</label>
                                        <input
                                            type="file"
                                            onChange={e => setData('file', e.target.files[0])}
                                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                        {errors.file && <p className="text-red-500 text-xs mt-1 font-bold">{errors.file}</p>}
                                    </div>
                                )}

                                {data.type === 'link' && (
                                    <div className="mb-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1.5">URL</label>
                                        <input
                                            type="url"
                                            value={data.url}
                                            onChange={e => setData('url', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-3 py-2.5"
                                            placeholder="https://..."
                                        />
                                        {errors.url && <p className="text-red-500 text-xs mt-1 font-bold">{errors.url}</p>}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#1F2BF3] hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 text-sm"
                                >
                                    {processing ? 'Submitting...' : 'Submit Update'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MemberLayout>
    );
}

const UpdateItem = ({ update }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800 dark:text-white">
                    {update.user?.name || 'Unknown User'}
                </h3>
                <span className="text-xs text-gray-500">
                    {formatDate(update.created_at)}
                </span>
            </div>

            {update.type === 'text' && (
                <p className="text-gray-700 dark:text-gray-300">{update.content}</p>
            )}

            {update.type === 'file' && update.file_path && (
                <div className="mt-2">
                    <a
                        href={`/storage/${update.file_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        View Uploaded File
                    </a>
                </div>
            )}

            {update.type === 'link' && update.url && (
                <div className="mt-2">
                    <a
                        href={update.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {update.url}
                    </a>
                </div>
            )}
        </div>
    );
};
