import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    FileText, Plus, Search, Edit, Trash2, 
    Download, Send, CheckCircle, CreditCard, Clock
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function Index({ auth, invoices }) {
    const statusColors = {
        unpaid: 'bg-red-100 text-red-700 border-red-200',
        partial: 'bg-amber-100 text-amber-700 border-amber-200',
        paid: 'bg-green-100 text-green-700 border-green-200',
        late: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            router.delete(route('admin.invoices.destroy', id));
        }
    };

    const handleMarkPaid = (id) => {
        if (confirm('Mark this invoice as fully paid?')) {
            router.post(route('admin.invoices.mark-paid', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Invoices (Factures)" />

            <DashboardPage
                title="Invoices Management"
                description="Track billing, payments, and financial history."
                actions={
                    <DashboardButton
                        variant="primary"
                        onClick={() => router.visit(route('admin.invoices.create'))}
                    >
                        <Plus className="w-4 h-4" />
                        New Invoice
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
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Paid</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {invoices.data.length > 0 ? invoices.data.map((invoice) => (
                                    <motion.tr 
                                        key={invoice.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                                {invoice.invoice_number}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {invoice.client?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(invoice.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.total)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-green-600">
                                            {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(invoice.amount_paid)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[invoice.status]}`}>
                                                {invoice.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-1">
                                            <div className="flex justify-end gap-1">
                                                {invoice.status !== 'paid' && (
                                                    <button 
                                                        onClick={() => handleMarkPaid(invoice.id)}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Mark as Paid"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <a 
                                                    href={route('admin.invoices.download-pdf', invoice.id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                    target="_blank"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </a>
                                                <Link 
                                                    href={route('admin.invoices.edit', invoice.id)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                            No invoices found.
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
