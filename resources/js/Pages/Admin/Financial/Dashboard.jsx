import AdminLayout from '@/Layouts/AdminLayout';
import FinanceAiAdvisor from '@/Components/FinanceAiAdvisor';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  FunnelIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { 
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardPage from '@/Components/UI/DashboardPage';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function FinancialDashboard({ auth, stats, chartData }) {
    const { t } = useTranslation();
    const [exporting, setExporting] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(amount);
    };

    const handleExport = (type, format) => {
        setExporting(true);
        const url = format === 'pdf' ? route('admin.finance.export-pdf') : route('admin.finance.export-excel');
        window.location.href = `${url}?type=${type}`;
        setTimeout(() => setExporting(false), 2000);
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('financial_dashboard')}
                description={t('financial_tracking_desc')}
                actions={
                    <div className="flex items-center gap-3">
                        <div className="flex bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-100 dark:border-gray-700">
                            <button 
                                onClick={() => handleExport('expenses', 'pdf')}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-all group"
                                title={t('export_expenses_pdf')}
                            >
                                <DocumentArrowDownIcon className="w-5 h-5 group-hover:text-red-500" />
                            </button>
                            <button 
                                onClick={() => handleExport('expenses', 'excel')}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-all group"
                                title={t('export_expenses_excel')}
                            >
                                <TableCellsIcon className="w-5 h-5 group-hover:text-emerald-500" />
                            </button>
                        </div>
                    </div>
                }
            >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title={t('monthly_revenue')}
                        value={formatCurrency(stats.monthlyIncome)}
                        icon={<CurrencyDollarIcon className="w-6 h-6" />}
                        gradient="from-emerald-500 to-teal-600"
                    />
                    <StatCard
                        title={t('monthly_expenses')}
                        value={formatCurrency(stats.monthlyExpenses + stats.monthlySalaries)}
                        icon={<ArrowTrendingDownIcon className="w-6 h-6" />}
                        gradient="from-rose-500 to-pink-600"
                    />
                    <StatCard
                        title={t('monthly_profit')}
                        value={formatCurrency(stats.monthlyProfit)}
                        icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
                        gradient="from-indigo-500 to-blue-600"
                        trend={stats.monthlyProfit >= 0 ? 'up' : 'down'}
                    />
                    <StatCard
                        title={t('unpaid_invoices')}
                        value={formatCurrency(stats.unpaidInvoices)}
                        icon={<BanknotesIcon className="w-6 h-6" />}
                        gradient="from-amber-500 to-orange-600"
                    />
                </div>

                <FinanceAiAdvisor />

                {/* Quick Navigation (Expenses + Salaries Section) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <NavCard title={t('expenses')} href={route('admin.expenses.index')} color="bg-rose-500" icon={<ArrowTrendingDownIcon className="w-6 h-6" />} />
                    <NavCard title={t('categories')} href={route('admin.expense-categories.index')} color="bg-indigo-500" icon={<FunnelIcon className="w-6 h-6" />} />
                    <NavCard title={t('salaries')} href={route('admin.salaries.index')} color="bg-emerald-500" icon={<UsersIcon className="w-6 h-6" />} />
                    <NavCard title={t('revenues')} href={route('admin.incomes.index')} color="bg-amber-500" icon={<BanknotesIcon className="w-6 h-6" />} />
                </div>

                {/* Main Charts (Analytics) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Revenue vs Expenses */}
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CurrencyDollarIcon className="w-5 h-5 text-indigo-500" />
                                {t('revenue_vs_expenses')}
                            </h3>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Area type="monotone" dataKey="income" name={t('revenue')} stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expenses" name={t('expenses')} stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>

                    {/* Monthly Profit */}
                    <DashboardCard>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
                                {t('monthly_profitability')}
                            </h3>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        formatter={(value) => formatCurrency(value)}
                                    />
                                    <Bar dataKey="profit" name={t('profit')}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#10B981' : '#EF4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon, gradient, trend }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradient}`}></div>
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                        {trend === 'up' ? '+12%' : '-5%'}
                    </span>
                )}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
}

function NavCard({ title, href, color, icon }) {
    const { t } = useTranslation();
    return (
        <Link href={href}>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-all hover:shadow-md group">
                <div className={`p-3 rounded-2xl ${color} text-white group-hover:rotate-6 transition-transform`}>
                    {icon}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('manage_arrow')}</p>
                </div>
            </motion.div>
        </Link>
    );
}
