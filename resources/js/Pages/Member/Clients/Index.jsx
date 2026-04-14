import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link, router } from '@inertiajs/react';
import { UserPlus, Phone, MapPin, Calendar, Edit, Trash2, BookOpen } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function Index({ auth, clients }) {
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(route('member.clients.destroy', id));
        }
    };

    const statusColors = {
        interested: 'bg-green-50 dark:bg-green-900/20 text-green-600',
        not_interested: 'bg-red-50 dark:bg-red-900/20 text-red-600',
        pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="Client Management" />

            <DashboardPage 
                title="My Clients (CRM)"
                description="Manage and track your personal client relationships and leads."
                actions={
                    <Link href={route('member.clients.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" />
                            Add Client
                        </DashboardButton>
                    </Link>
                }
            >
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Client Details</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Contact Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Last Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {clients.map((client) => (
                                    <motion.tr 
                                        key={client.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">{client.name}</div>
                                                    <div className="text-xs text-gray-500 line-clamp-1 max-w-[200px] mt-0.5">{client.notes || 'No notes'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="space-y-1.5 text-sm">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                                                    <Phone className="w-3.5 h-3.5 mr-2 text-[#1F2BF3]" />
                                                    {client.phone}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                    <MapPin className="w-3 h-3 mr-2" />
                                                    {client.city || 'Location unknown'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`text-[10px] px-2.5 py-1.5 rounded-md font-black uppercase tracking-widest ${statusColors[client.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {client.status?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                {client.contact_date ? new Date(client.contact_date).toLocaleDateString() : 'Never'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={route('member.appointments.create', { client_id: client.id })}
                                                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm"
                                                    title="Schedule Appointment"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={route('member.clients.edit', client.id)}
                                                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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
        </MemberLayout>
    );
}
