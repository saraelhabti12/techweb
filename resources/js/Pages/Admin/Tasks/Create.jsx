import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

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
        post(route('tasks.store'), {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout auth={auth} header="Tasks Management">
            <div className="max-w-3xl mx-auto px-6 py-8 border border-purple-200  bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                
                <div className="flex items-center justify-between mb-6">
                        <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Retour
                        </button>
                        </div>
                    <h1 className="text-3xl font-extrabold text-purple-500 text-center flex-1">
                        Create New Task
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                            rows={4}
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Project</label>
                            <select
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm 
                                            focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">Select project</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.name}</option>
                                ))}
                            </select>
                            {errors.project_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.project_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Assign To</label>
                            <select
                                value={data.assigned_to}
                                onChange={(e) => setData('assigned_to', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm 
                                            focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">Select member</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            {errors.assigned_to && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.assigned_to}</p>}
                        </div>

                    <div>
                        <label className="block font-semibold mb-1">Members</label>
                        <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-white dark:bg-gray-700">
                            {users.map((user) => (
                            <label key={user.id} className="flex items-center space-x-2">
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
                                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span>{user.name}</span>
                            </label>
                            ))}
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                            <input
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm 
                                            focus:border-purple-500 focus:ring-purple-500"
                            />
                            {errors.due_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                            <input
                                type="date"
                                value={data.deadline}
                                onChange={(e) => setData('deadline', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm 
                                            focus:border-purple-500 focus:ring-purple-500"
                            />
                            {errors.deadline && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.deadline}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm 
                                            focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload Files</label>
                            <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                    setData('files', [...data.files, ...Array.from(e.target.files)])
                                }
                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                            />
                            {data.files.length > 0 && (
                                <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                                    {data.files.map((file, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <span className="text-purple-600 font-medium">{file.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {errors.files && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.files}</p>}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-16 py-3 
                                        bg-purple-600 border border-transparent rounded-md 
                                        font-semibold text-xs text-white uppercase tracking-widest 
                                        hover:bg-purple-700 active:bg-purple-900 
                                        focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                        disabled:opacity-25 transition 
                                        dark:bg-purple-700 dark:hover:bg-purple-600"
                        >
                            {processing ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}


