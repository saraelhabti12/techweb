import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon, UserIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/Contexts/ConfirmContext';

export default function Index({ creators, auth, filters }) {
    const { t } = useTranslation();
    const confirm = useConfirm();
    const statusColors = {
        available: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        busy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        on_shoot: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        vacation: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const statusLabels = {
        available: t('available_status'),
        busy: t('busy_status'),
        on_shoot: t('on_shoot_status'),
        vacation: t('vacation_status'),
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('creators_management')}
                description={t('manage_creators_desc')}
                actions={
                    <Link href={route('admin.creators.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            {t('add_creator')}
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder={t('search_creators_placeholder')}
                        className="w-full md:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-6 py-3 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all outline-none dark:text-white"
                        defaultValue={filters.search}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                router.get(route('admin.creators.index'), { search: e.target.value }, { preserveState: true });
                            }
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {creators.data.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <UserIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium italic">{t('no_creators_found')}</p>
                        </div>
                    ) : (
                        creators.data.map((creator) => (
                            <DashboardCard key={creator.id} className="group !p-0 overflow-hidden flex flex-col h-full border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all relative">
                                <div className="aspect-[3/4] w-full bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                                    {creator.profile_photo ? (
                                        <img 
                                            src={`/storage/${creator.profile_photo}`} 
                                            alt={creator.full_name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                                            <UserIcon className="w-16 h-16" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${statusColors[creator.availability_status]}`}>
                                            {statusLabels[creator.availability_status]}
                                        </span>
                                        {!creator.active && (
                                            <span className="px-3 py-1 bg-gray-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {t('inactive')}
                                            </span>
                                        )}
                                    </div>

                                    {creator.visible_on_homepage && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                {t('featured')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-black text-xl text-gray-900 dark:text-white leading-tight group-hover:text-[#1F2BF3] transition-colors mb-2">
                                        {creator.display_name}
                                    </h3>
                                    
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPinIcon className="w-4 h-4" />
                                            {creator.city || t('location_na')}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-[#1F2BF3]">
                                            <CurrencyDollarIcon className="w-4 h-4" />
                                            {creator.daily_rate ? t('day_rate', { rate: creator.daily_rate }) : t('rate_na')}
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Link href={route('admin.creators.show', creator.id)}>
                                                <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all">
                                                    <EyeIcon className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <Link href={route('admin.creators.edit', creator.id)}>
                                                <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                            </Link>
                                        </div>
                                        <button 
                                            onClick={async () => {
                                                const isConfirmed = await confirm({
                                                    title: t('delete_creator'),
                                                    message: t('delete_creator_confirm'),
                                                    confirmText: t('delete'),
                                                    variant: 'danger'
                                                });
                                                if (isConfirmed) {
                                                    router.delete(route('admin.creators.destroy', creator.id));
                                                }
                                            }}
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

                {/* Simple Pagination info if needed */}
                {creators.links && creators.links.length > 3 && (
                    <div className="mt-12 flex justify-center gap-2">
                        {creators.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    link.active 
                                    ? 'bg-[#1F2BF3] text-white' 
                                    : 'bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
                                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </DashboardPage>
        </AdminLayout>
    );
}
