import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import StatusBadge from '@/Components/Shared/StatusBadge';
import { useState } from 'react';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion } from 'framer-motion';

export default function ProjectsIndex({ auth, projects, filters = {} }) {
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

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Project Portfolio"
                description="Manage and monitor all your active and archived projects."
                actions={
                    <Link href={route('admin.projects.create')}>
                        <DashboardButton className="flex items-center gap-2">
                            <PlusIcon className="w-5 h-5" />
                            Create Project
                        </DashboardButton>
                    </Link>
                }
            >
                {/* Search & Filters */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative group">
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by name, category or status..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1F2BF3] dark:text-white transition-all"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select 
                                    value={dateFilters.year} 
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="bg-white dark:bg-gray-800 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                                >
                                    <option value="">Year</option>
                                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                                <DashboardButton variant="secondary" onClick={clearFilters} className="!px-4">
                                    Reset
                                </DashboardButton>
                            </div>
                        </form>
                    </div>
                </DashboardCard>

                {/* Projects Table */}
                <DashboardCard className="!p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Project Info</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Deadline</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {projects.map((project) => (
                                    <motion.tr 
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                                                    {project.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">
                                                    {project.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-400">
                                                {project.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <StatusBadge status={project.status} />
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                <CalendarIcon className="w-4 h-4" />
                                                {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No limit'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.projects.show', project.id)}>
                                                    <button className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] hover:bg-[#1F2BF3] hover:text-white transition-all shadow-sm">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <Link href={route('admin.projects.edit', project.id)}>
                                                    <button className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => confirm("Delete this project?") && router.delete(route('admin.projects.destroy', project.id))}
                                                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
