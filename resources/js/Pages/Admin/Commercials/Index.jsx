import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { TrashIcon, PencilIcon, UserPlusIcon, MagnifyingGlassIcon, EyeIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';
import { motion } from 'framer-motion';

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function CommercialsIndex({ commercials, auth, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [projectSearch, setProjectSearch] = useState(filters.project || '');
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Commercial Agent',
            message: 'Are you sure you want to delete this commercial partner? This will affect commission tracking for associated projects.',
            confirmText: 'Delete Partner',
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.commercials.destroy', id));
        }
    };

    const handleProjectSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.commercials.index'), { project: projectSearch }, {
            preserveState: true,
            replace: true
        });
    };

    const filteredCommercials = commercials.filter(commercial => 
        commercial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (commercial.email && commercial.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Commercial Partners"
                description="Manage your external and internal commercial agents and their commissions."
                actions={
                    <Link href={route('admin.commercials.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <UserPlusIcon className="w-5 h-5" />
                            Add Commercial
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="space-y-6">
                    {/* Search Header */}
                    <DashboardCard className="!p-0 overflow-hidden">
                        <div className="p-6 bg-gray-50/50 dark:bg-gray-900/20">
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">General Search</label>
                                    <DashboardInput 
                                        icon={MagnifyingGlassIcon}
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                
                                <div className="lg:w-1/3">
                                    <form onSubmit={handleProjectSearch}>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Filter by Project</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <DashboardInput 
                                                    icon={BriefcaseIcon}
                                                    placeholder="Project name..."
                                                    value={projectSearch}
                                                    onChange={(e) => setProjectSearch(e.target.value)}
                                                />
                                            </div>
                                            <DashboardButton type="submit" className="!px-4">
                                                Go
                                            </DashboardButton>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>

                {/* Commercials Table */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Commission</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredCommercials.map((commercial) => (
                                    <motion.tr 
                                        key={commercial.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                {commercial.photo ? (
                                                    <img src={`/storage/${commercial.photo}`} alt={commercial.name} className="w-10 h-10 rounded-xl object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-[#1F2BF3]/10 text-[#1F2BF3] flex items-center justify-center font-bold">
                                                        {commercial.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">{commercial.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{commercial.email || 'No email'}</div>
                                            <div className="text-xs text-gray-400">{commercial.phone || 'No phone'}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg text-xs font-black uppercase tracking-widest">
                                                {commercial.commission_value} {commercial.commission_type === 'percentage' ? '%' : 'MAD'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                commercial.status === 'active' 
                                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' 
                                                : 'bg-red-50 dark:bg-red-900/20 text-red-600'
                                            }`}>
                                                {commercial.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.commercials.show', commercial.id)}>
                                                    <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={route('admin.commercials.edit', commercial.id)}>
                                                    <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(commercial.id)}
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
            </div>
        </DashboardPage>
    </AdminLayout>
    );
}
