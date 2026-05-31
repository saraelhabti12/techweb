import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import { 
    ShieldAlert, UserCheck, Phone, Mail, Clock, Info, Search, RotateCcw
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfirm } from '@/Contexts/ConfirmContext';

export default function Blacklist({ auth, clients, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const confirm = useConfirm();

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.clients.blacklist'), { search: searchTerm }, {
            preserveState: true,
            replace: true
        });
    };

    const handleUnblock = async (id) => {
        const isConfirmed = await confirm({
            title: 'Unblock Client',
            message: 'Are you sure you want to unblock this client? They will be moved back to the active list.',
            confirmText: 'Unblock Identity',
            variant: 'primary'
        });

        if (isConfirmed) {
            router.post(route('admin.clients.unblock', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Blacklisted Clients" />

            <DashboardPage
                title="Blacklisted Clients"
                description="Monitor and manage blocked entities. These clients are excluded from standard CRM operations."
                actions={
                    <DashboardButton 
                        variant="secondary" 
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Go Back
                    </DashboardButton>
                }
            >
                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search blocked clients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 dark:text-white transition-all"
                        />
                    </form>
                </div>

                <DashboardCard className="!p-0 overflow-hidden border border-red-100 dark:border-red-900/30">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-red-50/50 dark:bg-red-900/10 backdrop-blur-md">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400">Blocked Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400">Blocking Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400">Date Blocked</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-400 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-50 dark:divide-red-900/20">
                                <AnimatePresence mode="popLayout">
                                    {clients.map((client) => (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-red-50/30 dark:hover:bg-red-900/5 transition-colors group"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center font-black shadow-sm group-hover:rotate-12 transition-transform">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">
                                                            {client.name}
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                            {client.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-start gap-2 max-w-xs">
                                                    <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 shrink-0">
                                                        <Info className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                                        "{client.blacklist_reason || 'No reason specified'}"
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    <Clock className="w-3 h-3 mr-2 text-red-500" />
                                                    {new Date(client.updated_at).toLocaleDateString()}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => handleUnblock(client.id)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 dark:border-emerald-800 shadow-sm shadow-emerald-500/10"
                                                    >
                                                        <UserCheck className="w-4 h-4" />
                                                        Unblock
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                    <ShieldAlert className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                </div>
                                                <p className="text-gray-400 font-medium italic">No blacklisted clients found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
