import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { MagnifyingGlassIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardInput from '@/Components/UI/DashboardInput';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Index({ messages, unreadCount, auth, filters = {} }) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.customers.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.customers.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('customer_messages_crm')}
                description={t('manage_inquiries_desc', { count: unreadCount })}
            >
                {/* Search & Filters */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <DashboardInput
                                    icon={MagnifyingGlassIcon}
                                    placeholder={t('search_messages_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DashboardButton type="submit" variant="primary" className="!px-6">
                                    {t('search')}
                                </DashboardButton>
                                {searchTerm && (
                                    <DashboardButton type="button" variant="secondary" onClick={clearSearch} className="!px-6">
                                        {t('reset')}
                                    </DashboardButton>
                                )}
                            </div>
                        </form>
                    </div>
                </DashboardCard>

                {/* Messages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <p className="text-gray-400 font-medium italic">{t('no_messages_found')}</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <DashboardCard 
                                key={msg.id} 
                                className={`group flex flex-col justify-between overflow-hidden relative border ${
                                    !msg.is_read 
                                        ? 'border-[#1F2BF3] shadow-md shadow-blue-500/10' 
                                        : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                }`}
                            >
                                {!msg.is_read && (
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#1F2BF3] to-transparent opacity-20 group-hover:opacity-40 transition-opacity rounded-bl-full" />
                                )}
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm ${
                                                !msg.is_read ? 'bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0]' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                            }`}>
                                                {msg.full_name?.charAt(0) || <EnvelopeIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${!msg.is_read ? 'text-[#1F2BF3] dark:text-[#00D8C0]' : 'text-gray-900 dark:text-white'}`}>
                                                    {msg.full_name}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{new Date(msg.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                                        {msg.message}
                                    </p>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                        !msg.is_read 
                                            ? 'bg-blue-50 text-[#1F2BF3] dark:bg-blue-900/20' 
                                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                    }`}>
                                        {msg.is_read ? t('read') : t('new')}
                                    </span>
                                    <Link href={(msg && msg.id && route().has('admin.customers.show')) ? route('admin.customers.show', msg.id) : '#'}>
                                        <button className="flex items-center gap-1.5 text-xs font-bold text-gray-400 group-hover:text-[#1F2BF3] transition-colors">
                                            {t('view_details')} <EyeIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </Link>
                                </div>
                            </DashboardCard>
                        ))
                    )}
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
