import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function CreateProject({ categories, clients, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        project_type: 'Internal (Techweb)',
        client_id: '',
        start_date: '',
        end_date: '',
        status: 'pending',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.projects.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Create New Project"
                description="Fill in the details below to start a new project."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Project Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    autoFocus
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="project_type" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Project Type
                                </label>
                                <select
                                    id="project_type"
                                    value={data.project_type}
                                    onChange={(e) => setData('project_type', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="Internal (Techweb)">Internal (Techweb)</option>
                                    <option value="Client Project">Client Project</option>
                                </select>
                                {errors.project_type && <p className="mt-1 text-sm text-red-500 font-bold">{errors.project_type}</p>}
                            </div>
                        </div>

                        {data.project_type === 'Client Project' && (
                            <div>
                                <label htmlFor="client_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Select Client
                                </label>
                                <select
                                    id="client_id"
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="">Choose a client</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} - {client.phone}
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.client_id}</p>}
                            </div>
                        )}

                        <div>
                            <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                rows={4}
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-500 font-bold">{errors.description}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="category_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Category
                                </label>
                                <select
                                    id="category_id"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.category_id}</p>}
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                                {errors.status && <p className="mt-1 text-sm text-red-500 font-bold">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="start_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Start Date
                                </label>
                                <input
                                    id="start_date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.start_date && <p className="mt-1 text-sm text-red-500 font-bold">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label htmlFor="end_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    End Date
                                </label>
                                <input
                                    id="end_date"
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.end_date && <p className="mt-1 text-sm text-red-500 font-bold">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto"
                            >
                                {processing ? 'Creating...' : 'Create Project'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
