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
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function ProjectsIndex({ auth, projects, filters = {} }) {
    const [dateFilters, setDateFilters] = useState({
        year: filters.year || '',
        month: filters.month || '',
        day: filters.day || ''
    });
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [showCalendar, setShowCalendar] = useState(false);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const yearOptions = Array.from({ length: 11 }, (_, i) => {
        const year = currentYear - 5 + i;
        return {
            value: year.toString(),
            label: year.toString(),
            isCurrent: year === currentYear
        };
    });

    const monthOptions = [
        { value: '1', label: 'January', isCurrent: 1 === currentMonth },
        { value: '2', label: 'February', isCurrent: 2 === currentMonth },
        { value: '3', label: 'March', isCurrent: 3 === currentMonth },
        { value: '4', label: 'April', isCurrent: 4 === currentMonth },
        { value: '5', label: 'May', isCurrent: 5 === currentMonth },
        { value: '6', label: 'June', isCurrent: 6 === currentMonth },
        { value: '7', label: 'July', isCurrent: 7 === currentMonth },
        { value: '8', label: 'August', isCurrent: 8 === currentMonth },
        { value: '9', label: 'September', isCurrent: 9 === currentMonth },
        { value: '10', label: 'October', isCurrent: 10 === currentMonth },
        { value: '11', label: 'November', isCurrent: 11 === currentMonth },
        { value: '12', label: 'December', isCurrent: 12 === currentMonth }
    ];

    const generateDayOptions = () => {
        const year = parseInt(dateFilters.year) || currentYear;
        const month = parseInt(dateFilters.month) || currentMonth;
        
        const lastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        
        const dayOptions = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateForDay = new Date(year, month - 1, day);
            const dayName = dateForDay.toLocaleDateString('en-US', { weekday: 'long' });
            const isCurrentDay = year === currentYear && month === currentMonth && day === currentDay;
            
            dayOptions.push({
                value: day.toString(),
                label: `${dayName} ${day}`,
                isCurrent: isCurrentDay
            });
        }
        
        return dayOptions;
    };

    const dayOptions = generateDayOptions();

    const handleFilterChange = (filterType, value) => {
        const newFilters = { ...dateFilters, [filterType]: value };
        setDateFilters(newFilters);
        
        const params = { search: searchTerm };
        if (newFilters.year) params.year = newFilters.year;
        if (newFilters.month) params.month = newFilters.month;
        if (newFilters.day) params.day = newFilters.day;
        
        router.get(route('projects.index'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const params = { search: searchTerm };
        if (dateFilters.year) params.year = dateFilters.year;
        if (dateFilters.month) params.month = dateFilters.month;
        if (dateFilters.day) params.day = dateFilters.day;
        
        router.get(route('projects.index'), params, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setDateFilters({ year: '', month: '', day: '' });
        setSearchTerm('');
        router.get(route('projects.index'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };
    return (
        <AdminLayout auth={auth} header="Projects Management">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
            
            <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">All Projects</h2>
                <Link
                    href={route('projects.create')}
                    className="inline-flex items-center px-4 py-2 
               bg-purple-600 border border-transparent rounded-md 
               font-semibold text-xs text-white uppercase tracking-widest 
               hover:bg-purple-700 active:bg-purple-900 
               focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
               disabled:opacity-25 transition 
               dark:bg-purple-700 dark:hover:bg-purple-600"
                >
                    Add New Project
                </Link>
            </div>

            <div className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filter & Search Projects</h3>
                    </div>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-gray-900 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="mb-4">
                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects by name, description, or category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm pl-9
                                            focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 
                                        bg-purple-600 border border-transparent rounded-md 
                                        font-semibold text-xs text-white uppercase tracking-widest 
                                        hover:bg-purple-700 active:bg-purple-900 
                                        focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                        disabled:opacity-25 transition 
                                        dark:bg-purple-700 dark:hover:bg-purple-600"
                        >
                            <MagnifyingGlassIcon className="h-4 w-4" />
                            <span>Search</span>
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Year
                        </label>
                        <select
                            value={dateFilters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Years</option>
                            {yearOptions.map(year => (
                                <option 
                                    key={year.value} 
                                    value={year.value}
                                    className={year.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {year.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Month
                        </label>
                        <select
                            value={dateFilters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Months</option>
                            {monthOptions.map(month => (
                                <option 
                                    key={month.value} 
                                    value={month.value}
                                    className={month.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Day
                        </label>
                        <select
                            value={dateFilters.day}
                            onChange={(e) => handleFilterChange('day', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm 
                                        focus:border-purple-500 focus:ring-purple-500"
                        >
                            <option value="">All Days</option>
                            {dayOptions.map(day => (
                                <option 
                                    key={day.value} 
                                    value={day.value}
                                    className={day.isCurrent ? 'text-purple-600 font-semibold' : ''}
                                >
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {(dateFilters.year || dateFilters.month || dateFilters.day || searchTerm) && (
                    <div className="mt-4 p-3 bg-purple-500 dark:bg-purple-500 rounded-md">
                        <p className="text-sm text-white dark:text-white">
                            <strong>Active Filters:</strong> 
                            {searchTerm && ` Search: "${searchTerm}"`}
                            {dateFilters.year && ` Year: ${dateFilters.year}`}
                            {dateFilters.month && ` Month: ${monthOptions.find(m => m.value === dateFilters.month)?.label}`}
                            {dateFilters.day && ` Day: ${dayOptions.find(d => d.value === dateFilters.day)?.label}`}
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-gray-200 bg-opacity-30 dark:bg-gray-800 dark:bg-opacity-30 rounded-lg p-6">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                Deadline
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-900 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.name}</div>

                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                                    {project.category.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={project.status} />

                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-400">
                                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No deadline'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                                    <Link
                                        href={route('projects.show', project.id)}
                                        className="text-purple-400 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-500 mr-3"
                                        >
                                        Details
                                    </Link>


                                    <Link
                                        href={route('projects.edit', project.id)}
                                        className="text-purple-600 dark:text-purple-600 hover:text-purple-700 dark:hover:text-purple-500 mr-3"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        method="delete"
                                        href={route('projects.destroy', project.id)}
                                        as="button"
                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500"
                                        confirm="Are you sure you want to delete this project?"
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </AdminLayout>
    );
}
