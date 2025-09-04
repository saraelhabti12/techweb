import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function Edit({ task, projects, users, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        due_date: task.due_date ?? '',
        status: task.status ?? 'todo',
        project_id: task.project_id ?? '',
        assigned_to: task.assigned_to ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };


    return (
        <AdminLayout auth={auth} header="Edit Task">
            <div className="max-w-2xl mx-auto p-6 bg-gray-900 rounded shadow text-white">
                {/* go back  */}

                <h2 className="text-2xl font-semibold mb-6 text-cyan-300">Update Task</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-cyan-200">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-cyan-200">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 h-28 resize-none text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                    </div>

                    {/* Project */}
                    <div>
                        <label htmlFor="project" className="block text-sm font-medium text-cyan-200">
                            Project
                        </label>
                        <select
                            id="project"
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                        {errors.project_id && <p className="text-red-400 text-sm mt-1">{errors.project_id}</p>}
                    </div>

                    {/* Assigned To */}
                    <div>
                        <label htmlFor="assigned_to" className="block text-sm font-medium text-cyan-200">
                            Assign To
                        </label>
                        <select
                            id="assigned_to"
                            value={data.assigned_to}
                            onChange={(e) => setData('assigned_to', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="">Select a member</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {errors.assigned_to && <p className="text-red-400 text-sm mt-1">{errors.assigned_to}</p>}
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-cyan-200">
                            Due Date
                        </label>
                        <input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-cyan-200">
                            Status
                        </label>
                        <select
                            id="status"
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full bg-gray-800 border border-cyan-700 rounded px-3 py-2 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
