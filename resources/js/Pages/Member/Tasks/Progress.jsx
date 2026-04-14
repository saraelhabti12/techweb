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
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{task.title}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Project: {task.project?.name} • Due: {task.due_date || 'No deadline'}
                            </p>
                        </div>
                        <span className={`${
                            task.status === 'todo' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                            task.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        } text-sm px-3 py-1 rounded-full`}>
                            {task.status.replace('_', ' ')}
                        </span>
                    </div>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">
                        {task.description || 'No description provided'}
                    </p>
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

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Update</h2>
                    <form onSubmit={submit}>
                        <input type="hidden" name="task_id" value={task.id} />

                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Update Type</label>
                            <select
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="text">Text Update</option>
                                <option value="file">File Upload</option>
                                <option value="link">URL/Link</option>
                            </select>
                        </div>

                        {data.type === 'text' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Details</label>
                                <textarea
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    rows="4"
                                />
                                {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                            </div>
                        )}

                        {data.type === 'file' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">Upload File</label>
                                <input
                                    type="file"
                                    onChange={e => setData('file', e.target.files[0])}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600"
                                />
                                {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                            </div>
                        )}

                        {data.type === 'link' && (
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2">URL</label>
                                <input
                                    type="url"
                                    value={data.url}
                                    onChange={e => setData('url', e.target.value)}
                                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                                {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        >
                            {processing ? 'Submitting...' : 'Submit Update'}
                        </button>
                    </form>
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
