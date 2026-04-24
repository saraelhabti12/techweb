import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { 
    Phone, 
    Mail, 
    Globe, 
    MapPin, 
    Calendar, 
    MessageSquare, 
    FileText, 
    Download,
    Building2,
    ExternalLink,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Youtube,
    Play
} from 'lucide-react';

export default function Show({ auth, client, quotations = [], invoices = [], financials = {} }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'project_manager';
    const Layout = isAdmin ? AdminLayout : MemberLayout;
    const editRoute = isAdmin ? 'admin.clients.edit' : 'member.clients.edit';

    const statusColors = {
        interested: 'bg-green-50 text-green-700 border-green-100',
        not_interested: 'bg-red-50 text-red-700 border-red-100',
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        prospect: 'bg-blue-50 text-[#1F2BF3] border-blue-100',
        client: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    };

    return (
        <Layout auth={auth}>
            <Head title={`Client: ${client.name}`} />

            <DashboardPage 
                title="Client Profile"
                description="Comprehensive view of business relationship and documentation."
                actions={
                    <div className="flex gap-3">
                        <Link href={route(editRoute, client.id)}>
                            <DashboardButton className="text-sm">Edit Profile</DashboardButton>
                        </Link>
                        <DashboardButton 
                            variant="secondary" 
                            onClick={() => window.history.back()}
                            className="text-sm"
                        >
                            Go Back
                        </DashboardButton>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Business Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <DashboardCard className="text-center overflow-hidden !p-0">
                            <div className="h-24 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]" />
                            <div className="px-6 pb-8 -mt-12">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                        <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {client.logo ? (
                                                <img src={`/storage/${client.logo}`} alt={client.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Building2 className="w-10 h-10 text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                    <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${statusColors[client.status]}`}>
                                        {client.status}
                                    </span>
                                </div>
                                <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white tracking-tight">{client.name}</h2>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{client.company_name || 'Individual Client'}</p>
                                
                                <div className="mt-8 space-y-3">
                                    <a href={`tel:${client.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-[#1F2BF3] hover:text-white transition-all group">
                                        <Phone className="w-4 h-4" />
                                        <span className="text-sm font-bold">{client.phone}</span>
                                    </a>
                                    <a href={`mailto:${client.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-[#1F2BF3] hover:text-white transition-all group">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm font-bold truncate">{client.email || 'No email provided'}</span>
                                    </a>
                                    {client.website && (
                                        <a href={client.website} target="_blank" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300 hover:bg-[#1F2BF3] hover:text-white transition-all group">
                                            <Globe className="w-4 h-4" />
                                            <span className="text-sm font-bold truncate">Visit Website</span>
                                            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                                        </a>
                                    )}

                                    {client.social_links && client.social_links.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-left">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-3 ml-1">Social Presence</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                {client.social_links.map((link, index) => {
                                                    const Icon = {
                                                        instagram: Instagram,
                                                        tiktok: Play, // Tiktok often uses Play or generic Music icon if not available
                                                        youtube: Youtube,
                                                        facebook: Facebook,
                                                        linkedin: Linkedin,
                                                        twitter: Twitter,
                                                        other: ExternalLink
                                                    }[link.platform] || Globe;

                                                    return (
                                                        <a 
                                                            key={index} 
                                                            href={link.url} 
                                                            target="_blank" 
                                                            className="flex items-center justify-center aspect-square rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-400 hover:text-[#1F2BF3] hover:bg-[#1F2BF3]/5 transition-all"
                                                            title={link.platform}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Engagement Logic">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-400">Next Contact</span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{client.contact_date || 'Not Scheduled'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-400">Preferred Channel</span>
                                    <span className="px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 text-[10px] font-black uppercase rounded-md">{client.contact_method}</span>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Right Column: Details & Docs */}
                    <div className="lg:col-span-2 space-y-6">
                        <DashboardCard title="Professional Dossier">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-2">Business Address</h4>
                                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-5 h-5 mt-0.5 text-gray-400" />
                                        <p className="font-medium">{client.address || 'No address registered.'}<br/>{client.city}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-2">Context & Notes</h4>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-sm leading-relaxed italic text-gray-500">
                                            {client.notes || 'No background information or notes available for this client.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Document Repository">
                            {client.files && client.files.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {client.files.map((file) => (
                                        <div key={file.id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-[#1F2BF3]/30 transition-all shadow-sm">
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1F2BF3]">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{file.original_name}</p>
                                                    <p className="text-[9px] font-black uppercase text-gray-400">Attached Document</p>
                                                </div>
                                            </div>
                                            <a 
                                                href={`/storage/${file.file_path}`} 
                                                target="_blank"
                                                className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <Download className="w-4 h-4 text-gray-400" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                                    <FileText className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                                    <p className="text-gray-400 text-sm font-medium">No documents attached.</p>
                                </div>
                            )}
                        </DashboardCard>

                        <DashboardCard title="Client Quotations">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Number</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Date</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Total</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Status</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {quotations && quotations.length > 0 ? quotations.map((quotation) => (
                                            <tr key={quotation.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs font-bold">{quotation.quotation_number}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(quotation.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-xs font-bold">{quotation.total} DH</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                        quotation.status === 'accepted' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {quotation.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <a 
                                                        href={route('quotations.download-pdf', quotation.id)}
                                                        className="p-1.5 inline-flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                        title="Download Devis"
                                                        target="_blank"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-xs italic">
                                                    No quotations issued yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DashboardCard>

                        {/* Invoices List */}
                        <DashboardCard title="Client Invoices">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Number</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Date</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Total</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400">Status</th>
                                            <th className="px-4 py-3 text-[10px] font-black uppercase text-gray-400 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {invoices && invoices.length > 0 ? invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs font-bold">{invoice.invoice_number}</td>
                                                <td className="px-4 py-3 text-xs text-gray-500">{new Date(invoice.date).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 text-xs font-bold">{invoice.total} DH</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                        invoice.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {invoice.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <a 
                                                        href={route('invoices.download-pdf', invoice.id)}
                                                        className="p-1.5 inline-flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                                                        title="Download Invoice"
                                                        target="_blank"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-xs italic">
                                                    No invoices issued yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DashboardCard>

                        {/* Financial History */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <DashboardCard title="Financial Pulse">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Revenue</p>
                                            <p className="text-xl font-black text-emerald-600">{financials.total_revenue || 0}€</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Unpaid Amount</p>
                                            <p className="text-xl font-black text-rose-600">{financials.unpaid_amount || 0}€</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Accepted Devis</p>
                                            <p className="text-xl font-black text-blue-600">{financials.accepted_quotations || 0}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Invoices</p>
                                            <p className="text-xl font-black text-indigo-600">{financials.invoices_count || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Payment Records">
                                <div className="space-y-3">
                                    {financials.payment_history && financials.payment_history.length > 0 ? financials.payment_history.map(payment => (
                                        <div key={payment.id} className="flex justify-between items-center p-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{payment.amount}€ - {payment.payment_method}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(payment.payment_date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-1 rounded">SUCCESS</div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-gray-400 text-xs py-8">No payment history available.</p>
                                    )}
                                </div>
                            </DashboardCard>
                        </div>
                    </div>
                </div>
            </DashboardPage>
        </Layout>
    );
}
