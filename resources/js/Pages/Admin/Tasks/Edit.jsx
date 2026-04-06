import { useForm, router, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ task, projects, users, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title ?? '',
        description: task.description ?? '',
        due_date: task.due_date ?? '',
        deadline: task.deadline ?? '',
        status: task.status ?? 'todo',
        project_id: task.project_id ?? '',
        assigned_to: task.assigned_to ?? '',
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


    if (data.files && data.files.length > 0) {
        for (let i = 0; i < data.files.length; i++) {
            formData.append('files[]', data.files[i]);
        }
    }

    router.post(route('tasks.update', task.id), formData, {
    forceFormData: true,
    preserveScroll: true,
    onSuccess: () => {
        console.log("✅ Task updated successfully!");
    },
    onError: (errors) => {
        console.error("❌ Validation failed:", errors);
    }

    });

    };

    return (
        <AdminLayout auth={auth} header="Edit Task">
  
            <div className="flex justify-center items-center min-h-screen">
            
            <div className="w-full max-w-2xl bg-gray-700 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-4">
                <div className="mb-6">
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                  >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                  </button>
                </div>
                
                <h2 className="text-2xl font-semibold mb-6 text-purple-500 text-center">Update Task</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900">Title :</label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border-gray-300  
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description :</label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label htmlFor="project_id" className="block text-sm font-medium text-gray-900">Project : </label>
                        <select
                            id="project_id"
                            value={data.project_id}
                            onChange={(e) => setData('project_id', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                        {errors.project_id && <p className="text-red-400 text-sm mt-1">{errors.project_id}</p>}
                    </div>

                    <div>
                        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-900">Assign To :</label>
                        <select
                            id="assigned_to"
                            value={data.assigned_to}
                            onChange={(e) => setData('assigned_to', e.target.value)}
                            className="w-full rounded-md border-gray-300
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">Select a member</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        {errors.assigned_to && <p className="text-red-400 text-sm mt-1">{errors.assigned_to}</p>}
                    </div>

                    <div>
                        <label htmlFor="due_date" className="block text-sm font-medium text-gray-900">Due Date :</label>
                        <input
                            id="due_date"
                            type="date"
                            value={data.due_date}
                            onChange={(e) => setData('due_date', e.target.value)}
                            className="w-full rounded-md border-gray-300
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="deadline" className="block text-sm font-medium text-gray-900">Deadline :</label>
                        <input
                            id="deadline"
                            type="date"
                            value={data.deadline}
                            onChange={(e) => setData('deadline', e.target.value)}
                            className="w-full rounded-md border-gray-300
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-900">Status :</label>
                        <select
                            id="status"
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
                    </div>

                    <div>
                        <label htmlFor="files" className="block text-sm font-medium text-gray-900 ">Upload Files :</label>
                        <input
                            id="files"
                            type="file"
                            multiple
                            onChange={(e) => setData('files', e.target.files)}
                            className="w-full mt-1 text-white"
                        />
                        {errors.files && <p className="text-red-400 text-sm mt-1">{errors.files}</p>}
                    </div>

                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-purple-600 hover:bg-purple-500 
                            text-white py-3 px-20 rounded transition-colors 
                            duration-200 disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Task'}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </AdminLayout>
    );
}
