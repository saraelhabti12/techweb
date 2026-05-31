import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, TagIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function Index({ auth, categories }) {
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Category',
            message: 'Are you sure you want to delete this category?',
            confirmText: 'Delete',
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.categories.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Content Categories"
                description="Organize your blog posts, projects and resources into structured categories."
                actions={
                    <Link href={route('admin.categories.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Add Category
                        </DashboardButton>
                    </Link>
                }
            >
                {categories.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                        <TagIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400 font-medium italic">No categories created yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <DashboardCard 
                                key={category.id} 
                                className="group flex flex-col justify-between h-full border-transparent hover:border-[#1F2BF3]/20 transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3] group-hover:scale-110 transition-transform">
                                        <TagIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight uppercase group-hover:text-[#1F2BF3] transition-colors line-clamp-1">
                                            {category.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: #{category.id}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <Link
                                        href={route('admin.categories.edit', category.id)}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] hover:underline"
                                    >
                                        Edit Details
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </DashboardCard>
                        ))}
                    </div>
                )}
            </DashboardPage>
        </AdminLayout>
    );
}
