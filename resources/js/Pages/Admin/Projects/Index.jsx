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
  ArrowRightCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useConfirm } from '@/Contexts/ConfirmContext';

import AdvancedFilterBar from '@/Components/Shared/AdvancedFilterBar';

export default function ProjectsIndex({ auth, activeProjects, inactiveProjects, filters = {}, filterOptions }) {
    const { t } = useTranslation();
    const confirm = useConfirm();
    const [currentTab, setCurrentTab] = useState('active'); // 'active' or 'inactive'

    const handleDelete = async (id) => {
        const isConfirmed = await confirm({
            title: t('delete_project_title', { defaultValue: 'Supprimer un projet' }),
            message: t('delete_project_confirm', { defaultValue: 'Êtes-vous sûr de vouloir supprimer ce projet ? Tous les fichiers et tâches associés seront également supprimés.' }),
            confirmText: t('delete', { defaultValue: 'Supprimer' }),
            variant: 'danger'
        });

        if (isConfirmed) {
            router.delete(route('admin.projects.destroy', id));
        }
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
                title={t('projects_management')}
                description={t('projects_management_desc')}
                actions={
                    <Link href={route('admin.projects.create')}>
                        <DashboardButton className="flex items-center gap-2 !bg-[#1F2BF3] hover:!bg-[#151db1] !shadow-blue-500/20">
                            <PlusIcon className="w-5 h-5" />
                            {t('add_project')}
                        </DashboardButton>
                    </Link>
                }
            >
                {/* Search & Filters */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3">
                        <AdvancedFilterBar 
                            route="admin.projects.index"
                            filters={filters}
                            filterOptions={filterOptions}
                            placeholder={t('search_projects_placeholder')}
                        />
                    </div>

                    <div className="flex items-center justify-center p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-inner h-fit mt-4">
                        <button 
                            onClick={() => setCurrentTab('active')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${currentTab === 'active' ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentTab === 'active' ? 'bg-[#1F2BF3] animate-pulse' : 'bg-gray-400'}`}></span>
                            {t('active')}
                            <span className="ml-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[10px] rounded-full">{activeProjects.length}</span>
                        </button>
                        <button 
                            onClick={() => setCurrentTab('inactive')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${currentTab === 'inactive' ? 'bg-white dark:bg-gray-700 text-[#1F2BF3] shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/20' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${currentTab === 'inactive' ? 'bg-[#1F2BF3] animate-pulse' : 'bg-gray-400'}`}></span>
                            {t('inactive')}
                            <span className="ml-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] rounded-full">{inactiveProjects.length}</span>
                        </button>
                    </div>
                </div>

                {/* Projects Grid/Table */}
                <DashboardCard className="!p-0 overflow-hidden !bg-transparent !border-none !shadow-none">
                    <div className="overflow-x-auto rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 backdrop-blur-sm shadow-xl">
                        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('project_client')}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('progress')}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('team')}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('status')}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">{t('deadline')}</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">{t('actions')}</th>
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
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors leading-tight">
                                                                    {project.name}
                                                                </div>
                                                                {project.project_manager && (
                                                                    <div 
                                                                        className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-[#1F2BF3] text-[8px] font-black uppercase tracking-tighter border border-blue-100 dark:border-blue-900/50"
                                                                        title={`Manager: ${project.project_manager.name}`}
                                                                    >
                                                                        <ShieldCheckIcon className="w-2.5 h-2.5" />
                                                                        PM: {project.project_manager.name.split(' ')[0]}
                                                                    </div>
                                                                )}
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
                                                        {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : t('no_limit')}
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
                                                                                    <ArrowPathIcon className="w-4 h-4 text-emerald-500" /> {t('reactivate')}
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'completed')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3 border-t border-gray-50 dark:border-gray-700`}>
                                                                                    <CheckCircleIcon className="w-4 h-4 text-blue-500" /> {t('mark_completed')}
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'paused')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <PauseIcon className="w-4 h-4 text-amber-500" /> {t('pause_project')}
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'cancelled')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <XCircleIcon className="w-4 h-4 text-red-500" /> {t('cancel_project')}
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button onClick={() => updateStatus(project.id, 'archived')} className={`${active ? 'bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3]' : 'text-gray-700 dark:text-gray-300'} flex w-full items-center px-4 py-2.5 text-xs font-bold gap-3`}>
                                                                                    <ArchiveBoxIcon className="w-4 h-4 text-gray-500" /> {t('archive_project')}
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
                                                            onClick={() => handleDelete(project.id)}
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
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{t('no_projects_found', { status: currentTab })}</h3>
                                                    <p className="text-sm text-gray-500">{t('adjust_filters_desc')}</p>
                                                    {filters.search && (
                                                        <DashboardButton variant="secondary" onClick={() => router.get(route('admin.projects.index'))} className="mt-6">
                                                            {t('clear_search')}
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
