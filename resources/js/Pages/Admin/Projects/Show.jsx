import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import AiProjectAdvisor from '@/Components/AiProjectAdvisor';
import { 
    CalendarIcon, 
    BriefcaseIcon, 
    TagIcon, 
    UserGroupIcon, 
    CheckCircleIcon,
    ClockIcon,
    DocumentIcon,
    ArrowDownTrayIcon,
    UserIcon,
    ShieldCheckIcon,
    PhoneIcon,
    EnvelopeIcon,
    BanknotesIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function Show({ project, auth }) {
    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={project.name}
                description="Detailed overview of project progress, team members, and associated tasks."
                actions={
                    <div className="flex gap-2">
                        <Link href={route('admin.projects.edit', project.id)}>
                            <DashboardButton>Edit Project</DashboardButton>
                        </Link>
                        <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                            Go Back
                        </DashboardButton>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Project Overview Card */}
                    <DashboardCard>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Description</span>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                        {project.description || 'No description provided for this project.'}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Category</span>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <TagIcon className="w-4 h-4 text-[#1F2BF3]" />
                                            {project.category?.name || 'Uncategorized'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</span>
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]">
                                            {project.status}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Start Date</span>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <CalendarIcon className="w-4 h-4 text-[#1F2BF3]" />
                                            {project.start_date || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">End Date</span>
                                        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                                            <CalendarIcon className="w-4 h-4 text-[#1F2BF3]" />
                                            {project.end_date || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Commercial Section */}
                                <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4 text-[#1F2BF3]" />
                                        Commercial Info
                                    </h3>
                                    {project.commercial_type === 'internal' ? (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-3">
                                                    {project.commercial_internal?.photo ? (
                                                        <img src={`/storage/${project.commercial_internal.photo}`} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#1F2BF3]">
                                                            <UserIcon className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Internal Commercial</div>
                                                        <div className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{project.commercial_internal?.name || 'N/A'}</div>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                                                    Commission: {project.commercial_internal?.commission_value || '0'} {project.commercial_internal?.commission_type === 'percentage' ? '%' : 'MAD'}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <EnvelopeIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                    {project.commercial_internal?.email || 'No email'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <PhoneIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                    {project.commercial_internal?.phone || 'No phone'}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">External Commercial</div>
                                                    <div className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{project.commercial_name || 'N/A'}</div>
                                                </div>
                                                <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-amber-100 dark:border-amber-900/30">
                                                    Commission: {project.commercial_commission || '0'}%
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <EnvelopeIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                    {project.commercial_email || 'No email'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <PhoneIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                    {project.commercial_phone || 'No phone'}
                                                </div>
                                            </div>
                                            {project.commercial_notes && (
                                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                        <DocumentTextIcon className="w-3 h-3" />
                                                        Notes
                                                    </div>
                                                    <p className="text-xs text-gray-500 italic leading-relaxed">{project.commercial_notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Project Manager Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-[#1F2BF3]/10 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <ShieldCheckIcon className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#1F2BF3] mb-4 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-4 h-4" />
                                        Project Manager
                                    </h3>
                                    {project.project_manager ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#1F2BF3] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/20">
                                                {project.project_manager.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{project.project_manager.name}</div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{project.project_manager.email}</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No manager assigned</p>
                                    )}
                                </div>

                                {/* Team Members Card */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                        <UserGroupIcon className="w-4 h-4" />
                                        Project Team
                                    </h3>
                                    <div className="space-y-4">
                                        {project.members.map(member => (
                                            <div key={member.id} className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 text-xs font-bold shadow-sm">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{member.role || 'Member'}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {project.members.length === 0 && (
                                            <p className="text-sm text-gray-500 italic">No members assigned yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>

                    {/* AI Project Advisor Section */}
                    <AiProjectAdvisor project={project} />

                    {/* Tasks Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white">Project Tasks</h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-500">
                                {project.tasks.length} Total Tasks
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {project.tasks.map(task => (
                                <DashboardCard key={task.id} className="group hover:border-[#1F2BF3] transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors line-clamp-1">{task.title}</h4>
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest
                                            ${task.status === 'completed' || task.status === 'done' ? 'bg-emerald-50 text-emerald-600' :
                                              task.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                                              task.status === 'blocked' ? 'bg-red-50 text-red-600' :
                                              'bg-gray-50 text-gray-500'}
                                        `}>{task.status.replace('_', ' ')}</span>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 h-10">
                                        {task.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-black uppercase tracking-widest text-gray-400">Assignee</span>
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{task.user?.name || 'Unassigned'}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="font-black uppercase tracking-widest text-gray-400">Deadline</span>
                                            <div className="flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                                                <ClockIcon className="w-3 h-3 text-[#1F2BF3]" />
                                                {task.deadline || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {task.files.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                                            <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Attachments</span>
                                            <div className="flex flex-wrap gap-2">
                                                {task.files.slice(0, 3).map(file => (
                                                    <a
                                                        key={file.id}
                                                        href={`/storage/${file.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group/file"
                                                        title={file.original_name}
                                                    >
                                                        <DocumentIcon className="w-4 h-4 text-gray-400 group-hover/file:text-[#1F2BF3]" />
                                                    </a>
                                                ))}
                                                {task.files.length > 3 && (
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center">+{task.files.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </DashboardCard>
                            ))}
                        </div>
                        
                        {project.tasks.length === 0 && (
                            <DashboardCard className="flex flex-col items-center justify-center py-12 text-center">
                                <BriefcaseIcon className="w-12 h-12 text-gray-200 mb-4" />
                                <h4 className="text-gray-900 dark:text-white font-bold mb-1">No tasks found</h4>
                                <p className="text-sm text-gray-500">There are currently no tasks associated with this project.</p>
                            </DashboardCard>
                        )}
                    </div>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
