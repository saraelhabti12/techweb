import React from 'react';
import Modal from '@/Components/Modal';
import DashboardButton from '@/Components/UI/DashboardButton';
import { 
    X, 
    CheckCircle2, 
    Clock, 
    Users, 
    UserCheck, 
    FileText, 
    Calendar, 
    TrendingUp,
    Layout,
    Briefcase,
    MessageSquare,
    AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from '@/Components/Shared/StatusBadge';

const ProjectDetailModal = ({ show, onClose, project }) => {
    if (!project) return null;

    const progressColor = project.progress > 75 ? 'text-emerald-500' : project.progress > 30 ? 'text-[#1F2BF3]' : 'text-amber-500';

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-[2rem] overflow-hidden">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] opacity-10" />
                
                <div className="relative p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 dark:border-blue-800">
                                    {project.category?.name || 'Uncategorized'}
                                </span>
                                <StatusBadge status={project.status} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                                {project.name}
                            </h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <TrendingUp className={`w-5 h-5 mb-2 ${progressColor}`} />
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Progress</p>
                                    <p className={`text-xl font-black ${progressColor}`}>{project.progress}%</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <CheckCircle2 className="w-5 h-5 mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Tasks</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">
                                        {project.tasks?.filter(t => t.status === 'completed').length}/{project.tasks?.length || 0}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <Calendar className="w-5 h-5 mb-2 text-[#1F2BF3]" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Deadline</p>
                                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                                        {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No Limit'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <Briefcase className="w-5 h-5 mb-2 text-purple-500" />
                                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">Type</p>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate">{project.project_type}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                                    <Layout className="w-3.5 h-3.5" /> Project Summary
                                </h4>
                                <div className="p-5 bg-gray-50 dark:bg-gray-800/20 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                                        {project.description || 'No detailed description provided for this project.'}
                                    </p>
                                </div>
                            </div>

                            {/* Tasks & Updates */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Recent Tasks & Milestones
                                </h4>
                                <div className="space-y-3">
                                    {project.tasks && project.tasks.length > 0 ? (
                                        project.tasks.slice(0, 5).map(task => (
                                            <div key={task.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-[#1F2BF3]/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${task.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-[#1F2BF3]'}`}>
                                                        {task.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{task.title}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">{task.user?.name || 'Unassigned'}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                    task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/10 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                            <p className="text-xs text-gray-400 font-bold uppercase italic">No tasks recorded yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar info */}
                        <div className="space-y-8">
                            {/* Project Manager */}
                            <div className="p-5 bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 rounded-3xl border border-[#1F2BF3]/20">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-4">Project Management</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#1F2BF3] flex items-center justify-center text-white font-black text-lg">
                                        {project.project_manager?.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">{project.project_manager?.name || 'Not Assigned'}</p>
                                        <p className="text-[10px] font-bold text-[#1F2BF3] uppercase">Lead Manager</p>
                                    </div>
                                </div>
                            </div>

                            {/* Commercial */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                    <UserCheck className="w-3.5 h-3.5" /> Sales & Commercial
                                </h4>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    {project.commercial_type === 'internal' ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center font-bold">
                                                {project.commercial_internal?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{project.commercial_internal?.name}</p>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Internal Commercial</p>
                                            </div>
                                        </div>
                                    ) : project.commercial_name ? (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">{project.commercial_name}</p>
                                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">External Commercial</p>
                                            <div className="pt-2 flex flex-col gap-1">
                                                <span className="text-[10px] font-medium text-gray-500">{project.commercial_email}</span>
                                                <span className="text-[10px] font-medium text-gray-500">{project.commercial_phone}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase italic text-center">No commercial assigned</p>
                                    )}
                                </div>
                            </div>

                            {/* Team */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                    <Users className="w-3.5 h-3.5" /> Internal Team
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.members && project.members.length > 0 ? project.members.map(member => (
                                        <div key={member.id} className="group relative">
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 font-bold text-gray-600 dark:text-gray-300 overflow-hidden shadow-sm" title={member.name}>
                                                {member.avatar ? (
                                                    <img src={`/storage/${member.avatar}`} className="w-full h-full object-cover" alt="" />
                                                ) : member.name.charAt(0)}
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase italic">No team members assigned</p>
                                    )}
                                </div>
                            </div>

                            {/* Creators */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                                    <UserCheck className="w-3.5 h-3.5" /> Creators
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.creators && project.creators.length > 0 ? project.creators.map(creator => (
                                        <div key={creator.id} className="px-3 py-1.5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-700 dark:text-gray-300 shadow-sm">
                                            {creator.name}
                                        </div>
                                    )) : (
                                        <p className="text-[10px] text-gray-400 font-bold uppercase italic">No creators assigned</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer Actions */}
                    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <DashboardButton 
                            variant="secondary" 
                            onClick={onClose}
                            className="!px-8"
                        >
                            Close
                        </DashboardButton>
                        <a href={route('admin.projects.show', project.id)}>
                            <DashboardButton className="!bg-[#1F2BF3] hover:!bg-[#151db1] !px-8">
                                View Full Dashboard
                            </DashboardButton>
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProjectDetailModal;
