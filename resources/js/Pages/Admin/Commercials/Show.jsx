import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { Link, Head } from '@inertiajs/react';
import { PhoneIcon, EnvelopeIcon, BriefcaseIcon, UserPlusIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ auth, commercial, clients = [] }) {
    return (
        <AdminLayout auth={auth}>
            <Head title={`Commercial: ${commercial.name}`} />
            <DashboardPage 
                title="Commercial Partner Details"
                description={`Viewing profile and performance for ${commercial.name}`}
                actions={
                    <div className="flex gap-3">
                        <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                            Go Back
                        </DashboardButton>
                        <Link href={route('admin.commercials.edit', commercial.id)}>
                            <DashboardButton className="text-sm">Edit Commercial</DashboardButton>
                        </Link>
                    </div>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <DashboardCard className="text-center overflow-hidden !p-0">
                            <div className="h-24 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]" />
                            <div className="px-6 pb-8 -mt-12">
                                <div className="relative inline-block">
                                    <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                        <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden">
                                            {commercial.photo ? (
                                                <img src={`/storage/${commercial.photo}`} alt={commercial.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1F2BF3]/5 text-[#1F2BF3] flex items-center justify-center font-black text-2xl">
                                                    {commercial.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                        commercial.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                        {commercial.status}
                                    </span>
                                </div>
                                <h2 className="mt-4 text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">{commercial.name}</h2>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Commercial Partner</p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold">{commercial.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-bold truncate">{commercial.email || 'No email'}</span>
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* Member Account Link Status */}
                        <DashboardCard title="Account Linking">
                            {commercial.user ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                            <ShieldCheckIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">Linked to Member</p>
                                            <p className="text-[10px] font-bold text-emerald-600/70 uppercase">UID: {commercial.user.id}</p>
                                        </div>
                                    </div>
                                    <Link href={route('admin.members.show', commercial.user.id)} className="block">
                                        <DashboardButton variant="secondary" className="w-full text-xs">View Member Profile</DashboardButton>
                                    </Link>
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase italic">No linked member account found.</p>
                                    <p className="mt-1 text-[9px] text-gray-400">Match the email with a member to link dashboards.</p>
                                </div>
                            )}
                        </DashboardCard>

                        <DashboardCard title="Commission Logic">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</span>
                                    <span className="px-3 py-1 bg-[#1F2BF3]/5 text-[#1F2BF3] text-[10px] font-black uppercase rounded-lg border border-[#1F2BF3]/10">
                                        {commercial.commission_type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Rate / Value</span>
                                    <span className="text-lg font-black text-gray-900 dark:text-white">
                                        {commercial.commission_value} {commercial.commission_type === 'percentage' ? '%' : 'MAD'}
                                    </span>
                                </div>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Right Column: Results & Projects */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DashboardCard title="Portfolio Value">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] flex items-center justify-center">
                                        <BriefcaseIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{commercial.projects?.length || 0}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Linked Projects</p>
                                    </div>
                                </div>
                            </DashboardCard>
                            <DashboardCard title="Client Conversions">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                                        <UserPlusIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{clients.length}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Confirmed Clients</p>
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>

                        <DashboardCard title="Confirmed Clients" description="Direct clients brought by this commercial partner.">
                            <div className="space-y-4">
                                {clients.length > 0 ? clients.map((client) => (
                                    <div key={client.id} className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group hover:border-[#1F2BF3]/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center font-black">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-900 dark:text-white leading-tight">{client.name}</h5>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{client.company_name || 'Individual'}</p>
                                            </div>
                                        </div>
                                        <Link href={route('admin.clients.show', client.id)}>
                                            <DashboardButton variant="secondary" className="!py-1.5 !text-[10px]">View Dossier</DashboardButton>
                                        </Link>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                                        <UserPlusIcon className="w-10 h-10 mx-auto text-gray-200 mb-2" />
                                        <p className="text-gray-400 text-sm font-medium italic uppercase tracking-widest">No confirmed clients yet.</p>
                                    </div>
                                )}
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Linked Project History">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {commercial.projects?.map((project) => (
                                    <div key={project.id} className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:border-[#1F2BF3]/20 transition-all">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2 py-0.5 bg-blue-50 text-[#1F2BF3] text-[8px] font-black uppercase rounded tracking-widest border border-blue-100">
                                                {project.category?.name || 'Project'}
                                            </span>
                                            <span className={`text-[8px] font-black uppercase ${
                                                project.status === 'active' ? 'text-emerald-500' : 'text-gray-400'
                                            }`}>{project.status}</span>
                                        </div>
                                        <h5 className="text-sm font-black text-gray-900 dark:text-white mb-4 line-clamp-1">{project.name}</h5>
                                        <Link href={route('admin.projects.show', project.id)} className="block">
                                            <DashboardButton variant="secondary" className="w-full !py-2 !text-[10px]">Track Performance</DashboardButton>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Internal Collaboration Notes">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 italic">
                                    {commercial.notes || 'No specific agreement notes or internal documentation recorded for this partner.'}
                                </p>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
