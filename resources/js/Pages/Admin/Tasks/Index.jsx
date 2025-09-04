import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';

export default function Index({ tasks, auth }) {
    const handleBack = () => {
        router.back();
    };

    return (
        <AdminLayout auth={auth} header="Tasks Management">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-cyan-300">All Tasks</h1>
                    <div className="flex items-center space-x-4">

                        <Link
                            href="tasks/create"
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded transition-colors"
                        >
                            + New Task
                        </Link>
                    </div>
                </div>

                <table className="w-full border-collapse text-white">
                    <thead>
                        <tr className="bg-cyan-800">
                            <th className="border px-4 py-2 text-left">Title</th>
                            <th className="border px-4 py-2 text-left">Project</th>
                            <th className="border px-4 py-2 text-left">Assigned To</th>
                            <th className="border px-4 py-2 text-left">Status</th>
                            <th className="border px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} className="bg-gray-800 hover:bg-gray-700">
                                <td className="border px-4 py-3">{task.title}</td>
                                <td className="border px-4 py-3">{task.project?.name}</td>
                                <td className="border px-4 py-3">{task.user?.name}</td>
                                <td className="border px-4 py-3 capitalize">{task.status.replace('_', ' ')}</td>
                                <td className="border px-4 py-3">
                                    <Link
                                        href={route('tasks.edit', task.id)}
                                        className="text-cyan-400 hover:text-cyan-300"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
