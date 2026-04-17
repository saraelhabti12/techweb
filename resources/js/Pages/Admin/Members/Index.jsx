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

const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    router.delete(route('admin.members.destroy', id));
};

export default function MembersIndex({ members, auth, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

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
                title="Team Members"
                description="Manage your organizational structure, roles, and access permissions."
                actions={
                    <Link href={route('admin.members.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <UserPlusIcon className="w-5 h-5" />
                            Add Member
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
                                    placeholder="Search by name, email or role..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <DashboardButton type="submit">Search</DashboardButton>
                                {searchTerm && (
                                    <DashboardButton variant="secondary" onClick={clearSearch}>Reset</DashboardButton>
                                )}
                            </div>
                        </form>
                    </div>
                </DashboardCard>

                {/* Members Table */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Profile</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
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
                                            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg text-xs font-black uppercase tracking-widest">
                                                {member.role || 'Member'}
                                            </span>
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
