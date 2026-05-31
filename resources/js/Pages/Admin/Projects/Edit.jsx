import React, { useState, useEffect } from 'react';
import { useForm, router, Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, History, ExternalLink, Briefcase, TrendingUp, CheckCircle, Clock, Zap, Users, ShieldCheck, Mail, Phone, Percent, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function EditProject({ project, categories, clients, users, creators = [], commercials = [], auth }) {
    const { data, setData, put, processing, errors } = useForm({
        name: project.name || '',
        description: project.description || '',
        category_id: project.category_id || '',
        project_type: project.project_type || 'Internal (Techweb)',
        client_id: project.client_id || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        status: project.status || 'active',
        project_manager_id: project.project_manager_id || '',
        team_members: project.members ? project.members.map(m => m.id) : [],
        creators: project.creators ? project.creators.map(c => c.id) : [],
        commercial_type: project.commercial_type || 'internal',
        commercial_id: project.commercial_id || '',
        commercial_name: project.commercial_name || '',
        commercial_phone: project.commercial_phone || '',
        commercial_email: project.commercial_email || '',
        commercial_commission: project.commercial_commission || '',
        commercial_notes: project.commercial_notes || '',
    });

    const toggleCreator = (creatorId) => {
        const newCreators = [...data.creators];
        if (newCreators.includes(creatorId)) {
            setData('creators', newCreators.filter(id => id !== creatorId));
        } else {
            setData('creators', [...newCreators, creatorId]);
        }
    };

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

    const toggleTeamMember = (userId) => {
        const newMembers = [...data.team_members];
        if (newMembers.includes(userId)) {
            setData('team_members', newMembers.filter(id => id !== userId));
        } else {
            setData('team_members', [...newMembers, userId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.projects.update', project.id));
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
            <Head title={`Edit Project - ${project.name}`} />
            <DashboardPage 
                title="Edit Project"
                description={`Updating details for project: ${project.name}`}
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
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <Briefcase className="w-4 h-4 text-[#1F2BF3]" />
                                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Basic Information</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Project Name</label>
                                            <input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                placeholder="e.g. Website Redesign"
                                            />
                                            {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="project_type" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Project Type</label>
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
                                            <label htmlFor="client_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Select Client</label>
                                            <div className="flex gap-2">
                                                <select
                                                    id="client_id"
                                                    value={data.client_id}
                                                    onChange={(e) => setData('client_id', e.target.value)}
                                                    className="flex-1 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                >
                                                    <option value="">Choose a client</option>
                                                    {clients.map((client) => (
                                                        <option key={client.id} value={client.id}>{client.name} - {client.phone}</option>
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
                                        <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Description</label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            rows={3}
                                            placeholder="Project goals, scope, and initial notes..."
                                        />
                                        {errors.description && <p className="mt-1 text-sm text-red-500 font-bold">{errors.description}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="category_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Category</label>
                                            <select
                                                id="category_id"
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                ))}
                                            </select>
                                            {errors.category_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.category_id}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
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
                                </div>

                                {/* Management & Team */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <Users className="w-4 h-4 text-[#1F2BF3]" />
                                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Management & Team</h3>
                                    </div>

                                    <div>
                                        <label htmlFor="project_manager_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Project Manager</label>
                                        <select
                                            id="project_manager_id"
                                            value={data.project_manager_id}
                                            onChange={(e) => setData('project_manager_id', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        >
                                            <option value="">Select a manager</option>
                                            {users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.name}</option>
                                            ))}
                                        </select>
                                        {errors.project_manager_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.project_manager_id}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Assigned Team Members</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {users.map((user) => (
                                                <div 
                                                    key={user.id}
                                                    onClick={() => toggleTeamMember(user.id)}
                                                    className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center text-center gap-2 ${
                                                        data.team_members.includes(user.id)
                                                        ? 'bg-[#1F2BF3]/10 border-[#1F2BF3] text-[#1F2BF3]'
                                                        : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-gray-200 dark:hover:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-[10px] uppercase">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="text-[10px] font-bold truncate w-full">{user.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.team_members && <p className="mt-1 text-sm text-red-500 font-bold">{errors.team_members}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Assigned Creators</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {creators.map((creator) => (
                                                <div 
                                                    key={creator.id}
                                                    onClick={() => toggleCreator(creator.id)}
                                                    className={`cursor-pointer p-3 rounded-xl border transition-all flex flex-col items-center text-center gap-2 ${
                                                        data.creators.includes(creator.id)
                                                        ? 'bg-[#1F2BF3]/10 border-[#1F2BF3] text-[#1F2BF3]'
                                                        : 'bg-white dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-gray-200 dark:hover:border-gray-600'
                                                    }`}
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                        {creator.profile_photo ? (
                                                            <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-bold text-[10px] uppercase">
                                                                {creator.display_name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] font-bold truncate w-full">{creator.display_name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.creators && <p className="mt-1 text-sm text-red-500 font-bold">{errors.creators}</p>}
                                    </div>
                                </div>

                                {/* Commercials */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4 text-[#1F2BF3]" />
                                            <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Commercial Details</h3>
                                        </div>
                                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => setData('commercial_type', 'internal')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                                                    data.commercial_type === 'internal'
                                                    ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-sm'
                                                    : 'text-gray-400'
                                                }`}
                                            >
                                                Internal
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('commercial_type', 'external')}
                                                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                                                    data.commercial_type === 'external'
                                                    ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-sm'
                                                    : 'text-gray-400'
                                                }`}
                                            >
                                                External
                                            </button>
                                        </div>
                                    </div>

                                    {data.commercial_type === 'internal' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="commercial_id" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                                    Internal Commercial
                                                </label>
                                                <select
                                                    id="commercial_id"
                                                    value={data.commercial_id}
                                                    onChange={(e) => setData('commercial_id', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                >
                                                    <option value="">Select a commercial</option>
                                                    {commercials.map((commercial) => (
                                                        <option key={commercial.id} value={commercial.id}>{commercial.name}</option>
                                                    ))}
                                                </select>
                                                {errors.commercial_id && <p className="mt-1 text-sm text-red-500 font-bold">{errors.commercial_id}</p>}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3 h-3 text-gray-400" />
                                                        <label htmlFor="commercial_name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                                    </div>
                                                    <input
                                                        id="commercial_name"
                                                        type="text"
                                                        value={data.commercial_name}
                                                        onChange={(e) => setData('commercial_name', e.target.value)}
                                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                        placeholder="Commercial's Name"
                                                    />
                                                    {errors.commercial_name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.commercial_name}</p>}
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-gray-400" />
                                                        <label htmlFor="commercial_phone" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Phone</label>
                                                    </div>
                                                    <input
                                                        id="commercial_phone"
                                                        type="text"
                                                        value={data.commercial_phone}
                                                        onChange={(e) => setData('commercial_phone', e.target.value)}
                                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                        placeholder="Phone Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3 h-3 text-gray-400" />
                                                        <label htmlFor="commercial_email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Email</label>
                                                    </div>
                                                    <input
                                                        id="commercial_email"
                                                        type="email"
                                                        value={data.commercial_email}
                                                        onChange={(e) => setData('commercial_email', e.target.value)}
                                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Common Commercial Fields (Commission & Notes) */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Percent className="w-3 h-3 text-gray-400" />
                                                <label htmlFor="commercial_commission" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Commission (%)</label>
                                            </div>
                                            <input
                                                id="commercial_commission"
                                                type="number"
                                                step="0.01"
                                                value={data.commercial_commission}
                                                onChange={(e) => setData('commercial_commission', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                placeholder="0.00"
                                            />
                                            {errors.commercial_commission && <p className="mt-1 text-sm text-red-500 font-bold">{errors.commercial_commission}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-3 h-3 text-gray-400" />
                                                <label htmlFor="commercial_notes" className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Commercial Notes</label>
                                            </div>
                                            <textarea
                                                id="commercial_notes"
                                                value={data.commercial_notes}
                                                onChange={(e) => setData('commercial_notes', e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                                rows={2}
                                                placeholder="Additional commercial terms or notes..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                                        <Clock className="w-4 h-4 text-[#1F2BF3]" />
                                        <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Timeline</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="start_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Start Date</label>
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
                                            <label htmlFor="end_date" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">End Date</label>
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
                                </div>

                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <DashboardButton 
                                        type="submit" 
                                        disabled={processing} 
                                        className="w-full md:w-auto !px-12"
                                    >
                                        {processing ? 'Updating...' : 'Update Project'}
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
                                                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter italic">{proj.category}</span>
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
