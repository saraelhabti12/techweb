import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function Index({ blogs, auth }) {
    const { t } = useTranslation();
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: t('delete_blog_title', { defaultValue: 'Supprimer un article' }),
            message: t('delete_blog_confirm', { defaultValue: 'Êtes-vous sûr de vouloir supprimer cet article ?' }),
            confirmText: t('delete', { defaultValue: 'Supprimer' }),
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.blogs.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('blog_management')}
                description={t('manage_blog_desc')}
                actions={
                    <Link href={route('admin.blogs.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            {t('create_article')}
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium italic">{t('no_articles_found')}</p>
                        </div>
                    ) : (
                        blogs.map((blog) => (
                            <DashboardCard key={blog.id} className="group !p-0 overflow-hidden flex flex-col h-full border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                                {/* Blog Image Placeholder/Preview */}
                                <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                    {blog.image ? (
                                        <img 
                                            src={`/storage/${blog.image}`} 
                                            alt={blog.title} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <DocumentTextIcon className="w-12 h-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] shadow-sm">
                                            {blog.category?.name || t('article')}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start gap-4 mb-3">
                                        <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-[#1F2BF3] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                    </div>
                                    
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                                        {blog.excerpt || t('no_description_provided')}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Link href={route('admin.blogs.show', blog.id)}>
                                                <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all">
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <Link href={route('admin.blogs.edit', blog.id)}>
                                                <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(blog.id)}
                                            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </DashboardCard>
                        ))
                    )}
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
