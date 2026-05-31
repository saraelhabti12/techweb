import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { TrashIcon, PencilIcon, UserPlusIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';
import { motion } from 'framer-motion';
import Avatar from '@/Components/UI/Avatar';
import UserStatus from '@/Components/UI/UserStatus';
import { useTranslation } from 'react-i18next';

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function MembersIndex({ members, auth, filters = {} }) {
    const { t } = useTranslation();
    const confirm = useConfirm();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: t('delete_member_title', { defaultValue: 'Supprimer un membre' }),
            message: t('delete_member_confirm', { defaultValue: 'Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est irréversible.' }),
            confirmText: t('delete', { defaultValue: 'Supprimer' }),
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.members.destroy', id));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.members.index'), { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearSearch = () => {
        setSearchTerm('');
        router.get(route('admin.members.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('team_members')}
                description={t('manage_structure_desc')}
                actions={
                    <Link href={route('admin.members.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <UserPlusIcon className="w-5 h-5" />
                            {t('add_member')}
                        </DashboardButton>
                    </Link>
                }
            >
                {/* Search Header */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="p-6 bg-gray-50/50 dark:bg-gray-900/20">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <DashboardInput 
                                    icon={MagnifyingGlassIcon}
                                    placeholder={t('search_members_placeholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DashboardButton type="submit">{t('search')}</DashboardButton>
                                {searchTerm && (
                                    <DashboardButton variant="secondary" onClick={clearSearch}>{t('reset')}</DashboardButton>
                                )}
                            </div>
                        </form>
                    </div>
                </DashboardCard>

                {/* Members Table */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('profile')}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('email_address')}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('role')}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {members.map((member) => (
                                    <motion.tr 
                                        key={member.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Avatar user={member} size="md" />
                                                    <div className="absolute -bottom-1 -right-1">
                                                        <UserStatus user={member} showText={false} className="border-2 border-white dark:border-gray-950 rounded-full bg-white dark:bg-gray-950" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">{member.name}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        <UserStatus user={member} />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{member.email}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg text-xs font-black uppercase tracking-widest w-fit">
                                                    {member.role || 'Member'}
                                                </span>
                                                {member.show_on_homepage && (
                                                    <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit">
                                                        On Homepage
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.members.show', member.id)}>
                                                    <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={route('admin.members.edit', member.id)}>
                                                    <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
