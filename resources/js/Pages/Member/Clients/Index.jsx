import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UserPlus, Phone, MapPin, Calendar, Edit, Trash2, BookOpen } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function Index({ auth, clients }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'project_manager';
    const Layout = isAdmin ? AdminLayout : MemberLayout;
    const createRoute = isAdmin ? 'admin.clients.create' : 'member.clients.create';
    const editRoute = isAdmin ? 'admin.clients.edit' : 'member.clients.edit';
    const destroyRoute = isAdmin ? 'admin.clients.destroy' : 'member.clients.destroy';

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(route(destroyRoute, id));
        }
    };

    const statusColors = {
        interested: 'bg-green-50 dark:bg-green-900/20 text-green-600',
        not_interested: 'bg-red-50 dark:bg-red-900/20 text-red-600',
        pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
        prospect: 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]',
        client: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold border border-emerald-500/20',
    };

    return (
        <Layout auth={auth}>
            <Head title="Client Management" />

            <DashboardPage
                title="Professional CRM"
                description="Manage business relationships, documents, and leads with high-fidelity tracking."
                actions={
                    <Link href={route(createRoute)}>
                        <DashboardButton className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Client
                        </DashboardButton>
                    </Link>
                }
            >
                <DashboardCard className="!p-0 overflow-hidden border-none shadow-2xl shadow-blue-500/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Business Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Lifecycle Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Docs</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {clients.map((client) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-blue-50/30 dark:hover:bg-[#1F2BF3]/5 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform overflow-hidden">
                                                        {client.logo ? (
                                                            <img src={`/storage/${client.logo}`} alt={client.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            client.name.charAt(0)
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors flex items-center gap-2">
                                                        {client.name}
                                                    </div>
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
                                                        {client.company_name || 'Individual Lead'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5 text-sm">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300 font-bold group-hover:text-[#1F2BF3] transition-colors">
                                                    <Phone className="w-3.5 h-3.5 mr-2" />
                                                    {client.phone}
                                                </div>
                                                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
                                                    <MapPin className="w-3 h-3 mr-2" />
                                                    {client.city || 'Location N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${statusColors[client.status] || 'bg-gray-100'}`}>
                                                    {client.status.replace('_', ' ')}
                                                </span>
                                                <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                    <Calendar className="w-2.5 h-2.5 mr-1" />
                                                    Next: {client.contact_date || 'TBD'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center">
                                                <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center border border-gray-100 dark:border-gray-700 text-gray-400">
                                                    <BookOpen className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={route(editRoute, client.id)}
                                                    className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-emerald-500/20"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm hover:shadow-red-500/20"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-400 font-medium italic">No clients found. Start by adding your first client!</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </Layout>
    );
}
