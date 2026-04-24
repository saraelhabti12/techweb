import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CalendarIcon, 
    FunnelIcon, 
    ChevronDownIcon, 
    XMarkIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { router } from '@inertiajs/react';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';

export default function DashboardFilter({ filters = {}, filterOptions = {} }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const dropdownRef = useRef(null);

    // Local state for selected filters
    const [localFilters, setLocalFilters] = useState({
        period: filters.period || 'all',
        year: filters.year || new Date().getFullYear(),
        month: filters.month || 'all',
        day: filters.day || 'all',
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleQuickFilter = (period) => {
        const newFilters = { 
            ...localFilters, 
            period,
            year: 'all',
            month: 'all',
            day: 'all',
            start_date: '',
            end_date: ''
        };
        setLocalFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (appliedFilters = localFilters) => {
        router.get(route('admin.dashboard'), { ...appliedFilters, search: searchTerm }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setIsOpen(false)
        });
    };

    const resetFilters = () => {
        const reset = {
            period: 'all',
            year: new Date().getFullYear(),
            month: 'all',
            day: 'all',
            start_date: '',
            end_date: '',
        };
        setLocalFilters(reset);
        setSearchTerm('');
        router.get(route('admin.dashboard'), {}, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setIsOpen(false)
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const quickFilters = [
        { id: 'today', name: 'Today' },
        { id: 'this_week', name: 'This Week' },
        { id: 'this_month', name: 'This Month' },
        { id: 'this_year', name: 'This Year' },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-2xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-[#1F2BF3] focus:border-transparent transition-all font-bold text-sm shadow-sm"
                />
            </form>

            {/* Filter Button & Popover */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-sm border ${
                        isOpen 
                        ? 'bg-[#1F2BF3] text-white border-[#1F2BF3]' 
                        : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-[#1F2BF3]/50'
                    }`}
                >
                    <FunnelIcon className="w-5 h-5" />
                    Filter
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className="absolute right-0 mt-3 w-[320px] sm:w-[400px] bg-white/90 dark:bg-gray-900/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-800 z-50 overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                {/* Quick Filters */}
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Quick Filters</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {quickFilters.map((q) => (
                                            <button
                                                key={q.id}
                                                onClick={() => handleQuickFilter(q.id)}
                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                                    localFilters.period === q.id
                                                    ? 'bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {q.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-800 mx-1"></div>

                                {/* Custom Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block">Custom Selection</label>
                                    
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="space-y-1.5 col-span-1">
                                            <span className="text-[9px] font-bold text-gray-500 ml-1">Year</span>
                                            <select 
                                                value={localFilters.year}
                                                onChange={(e) => setLocalFilters({...localFilters, year: e.target.value, period: 'all', start_date: ''})}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[11px] font-bold px-2 py-2.5 focus:ring-2 focus:ring-[#1F2BF3] appearance-none"
                                            >
                                                <option value="all">All</option>
                                                {filterOptions.years?.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 col-span-1">
                                            <span className="text-[9px] font-bold text-gray-500 ml-1">Month</span>
                                            <select 
                                                value={localFilters.month}
                                                onChange={(e) => setLocalFilters({...localFilters, month: e.target.value, period: 'all', start_date: ''})}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[11px] font-bold px-2 py-2.5 focus:ring-2 focus:ring-[#1F2BF3] appearance-none"
                                            >
                                                <option value="all">All</option>
                                                {filterOptions.months?.map(m => <option key={m.id} value={m.id}>{m.name.substring(0, 3)}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5 col-span-1">
                                            <span className="text-[9px] font-bold text-gray-500 ml-1">Day</span>
                                            <select 
                                                value={localFilters.day}
                                                onChange={(e) => setLocalFilters({...localFilters, day: e.target.value, period: 'all', start_date: ''})}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-[11px] font-bold px-2 py-2.5 focus:ring-2 focus:ring-[#1F2BF3] appearance-none"
                                            >
                                                <option value="all">All</option>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d.substring(0, 3)}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <span className="text-[9px] font-bold text-gray-500 ml-1">Or Specific Date</span>
                                        <div className="relative group">
                                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                                            <input 
                                                type="date"
                                                value={localFilters.start_date}
                                                onChange={(e) => setLocalFilters({...localFilters, start_date: e.target.value, period: 'custom', year: 'all', month: 'all', day: 'all'})}
                                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-[#1F2BF3]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => applyFilters()}
                                        className="flex-1 bg-[#1F2BF3] text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                                    >
                                        Apply Filter
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="px-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                                    >
                                        <ArrowPathIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
