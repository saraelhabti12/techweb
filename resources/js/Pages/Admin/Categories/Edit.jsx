import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Edit({ category, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.categories.update', category.id));
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Edit Category"
                description={`Updating category: ${category.name}`}
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Category Name
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                placeholder="Enter category name..."
                                autoFocus
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm mt-1 font-bold">{errors.name}</div>
                            )}
                        </div>

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? 'Updating...' : 'Update Category'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
