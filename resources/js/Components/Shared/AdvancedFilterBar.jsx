import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { 
  MagnifyingGlassIcon, 
  CalendarIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';
import { useTranslation } from 'react-i18next';

export default function AdvancedFilterBar({ 
  route: routeName, 
  filters = {}, 
  filterOptions = { years: [], months: [], daysOfWeek: [], periods: [] },
  placeholder = "Search..."
}) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [localFilters, setLocalFilters] = useState({
        period: filters.period || 'all',
        year: filters.year || 'all',
        month: filters.month || 'all',
        week: filters.week || 'all',
        day: filters.day || 'all',
    });

    const handleFilterChange = (name, value) => {
        const newFilters = { ...localFilters, [name]: value };
        // If selecting a specific date part, maybe reset period to 'all' or vice-versa
        if (name === 'period' && value !== 'all') {
            newFilters.year = 'all';
            newFilters.month = 'all';
            newFilters.week = 'all';
            newFilters.day = 'all';
        } else if (['year', 'month', 'week', 'day'].includes(name) && value !== 'all') {
            newFilters.period = 'all';
        }

        setLocalFilters(newFilters);
        applyFilters(newFilters, searchTerm);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters(localFilters, searchTerm);
    };

    const applyFilters = (currentFilters, currentSearch) => {
        router.get(route(routeName), { ...currentFilters, search: currentSearch }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        const cleared = {
            period: 'all',
            year: 'all',
            month: 'all',
            week: 'all',
            day: 'all',
        };
        setLocalFilters(cleared);
        setSearchTerm('');
        router.get(route(routeName), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4 mb-8">
            <DashboardCard className="!p-0 overflow-hidden !bg-white/80 dark:!bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-xl">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40">
                    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <DashboardInput
                                icon={MagnifyingGlassIcon}
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <select 
                                value={localFilters.period} 
                                onChange={(e) => handleFilterChange('period', e.target.value)}
                                className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm transition-all"
                            >
                                {filterOptions.periods.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>

                            <DashboardButton type="submit" variant="primary" className="!px-8 !rounded-2xl">
                                {t('filter_button')}
                            </DashboardButton>
                            
                            <DashboardButton type="button" variant="secondary" onClick={clearFilters} className="!px-6 !rounded-2xl border border-gray-100 dark:border-gray-700">
                                <XMarkIcon className="w-5 h-5" />
                            </DashboardButton>
                        </div>
                    </form>
                </div>
                
                {/* Advanced Row */}
                <div className="p-4 flex flex-wrap gap-4 bg-white/40 dark:bg-gray-900/20">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('year_label')}</span>
                        <select 
                            value={localFilters.year} 
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            className="bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                        >
                            <option value="all">{t('any_year')}</option>
                            {filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('month_label')}</span>
                        <select 
                            value={localFilters.month} 
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                        >
                            <option value="all">{t('any_month')}</option>
                            {filterOptions.months.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('day_of_week_label')}</span>
                        <select 
                            value={localFilters.day} 
                            onChange={(e) => handleFilterChange('day', e.target.value)}
                            className="bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                        >
                            <option value="all">{t('any_day')}</option>
                            {filterOptions.daysOfWeek.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t('week_of_year_label')}</span>
                        <select 
                            value={localFilters.week} 
                            onChange={(e) => handleFilterChange('week', e.target.value)}
                            className="bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm"
                        >
                            <option value="all">{t('any_week')}</option>
                            {Array.from({length: 53}, (_, i) => i + 1).map(w => (
                                <option key={w} value={w}>{t('week_n', { n: w })}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </DashboardCard>
        </div>
    );
}
