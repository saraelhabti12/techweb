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

            <div className="py-6 px-4 bg-purple-10/90 border border-purple-200 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    
                        <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Retour
                        </button>
                        </div>

                    <div className="bg-purple-10/90 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 text-center dark:text-white mb-6">Add Progress Update</h2>

                        <form onSubmit={submit} encType="multipart/form-data">
                            <div className="mb-4">
                                <label className="block text-gray-900 dark:text-gray-300 font-medium mb-2" htmlFor="task_id">
                                    Task
                                </label>
                                <select
                                    id="task_id"
                                    className="w-full rounded-md border-gray-300 
                                                dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                                shadow-sm 
                                                focus:border-purple-500 focus:ring-purple-500"
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
                                <label htmlFor="type" className="block text-gray-900 dark:text-gray-300 font-medium mb-2">
                                    Update Type
                                </label>
                                <select
                                    id="type"
                                    className="w-full rounded-md border-gray-300 
                                                dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                                shadow-sm 
                                                focus:border-purple-500 focus:ring-purple-500"
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
                                    <label htmlFor="content" className="block text-gray-900 dark:text-gray-300 font-medium mb-2">
                                        Update Details
                                    </label>
                                    <textarea
                                        id="content"
                                        className="w-full rounded-md border-gray-300 
                                                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                                    shadow-sm 
                                                    focus:border-purple-500 focus:ring-purple-500"
                                        rows="4"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                    />
                                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                                </div>
                            )}

                            {data.type === 'file' && (
                                <div className="mb-4">
                                    <label htmlFor="file" className="block text-gray-900 dark:text-gray-300 font-medium mb-2">
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
                                    <label htmlFor="url" className="block text-gray-900 dark:text-gray-300 font-medium mb-2">
                                        URL Link
                                    </label>
                                    <input
                                        type="url"
                                        id="url"
                                        className="w-full rounded-md border-gray-300 bg-white/60
                                                    dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                                    shadow-sm 
                                                    focus:border-purple-500 focus:ring-purple-500"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder="https://example.com"
                                    />
                                    {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
                                </div>
                            )}

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 
                                                bg-purple-600 border border-transparent rounded-md 
                                                font-semibold text-xs text-white uppercase tracking-widest 
                                                hover:bg-purple-700 active:bg-purple-900 
                                                focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                                disabled:opacity-25 transition 
                                                dark:bg-purple-700 dark:hover:bg-purple-600"
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
