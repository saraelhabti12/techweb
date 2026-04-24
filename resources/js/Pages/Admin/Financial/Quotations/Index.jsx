import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, Plus, Search, Edit, Trash2, Copy, 
    Send, CheckCircle, XCircle, Clock, ArrowRight, Download
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function Index({ auth, quotations }) {
    const statusColors = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        accepted: 'bg-green-100 text-green-700 border-green-200',
        rejected: 'bg-red-100 text-red-700 border-red-200',
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            router.delete(route('admin.quotations.destroy', id));
        }
    };

    const handleDuplicate = (id) => {
        if (confirm('Duplicate this quotation?')) {
            router.post(route('admin.quotations.duplicate', id));
        }
    };

    const handleConvertToInvoice = (id) => {
        if (confirm('Convert this accepted quotation to an invoice?')) {
            router.post(route('admin.quotations.convert-to-invoice', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Quotations (Devis)" />

            <DashboardPage
                title="Quotations Management"
                description="Create and manage professional quotations for your clients."
                actions={
                    <DashboardButton
                        variant="primary"
                        onClick={() => router.visit(route('admin.quotations.create'))}
                    >
                        <Plus className="w-4 h-4" />
                        New Quotation
                    </DashboardButton>
                }
            >
                <DashboardCard>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Number</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Client</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Total</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {quotations.data.length > 0 ? quotations.data.map((quotation) => (
                                    <motion.tr 
                                        key={quotation.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                                {quotation.quotation_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {quotation.client?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(quotation.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(quotation.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[quotation.status]}`}>
                                                {quotation.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <div className="flex justify-end gap-2">
                                                <a 
                                                    href={route('admin.quotations.download-pdf', quotation.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                    target="_blank"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                {quotation.status === 'accepted' && (
                                                    <button 
                                                        onClick={() => handleConvertToInvoice(quotation.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Convert to Invoice"
                                                    >
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDuplicate(quotation.id)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <Link 
                                                    href={route('admin.quotations.edit', quotation.id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(quotation.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No quotations found. Start by creating one.
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
