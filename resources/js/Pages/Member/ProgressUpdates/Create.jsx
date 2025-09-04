import AuthenticatedLayout from '@/Layouts/MemberLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ProgressUpdatesCreate({ auth, tasks }) {
    const { data, setData, processing, errors } = useForm({
        task_id: '',
        type: 'text',
        content: '',
        file: null,
        url: '',
    });

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
formData.append('task_id', taskId);
formData.append('type', type);
formData.append('content', content);
if (file) {
  formData.append('file', file);
}
if (url) {
  formData.append('url', url);
}

        post(route('member.progress.store'), {
            data: formData,
            forceFormData: true,
        });

    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Add Progress Update" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href={route('member.progress.index')}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 mb-6"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Back to Progress Updates
                    </Link>

                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Add Progress Update</h2>

                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="task_id">
                                    Task
                                </label>
                                <select
                                    id="task_id"
                                    className="w-full"
                                    value={data.task_id}
                                    onChange={(e) => setData('task_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a task</option>
                                    {tasks.map((task) => (
                                        <option key={task.id} value={task.id}>
                                            {task.title}
                                        </option>
                                    ))}
                                </select>
                                {errors.task_id && <p className="text-red-500 text-sm mt-1">{errors.task_id}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="type" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    Update Type
                                </label>
                                <select
                                    id="type"
                                    className="w-full"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                >
                                    <option value="text">Text Update</option>
                                    <option value="file">File Upload</option>
                                    <option value="link">URL Link</option>
                                </select>
                            </div>

                            {data.type === 'text' && (
                                <div className="mb-4">
                                    <label htmlFor="content" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Update Details
                                    </label>
                                    <textarea
                                        id="content"
                                        className="w-full"
                                        rows="4"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                    />
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                </div>
                            )}

                            {data.type === 'file' && (
                                <div className="mb-4">
                                    <label htmlFor="file" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        Upload File
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        className="w-full"
                                        onChange={(e) => setData('file', e.target.files[0])}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">Accepted types: JPG, PNG, PDF, DOCX</p>
                                    {errors.file && <p className="text-red-500 text-sm mt-1">{errors.file}</p>}
                                </div>
                            )}

                            {data.type === 'link' && (
                                <div className="mb-4">
                                    <label htmlFor="url" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                        URL Link
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        className="w-full"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Submit Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
