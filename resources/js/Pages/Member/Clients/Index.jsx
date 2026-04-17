import React, { useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    UserPlus, Phone, MapPin, Calendar, Edit, Trash2, BookOpen, 
    MessageCircle, Mail, Globe, Clock, FileText, Search, 
    UserCheck, ShieldAlert, XCircle, Info
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ auth, clients, filters = {} }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'project_manager';
    const Layout = isAdmin ? AdminLayout : MemberLayout;
    const createRoute = isAdmin ? 'admin.clients.create' : 'member.clients.create';
    const editRoute = isAdmin ? 'admin.clients.edit' : 'member.clients.edit';
    const destroyRoute = isAdmin ? 'admin.clients.destroy' : 'member.clients.destroy';

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [blacklistReason, setBlacklistReason] = useState('');
    const [blacklistError, setBlacklistError] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route(isAdmin ? 'admin.clients.index' : 'member.clients.index'), { search: searchTerm }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(route(destroyRoute, id));
        }
    };

    const addToContacts = (id) => {
        if (confirm('Move this client to official Contacts database?')) {
            router.post(route('admin.clients.addToContacts', id));
        }
    };

    const openBlacklistModal = (client) => {
        setSelectedClient(client);
        setBlacklistReason('');
        setBlacklistError('');
        setIsBlacklistModalOpen(true);
    };

    const handleBlacklist = (e) => {
        e.preventDefault();
        if (!blacklistReason) {
            setBlacklistError('Reason is required');
            return;
        }
        router.post(route('admin.clients.blacklist.store', selectedClient.id), {
            reason: blacklistReason
        }, {
            onSuccess: () => {
                setIsBlacklistModalOpen(false);
                setSelectedClient(null);
            }
        });
    };

    const statusColors = {
        interested: 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200 dark:border-green-800',
        not_interested: 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-200 dark:border-red-800',
        pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200 dark:border-amber-800',
        prospect: 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] border border-blue-200 dark:border-blue-800',
        client: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 font-bold border border-emerald-500/20',
    };

    const contactMethodIcons = {
        whatsapp: <MessageCircle className="w-3.5 h-3.5" />,
        call: <Phone className="w-3.5 h-3.5" />,
        meeting: <UserPlus className="w-3.5 h-3.5" />,
    };

    return (
        <Layout auth={auth}>
            <Head title="Client Management" />

            <DashboardPage
                title="Professional CRM"
                description="Manage business relationships, documents, and leads with high-fidelity tracking."
                actions={
                    <div className="flex gap-3">
                        {isAdmin && (
                            <Link href={route('admin.clients.blacklist')}>
                                <DashboardButton variant="secondary" className="flex items-center gap-2 !bg-red-50 dark:!bg-red-900/20 !text-red-600 border !border-red-200 dark:!border-red-800">
                                    <ShieldAlert className="w-4 h-4" />
                                    Blacklist
                                </DashboardButton>
                            </Link>
                        )}
                        <Link href={route(createRoute)}>
                            <DashboardButton className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                Add Client
                            </DashboardButton>
                        </Link>
                    </div>
                }
            >
                {/* Search Bar */}
                <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative group max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, company, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1F2BF3] dark:text-white transition-all"
                        />
                    </form>
                </div>

                <DashboardCard className="!p-0 overflow-hidden border-none shadow-2xl shadow-blue-500/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Business Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status & Strategy</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Notes & Docs</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                <AnimatePresence mode="popLayout">
                                    {clients.map((client) => (
                                        <motion.tr
                                            key={client.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-blue-50/30 dark:hover:bg-[#1F2BF3]/5 transition-colors group"
                                        >
                                            {/* 1. Identity */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-start gap-4">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform overflow-hidden">
                                                            {client.logo ? (
                                                                <img src={`/storage/${client.logo}`} alt={client.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                client.name.charAt(0)
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors flex items-center gap-2 truncate">
                                                            {client.name}
                                                        </div>
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-0.5 truncate">
                                                            {client.company_name || 'Individual Lead'}
                                                        </div>
                                                        {client.website && (
                                                            <a 
                                                                href={client.website} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-[9px] font-bold text-[#1F2BF3] hover:underline flex items-center gap-1 mt-1 truncate"
                                                            >
                                                                <Globe className="w-2.5 h-2.5" />
                                                                {client.website.replace(/^https?:\/\//, '')}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 2. Professional Contact */}
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5 text-xs">
                                                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-bold group-hover:text-[#1F2BF3] transition-colors">
                                                        <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                        {client.phone}
                                                    </div>
                                                    {client.whatsapp && (
                                                        <div className="flex items-center text-green-600 font-bold">
                                                            <MessageCircle className="w-3.5 h-3.5 mr-2" />
                                                            {client.whatsapp}
                                                        </div>
                                                    )}
                                                    {client.email && (
                                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                            <Mail className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                            {client.email}
                                                        </div>
                                                    )}
                                                    <div className="flex items-start text-gray-400 text-[10px] leading-tight mt-1">
                                                        <MapPin className="w-3 h-3 mr-1 mt-0.5 shrink-0" />
                                                        <span className="italic">{client.city || 'N/A'} {client.address && `| ${client.address}`}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 3. Status & Strategy */}
                                            <td className="px-6 py-5">
                                                <div className="space-y-2">
                                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${statusColors[client.status] || 'bg-gray-100'}`}>
                                                        {client.status.replace('_', ' ')}
                                                    </span>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                                            <Clock className="w-2.5 h-2.5 mr-1 text-[#1F2BF3]" />
                                                            Next: {client.contact_date || 'TBD'}
                                                        </div>
                                                        <div className="flex items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                                            <div className="mr-1 text-[#1F2BF3]">
                                                                {contactMethodIcons[client.contact_method] || <Phone className="w-2.5 h-2.5" />}
                                                            </div>
                                                            {client.contact_method}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 4. Notes & Documents */}
                                            <td className="px-6 py-5">
                                                <div className="max-w-[200px] space-y-3">
                                                    {client.notes ? (
                                                        <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700">
                                                            <FileText className="w-3 h-3 text-[#1F2BF3] shrink-0 mt-0.5" />
                                                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium line-clamp-2">
                                                                {client.notes}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-[10px] text-gray-300 italic">No notes added...</p>
                                                    )}
                                                    
                                                    <Link 
                                                        href={route(editRoute, client.id)}
                                                        className="flex items-center gap-2 group/docs hover:translate-x-1 transition-transform"
                                                    >
                                                        <div className="w-7 h-7 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-100 dark:border-gray-800 text-gray-400 relative group-hover/docs:border-[#1F2BF3] group-hover/docs:text-[#1F2BF3] transition-colors">
                                                            <BookOpen className="w-3.5 h-3.5" />
                                                            {client.files && client.files.length > 0 && (
                                                                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1F2BF3] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white dark:border-gray-950 shadow-lg">
                                                                    {client.files.length}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover/docs:text-[#1F2BF3] transition-colors">
                                                            {client.files && client.files.length > 0 ? 'View Documents' : 'No Documents'}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </td>

                                            {/* 5. Operations */}
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={route(isAdmin ? 'admin.clients.show' : 'member.clients.show', client.id)}
                                                            className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 dark:border-blue-800"
                                                            title="View Details"
                                                        >
                                                            <Info className="w-3.5 h-3.5" />
                                                        </Link>
                                                        <Link
                                                            href={route(editRoute, client.id)}
                                                            className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 dark:border-emerald-800"
                                                            title="Edit Client"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(client.id)}
                                                            className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 dark:border-red-800"
                                                            title="Delete Client"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                    
                                                    {isAdmin && (
                                                        <div className="flex items-center justify-end gap-2 mt-1">
                                                            <button
                                                                onClick={() => addToContacts(client.id)}
                                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] text-[9px] font-black uppercase tracking-tighter hover:bg-[#1F2BF3] hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                                                                title="Add to Contacts"
                                                            >
                                                                <UserCheck className="w-3 h-3" />
                                                                Contact
                                                            </button>
                                                            <button
                                                                onClick={() => openBlacklistModal(client)}
                                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-[9px] font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all border border-red-100 dark:border-red-800"
                                                                title="Add to Blacklist"
                                                            >
                                                                <ShieldAlert className="w-3 h-3" />
                                                                Block
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserPlus className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                                                <p className="text-gray-400 font-medium italic">No clients found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>

            {/* Blacklist Modal */}
            <Modal show={isBlacklistModalOpen} onClose={() => setIsBlacklistModalOpen(false)}>
                <form onSubmit={handleBlacklist} className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 rounded-2xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white">Blacklist Client</h2>
                            <p className="text-xs text-gray-500">Reason for blocking <span className="font-bold">{selectedClient?.name}</span></p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="reason" value="Blocking Reason" className="!text-[10px] !font-black !uppercase !tracking-widest" />
                            <select
                                id="reason_template"
                                className="w-full mt-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all mb-2"
                                onChange={(e) => setBlacklistReason(e.target.value)}
                            >
                                <option value="">Select a reason or type below...</option>
                                <option value="Bad communication">Bad communication</option>
                                <option value="No payment / Payment issues">No payment / Payment issues</option>
                                <option value="Spam / Unsolicited messages">Spam / Unsolicited messages</option>
                                <option value="Disrespectful behavior">Disrespectful behavior</option>
                                <option value="Fraudulent activity">Fraudulent activity</option>
                            </select>
                            <textarea
                                id="reason"
                                className="w-full mt-1 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all h-32"
                                placeholder="Describe the reason in detail..."
                                value={blacklistReason}
                                onChange={(e) => setBlacklistReason(e.target.value)}
                                required
                            />
                            <InputError message={blacklistError} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsBlacklistModalOpen(false)} className="!rounded-xl">
                            Cancel
                        </SecondaryButton>
                        <DangerButton type="submit" className="!rounded-xl !bg-red-600 hover:!bg-red-700 shadow-lg shadow-red-500/20">
                            Confirm Blacklist
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
}
