import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, usePage } from '@inertiajs/react';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { useState, Fragment } from 'react';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  PauseIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ArrowRightCircleIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectsIndex({ auth, activeProjects, inactiveProjects, filters = {} }) {
    const [currentTab, setCurrentTab] = useState('active'); // 'active' or 'inactive'
    const [dateFilters, setDateFilters] = useState({
        year: filters.year || '',
        month: filters.month || '',
        day: filters.day || ''
    });
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...dateFilters, [filterType]: value };
        setDateFilters(newFilters);
        const params = { ...newFilters, search: searchTerm };
        router.get(route('admin.projects.index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.projects.index'), { ...dateFilters, search: searchTerm }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setDateFilters({ year: '', month: '', day: '' });
        setSearchTerm('');
        router.get(route('admin.projects.index'), {}, { preserveState: true, preserveScroll: true });
    };

    const updateStatus = (projectId, status) => {
        router.post(route('admin.projects.updateStatus', projectId), { status }, {
            preserveScroll: true,
            onSuccess: () => {
                // Potential notification here
            }
        });
    };

    const displayedProjects = currentTab === 'active' ? activeProjects : inactiveProjects;

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Projects Management"
                description="Monitor and manage your project portfolio with precision."
                actions={
                    <Link href={route('admin.projects.create')}>
                        <DashboardButton className="flex items-center gap-2 !bg-[#1F2BF3] hover:!bg-[#151db1] !shadow-blue-500/20">
                            <PlusIcon className="w-5 h-5" />
                            New Project
                        </DashboardButton>
                    </Link>
                }
            >
                {/* Search & Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3">
                        <DashboardCard className="!p-0 overflow-hidden !bg-white/80 dark:!bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-2xl shadow-blue-500/5">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                                    <div className="flex-1 relative group">
                                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search projects, clients or categories..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1F2BF3] focus:border-transparent dark:text-white transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <select 
                                            value={dateFilters.year} 
                                            onChange={(e) => handleFilterChange('year', e.target.value)}
                                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                                        >
                                            <option value="">Year</option>
                                            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                        <DashboardButton variant="secondary" onClick={clearFilters} className="!px-6 !rounded-2xl border border-gray-100 dark:border-gray-700">
                                            Reset
                                        </DashboardButton>
                                    </div>
                                </form>
                            </div>
                        </DashboardCard>
                    </div>

                    <div className="flex items-center justify-center p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-inner">
                        <button 
                            onClick={() => setCurrentTab('active')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${currentTab === 'active' ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentTab === 'active' ? 'bg-[#1F2BF3] animate-pulse' : 'bg-gray-400'}`}></span>
                            Active
                            <span className="ml-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[10px] rounded-full">{activeProjects.length}</span>
                        </button>
                        <button 
                            onClick={() => setCurrentTab('inactive')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${currentTab === 'inactive' ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentTab === 'inactive' ? 'bg-[#1F2BF3] animate-pulse' : 'bg-gray-400'}`}></span>
                            Inactive
                            <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-full">{inactiveProjects.length}</span>
                        </button>
                    </div>
                </div>

                {/* Projects Grid/Table */}
                <DashboardCard className="!p-0 overflow-hidden !bg-transparent !border-none !shadow-none">
                    <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 backdrop-blur-sm shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Project & Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Progress</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Team</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Deadline</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                <AnimatePresence mode="popLayout">
                                    {displayedProjects.length > 0 ? (
                                        displayedProjects.map((project) => (
                                            <motion.tr 
                                                key={project.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group relative"
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                                                                {project.name.charAt(0)}
                                                            </div>
                                                            {project.status === 'active' && (
                                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse"></span>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors leading-tight">
                                                                {project.name}
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                                {project.client_name || project.client?.name || 'Internal Techweb'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-full max-w-[120px]">
                                                        <div className="flex justify-between items-center mb-1.5">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{project.progress}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                                            <motion.div 
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${project.progress}%` }}
                                                                transition={{ duration: 1, ease: "easeOut" }}
                                                                className={`h-full rounded-full shadow-sm ${
                                                                    project.progress > 75 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 
                                                                    project.progress > 30 ? 'bg-gradient-to-r from-[#1F2BF3] to-blue-400' : 
                                                                    'bg-gradient-to-r from-amber-500 to-amber-400'
                                                                }`}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex -space-x-2">
                                                        {project.members && project.members.length > 0 ? (
                                                            project.members.slice(0, 3).map((member, i) => (
                                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-600 dark:text-gray-300 overflow-hidden shadow-sm" title={member.name}>
                                                                    {member.avatar ? (
                                                                        <img src={`/storage/${member.avatar}`} className="w-full h-full object-cover" alt="" />
                                                                    ) : member.name.charAt(0)}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                                                                <UserGroupIcon className="w-4 h-4" />
                                                            </div>
                                                        )}
                                                        {project.members && project.members.length > 3 && (
                                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-[#1F2BF3]">
                                                                +{project.members.length - 3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <StatusBadge status={project.status} />
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 w-fit px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                                                        <CalendarIcon className="w-4 h-4 text-[#1F2BF3]" />
                                                        {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No limit'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Status Dropdown */}
                                                        <Menu as="div" className="relative">
                                                            <Menu.Button className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-[#1F2BF3] hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all shadow-sm border border-gray-100 dark:border-gray-700">
                                                                <ArrowPathIcon className="w-4 h-4" />
                                                            </Menu.Button>
                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100 dark:border-gray-700">
                                                                    <div className="py-1">
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'active')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <ArrowPathIcon className="w-4 h-4 text-emerald-500" /> Reactivate
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'completed')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3 border-t border-gray-50 dark:border-gray-700`}>
                                                                                    <CheckCircleIcon className="w-4 h-4 text-blue-500" /> Mark Completed
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'paused')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <PauseIcon className="w-4 h-4 text-amber-500" /> Pause Project
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'cancelled')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <XCircleIcon className="w-4 h-4 text-red-500" /> Cancel Project
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'archived')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <ArchiveBoxIcon className="w-4 h-4 text-gray-500" /> Archive Project
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                    </div>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>

                                                        <Link href={route('admin.projects.show', project.id)}>
                                                            <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm border border-blue-100 dark:border-blue-900/50">
                                                                <EyeIcon className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <Link href={route('admin.projects.edit', project.id)}>
                                                            <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100 dark:border-emerald-900/50">
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                        </Link>
                                                        <button 
                                                            onClick={() => confirm("Are you sure you want to delete this project? This action cannot be undone.") && router.delete(route('admin.projects.destroy', project.id))}
                                                            className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100 dark:border-red-900/50"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-4">
                                                        <MagnifyingGlassIcon className="w-10 h-10 text-gray-300" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No {currentTab} projects found</h3>
                                                    <p className="text-sm text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                                                    {searchTerm && (
                                                        <DashboardButton variant="secondary" onClick={clearFilters} className="mt-6">
                                                            Clear Search
                                                        </DashboardButton>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
