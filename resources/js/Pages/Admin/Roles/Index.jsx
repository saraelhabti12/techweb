import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import { TrashIcon, PencilIcon, ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

import { useConfirm } from '@/Contexts/ConfirmContext';

export default function RolesIndex({ roles, auth }) {
    const confirm = useConfirm();

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: 'Delete Role',
            message: 'Are you sure you want to delete this security role? This may affect users assigned to this role.',
            confirmText: 'Delete Role',
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.roles.destroy', id));
        }
    };
    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Roles & Permissions"
                description="Manage custom roles and define specific access permissions for each module."
                actions={
                    <Link href={route('admin.roles.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Add Role
                        </DashboardButton>
                    </Link>
                }
            >
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Role Name</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Permissions</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {roles.map((role) => (
                                    <motion.tr 
                                        key={role.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]">
                                                    <ShieldCheckIcon className="w-5 h-5" />
                                                </div>
                                                <div className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">{role.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-wrap gap-1 max-w-xl">
                                                {role.permissions.slice(0, 10).map((permission) => (
                                                    <span key={permission.id} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-[10px] font-medium">
                                                        {permission.name}
                                                    </span>
                                                ))}
                                                {role.permissions.length > 10 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-[10px] font-medium">
                                                        +{role.permissions.length - 10} more
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.roles.edit', role.id)}>
                                                    <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                {role.name !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDelete(role.id)}
                                                        className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
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
