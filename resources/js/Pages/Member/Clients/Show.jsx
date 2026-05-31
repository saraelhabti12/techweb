import React, { useState, useMemo } from 'react';
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
    Play,
    Search,
    Filter,
    ArrowUpRight,
    Clock,
    Layout as LayoutIcon
} from 'lucide-react';
import AiSummary from '@/Components/AiSummary';
import ProjectDetailModal from '@/Components/Admin/ProjectDetailModal';

export default function Show({ auth, client, quotations = [], invoices = [], financials = {}, projects = [], appointments = [] }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'project_manager';
    const PageLayout = isAdmin ? AdminLayout : MemberLayout;
    const editRoute = isAdmin ? 'admin.clients.edit' : 'member.clients.edit';

    const [selectedProject, setSelectedProject] = useState(null);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [projectFilter, setProjectFilter] = useState({
        status: 'all',
        type: 'all',
        search: ''
    });

    const statusColors = {
        interested: 'bg-green-50 text-green-700 border-green-100',
        not_interested: 'bg-red-50 text-red-700 border-red-100',
        pending: 'bg-amber-50 text-amber-700 border-amber-100',
        prospect: 'bg-blue-50 text-[#1F2BF3] border-blue-100',
        client: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    };

    const handleViewProject = (project) => {
        setSelectedProject(project);
        setIsProjectModalOpen(true);
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesStatus = projectFilter.status === 'all' || project.status === projectFilter.status;
            const matchesType = projectFilter.type === 'all' || project.project_type === projectFilter.type;
            const matchesSearch = project.name.toLowerCase().includes(projectFilter.search.toLowerCase());
            return matchesStatus && matchesType && matchesSearch;
        });
    }, [projects, projectFilter]);

    return (
        <PageLayout auth={auth}>
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
                                                        tiktok: Play, 
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
                        <AiSummary client={client} />

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

                        {/* Financialpulse Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <DashboardCard title="Financial Pulse">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Total Revenue</p>
                                            <p className="text-xl font-black text-emerald-600">{financials.total_revenue || 0}DH</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Unpaid Amount</p>
                                            <p className="text-xl font-black text-rose-600">{financials.unpaid_amount || 0}DH</p>
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
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{payment.amount}DH - {payment.payment_method}</p>
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

                        {/* Projects Tracking Section */}
                        <DashboardCard title="Project Lifecycle Tracking">
                            {/* Filtering Bar */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text"
                                        placeholder="Search projects..."
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all"
                                        value={projectFilter.search}
                                        onChange={e => setProjectFilter(prev => ({ ...prev, search: e.target.value }))}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        className="text-xs font-bold bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3]"
                                        value={projectFilter.status}
                                        onChange={e => setProjectFilter(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="paused">Paused</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                    <select 
                                        className="text-xs font-bold bg-white dark:bg-gray-900 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3]"
                                        value={projectFilter.type}
                                        onChange={e => setProjectFilter(prev => ({ ...prev, type: e.target.value }))}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Client Project">Client Project</option>
                                        <option value="Internal (Techweb)">Internal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProjects && filteredProjects.length > 0 ? filteredProjects.map(project => (
                                    <div key={project.id} className="group relative p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-[#1F2BF3]/30 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] text-[8px] font-black uppercase rounded tracking-widest border border-blue-100 dark:border-blue-800">
                                                    {project.category?.name || 'Category'}
                                                </span>
                                                <h5 className="text-base font-black text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors leading-tight">{project.name}</h5>
                                            </div>
                                            <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                                                project.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                                            }`}>
                                                {project.status}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-bold">
                                                <span className="text-gray-400 uppercase tracking-widest">Global Progress</span>
                                                <span className="text-[#1F2BF3]">{project.progress}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] rounded-full transition-all duration-1000"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex -space-x-2">
                                                    {project.members?.slice(0, 3).map((m, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-950 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold overflow-hidden shadow-sm" title={m.name}>
                                                            {m.avatar ? <img src={`/storage/${m.avatar}`} className="w-full h-full object-cover" /> : m.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                    {project.members?.length > 3 && (
                                                        <div className="w-7 h-7 rounded-lg border-2 border-white dark:border-gray-950 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-[8px] font-black text-[#1F2BF3]">
                                                            +{project.members.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <DashboardButton 
                                                    variant="secondary" 
                                                    className="!py-1.5 !px-3 !text-[10px] flex items-center gap-2 group/btn"
                                                    onClick={() => handleViewProject(project)}
                                                >
                                                    Details <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                                </DashboardButton>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-[2.5rem]">
                                        <LayoutIcon className="w-12 h-12 mx-auto text-gray-200 mb-4" />
                                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">No matching projects found</p>
                                    </div>
                                )}
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Upcoming Appointments">
                            <div className="space-y-4">
                                {appointments && appointments.length > 0 ? appointments.map(app => (
                                    <div key={app.id} className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-[#1F2BF3]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] flex items-center justify-center">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-[#1F2BF3] transition-colors">{app.title}</h5>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {new Date(app.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {new Date(app.appointment_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] text-[9px] font-black uppercase rounded-lg tracking-widest">{app.status}</span>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <Calendar className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                                        <p className="text-gray-400 text-sm font-medium italic">No scheduled appointments.</p>
                                    </div>
                                )}
                            </div>
                        </DashboardCard>
                    </div>
                </div>

                <ProjectDetailModal 
                    show={isProjectModalOpen} 
                    onClose={() => setIsProjectModalOpen(false)}
                    project={selectedProject}
                />
            </DashboardPage>
        </PageLayout>
    );
}
