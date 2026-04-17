import React, { useState, useEffect } from 'react';
import { useForm, router, Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, History, ExternalLink, Briefcase, TrendingUp, CheckCircle, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function CreateProject({ categories, clients, auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        category_id: '',
        project_type: 'Internal (Techweb)',
        client_id: '',
        start_date: '',
        end_date: '',
        status: 'active',
    });

    const [clientHistory, setClientHistory] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        if (data.client_id && data.project_type === 'Client Project') {
            fetchClientHistory(data.client_id);
        } else {
            setClientHistory(null);
        }
    }, [data.client_id, data.project_type]);

    const fetchClientHistory = async (clientId) => {
        setLoadingHistory(true);
        try {
            const response = await axios.get(route('admin.projects.clientHistory', clientId));
            setClientHistory(response.data);
        } catch (error) {
            console.error('Error fetching client history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.projects.store'));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'active': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'paused': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Create Project" />
            <DashboardPage 
                title="Create New Project"
                description="Fill in the details below to start a new project."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Main Form */}
                    <div className="flex-1">
                        <DashboardCard>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Project Name
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            autoFocus
                                            placeholder="e.g. Website Redesign"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="project_type" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Project Type
                                        </label>
                                        <select
                                            id="project_type"
                                            value={data.project_type}
                                            onChange={(e) => setData('project_type', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        >
                                            <option value="Internal (Techweb)">Internal (Techweb)</option>
                                            <option value="Client Project">Client Project</option>
                                        </select>
                                        {errors.project_type && <p className="mt-1 text-sm text-red-500 font-bold">{errors.project_type}</p>}
                                    </div>
                                </div>

                                {data.project_type === 'Client Project' && (
                                    <div>
                                        <label htmlFor="client_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Select Client
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                id="client_id"
                                                value={data.client_id}
                                                onChange={(e) => setData('client_id', e.target.value)}
                                                className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            >
                                                <option value="">Choose a client</option>
                                                {clients.map((client) => (
                                                    <option key={client.id} value={client.id}>
                                                        {client.name} - {client.phone}
                                                    </option>
                                                ))}
                                            </select>
                                            <Link href={route('admin.clients.create')}>
                                                <DashboardButton type="button" variant="secondary" className="!px-4">
                                                    <PlusIcon className="w-5 h-5" />
                                                </DashboardButton>
                                            </Link>
                                        </div>
                                        {errors.client_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.client_id}</p>}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        rows={4}
                                        placeholder="Project goals, scope, and initial notes..."
                                    />
                                    {errors.description && <p className="mt-1 text-sm text-red-500 font-bold">{errors.description}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="category_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Category
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.category_id}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Status
                                        </label>
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        >
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                            <option value="paused">Paused</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                        {errors.status && <p className="mt-1 text-sm text-red-500 font-bold">{errors.status}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="start_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Start Date
                                        </label>
                                        <input
                                            id="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        />
                                        {errors.start_date && <p className="mt-1 text-sm text-red-500 font-bold">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="end_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            End Date
                                        </label>
                                        <input
                                            id="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        />
                                        {errors.end_date && <p className="mt-1 text-sm text-red-500 font-bold">{errors.end_date}</p>}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <DashboardButton 
                                        type="submit" 
                                        disabled={processing} 
                                        className="w-full md:w-auto"
                                    >
                                        {processing ? 'Creating...' : 'Create Project'}
                                    </DashboardButton>
                                </div>
                            </form>
                        </DashboardCard>
                    </div>

                    {/* Sidebar: Client History */}
                    <AnimatePresence>
                        {data.client_id && data.project_type === 'Client Project' && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="w-full lg:w-80 shrink-0"
                            >
                                <div className="sticky top-8 space-y-6">
                                    <DashboardCard className="!p-6 border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative group">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <History size={120} />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-[#1F2BF3] rounded-xl text-white shadow-lg shadow-blue-500/20">
                                                    <History className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Client History</h3>
                                            </div>

                                            {loadingHistory ? (
                                                <div className="space-y-4 py-4">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                                                    ))}
                                                </div>
                                            ) : clientHistory ? (
                                                <div className="space-y-6">
                                                    {/* Summary Stats */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                                                            <p className="text-xl font-black text-gray-900 dark:text-white leading-none">{clientHistory.summary.total}</p>
                                                        </div>
                                                        <div className="bg-white dark:bg-gray-800/50 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active</p>
                                                            <p className="text-xl font-black text-blue-600 leading-none">{clientHistory.summary.active}</p>
                                                        </div>
                                                    </div>

                                                    {/* Projects List */}
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Previous Projects</p>
                                                        {clientHistory.projects.length > 0 ? (
                                                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                                                {clientHistory.projects.map(proj => (
                                                                    <div key={proj.id} className="p-3 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-[#1F2BF3]/30 transition-all group/item">
                                                                        <div className="flex justify-between items-start gap-2 mb-1">
                                                                            <p className="text-xs font-bold text-gray-900 dark:text-white line-clamp-1">{proj.name}</p>
                                                                            <Link href={route('admin.projects.show', proj.id)} className="opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                                                <ExternalLink className="w-3 h-3 text-[#1F2BF3]" />
                                                                            </Link>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${getStatusColor(proj.status)}`}>
                                                                                {proj.status}
                                                                            </span>
                                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter italic">
                                                                                {proj.category}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                                                                <Briefcase className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">No previous projects found.</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Upsell Suggestion */}
                                                    {clientHistory.summary.total > 0 && (
                                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Zap className="w-4 h-4 text-[#1F2BF3]" />
                                                                    <p className="text-[10px] font-black text-[#1F2BF3] uppercase tracking-widest">Growth Opportunity</p>
                                                                </div>
                                                                <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                    {clientHistory.summary.completed > 2 
                                                                        ? "High loyalty client. Consider offering a long-term maintenance package."
                                                                        : "Continuing relationship. Suggest complementary services based on previous work."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </DashboardCard>

                                    {/* Quick Insight Card */}
                                    <DashboardCard className="bg-[#1F2BF3] border-none !p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-white/20 rounded-xl text-white">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Quick Insight</h4>
                                        </div>
                                        <p className="text-xs font-medium text-white/80 leading-relaxed">
                                            Reviewing project history helps in setting accurate budgets and deadlines based on past performance with this client.
                                        </p>
                                    </DashboardCard>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
