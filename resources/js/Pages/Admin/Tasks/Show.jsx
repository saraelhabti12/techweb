import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarDaysIcon, CheckCircleIcon, UserGroupIcon, DocumentArrowDownIcon, FolderOpenIcon, BuildingOfficeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Show({ task, auth }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'todo': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'blocked': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Task: ${task.title}`} />
            <DashboardPage 
                title="Task Details"
                description="View task status, project context, and assigned members."
                actions={
                    <div className="flex gap-2">
                        <Link href={route('admin.tasks.edit', task.id)}>
                            <DashboardButton variant="secondary" className="text-sm">Edit Task</DashboardButton>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Task Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <DashboardCard>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{task.title}</h1>
                                    <div className="flex items-center text-sm text-gray-500 gap-4">
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            Due: {task.due_date || 'N/A'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CalendarDaysIcon className="w-4 h-4 text-red-500" />
                                            Deadline: {task.deadline || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="prose dark:prose-invert max-w-none mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    {task.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] mb-4">Task Team</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Lead Member (if assigned_to is set) */}
                                        {task.user && (
                                            <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/30">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-base font-bold text-white shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/20">
                                                    {task.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{task.user.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black uppercase text-[#1F2BF3] tracking-widest">Team Lead</span>
                                                        <CheckCircleIcon className="w-3 h-3 text-[#1F2BF3]" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Other Members */}
                                        {task.members.filter(m => m.id !== task.assigned_to).map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{member.name}</p>
                                                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{member.role}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {(!task.user && task.members.length === 0) && (
                                            <div className="col-span-2 py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                                <UserGroupIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No members assigned</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Files Section */}
                        <DashboardCard title="Task Attachments">
                            {task.files.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {task.files.map((file) => (
                                        <div key={file.id} className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md">
                                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                {file.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                                    <img src={`/storage/${file.file_path}`} className="object-cover w-full h-full" alt="" />
                                                ) : (
                                                    <DocumentArrowDownIcon className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <p className="text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate" title={file.original_name}>
                                                    {file.original_name}
                                                </p>
                                                <a 
                                                    href={`/storage/${file.file_path}`} 
                                                    target="_blank" 
                                                    className="text-[10px] text-[#1F2BF3] font-black uppercase tracking-widest hover:underline mt-1 block"
                                                >
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                                    <DocumentArrowDownIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">No files attached to this task</p>
                                </div>
                            )}
                        </DashboardCard>
                    </div>

                    {/* Context Sidebar */}
                    <div className="space-y-6">
                        {/* Project Context */}
                        <DashboardCard className="border-l-4 border-[#1F2BF3]">
                            <div className="flex items-center gap-2 mb-4">
                                <FolderOpenIcon className="w-5 h-5 text-[#1F2BF3]" />
                                <h2 className="text-lg font-black text-gray-900 dark:text-white">Project Context</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Project Name</label>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white underline decoration-[#1F2BF3]/30">
                                        {task.project?.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-3 leading-relaxed">{task.project?.description || 'No project description.'}</p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Client Info</label>
                                    </div>

                                    {(task.project?.client || task.project?.client_name) ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                {(task.project?.client?.logo || task.project?.client_logo) ? (
                                                    <img 
                                                        src={`/storage/${task.project?.client?.logo || task.project?.client_logo}`} 
                                                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-gray-100 dark:ring-gray-700"
                                                        alt="Client"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#1F2BF3] font-bold">
                                                        {(task.project?.client?.name || task.project?.client_name || 'C').charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {task.project?.client?.name || task.project?.client_name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                                                        {task.project?.client?.company_name || 'Individual'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 pt-2">
                                                {(task.project?.client?.email || task.project?.client_email) && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                        <EnvelopeIcon className="w-3.5 h-3.5" />
                                                        <span className="truncate">{task.project?.client?.email || task.project?.client_email}</span>
                                                    </div>
                                                )}
                                                {(task.project?.client?.phone || task.project?.client_phone) && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                        <PhoneIcon className="w-3.5 h-3.5" />
                                                        <span>{task.project?.client?.phone || task.project?.client_phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">No client assigned to this project</p>
                                    )}
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Quick Stats/Progress Card */}
                        <DashboardCard>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Task Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Updates</span>
                                    <span className="text-sm font-black text-[#1F2BF3]">{task.progress_updates?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Files</span>
                                    <span className="text-sm font-black text-[#1F2BF3]">{task.files?.length || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 font-bold uppercase">Team Size</span>
                                    <span className="text-sm font-black text-[#1F2BF3]">{task.members?.length || 0}</span>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}

