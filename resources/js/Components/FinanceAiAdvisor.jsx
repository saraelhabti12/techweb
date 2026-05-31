import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SparklesIcon, 
    ArrowPathIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BanknotesIcon,
    BriefcaseIcon,
    ShieldExclamationIcon,
    CheckBadgeIcon,
    PresentationChartLineIcon,
    ChartPieIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#3B82F6'];

export default function FinanceAiAdvisor() {
    const [loading, setLoading] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [financeData, setFinanceData] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('summary'); // summary, spending, risks, actions

    useEffect(() => {
        // Look for a cached analysis in localStorage to prevent hitting the API key limit unnecessarily
        const cachedAnalysis = localStorage.getItem('techweb_finance_ai_analysis');
        const cachedRawData = localStorage.getItem('techweb_finance_ai_raw_data');
        if (cachedAnalysis && cachedRawData) {
            try {
                setAiData(JSON.parse(cachedAnalysis));
                setFinanceData(JSON.parse(cachedRawData));
            } catch (e) {
                console.error("Failed to parse cached finance AI data", e);
            }
        }
    }, []);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('admin.finance.ai-analyze', undefined, false));
            if (response.data.success) {
                const analysis = response.data.analysis;
                const rawData = response.data.data;
                
                setAiData(analysis);
                setFinanceData(rawData);
                
                localStorage.setItem('techweb_finance_ai_analysis', JSON.stringify(analysis));
                localStorage.setItem('techweb_finance_ai_raw_data', JSON.stringify(rawData));
            } else {
                setError('Failed to load financial analysis');
            }
        } catch (err) {
            console.error('Error in Finance AI Analysis:', err);
            const msg = err.response?.data?.error || err.response?.data?.details || 'Failed to connect to AI service';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(amount);
    };

    // Prepare chart data for spending categories
    const getPieChartData = () => {
        if (!financeData?.expenses_by_category) return [];
        return financeData.expenses_by_category.map(item => ({
            name: item.category,
            value: parseFloat(item.total)
        }));
    };

    const pieData = getPieChartData();

    return (
        <DashboardCard className="bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-gray-900/95 dark:to-slate-900/90 backdrop-blur-xl border border-indigo-500/10 shadow-2xl relative overflow-hidden group mb-12 rounded-[2.5rem]">
            {/* Ambient Background Glows */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all duration-1000"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/15 transition-all duration-1000"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                        <SparklesIcon className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                            AI Finance Assistant
                            <span className="text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/30 animate-pulse">Gemini 2.5 Active</span>
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Real-time ledger audit, cashflow diagnostics, and predictive recommendations.</p>
                    </div>
                </div>
                <div>
                    <DashboardButton 
                        onClick={handleAnalyze} 
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-lg shadow-indigo-500/20 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                Analyzing Ledger...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-4 h-4" />
                                {aiData ? 'Run Fresh Diagnostic' : 'Initiate AI Diagnostic'}
                            </>
                        )}
                    </DashboardButton>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-16 flex flex-col items-center justify-center space-y-4 relative z-10"
                    >
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-600 rounded-full animate-spin"></div>
                            <SparklesIcon className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 uppercase tracking-widest animate-pulse">Running Financial Audit</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Parsing Invoices, Expenses, Salaries, and Liquid Risk Vectors...</p>
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center space-y-4 relative z-10"
                    >
                        <ExclamationTriangleIcon className="w-16 h-16 text-rose-500 mx-auto" />
                        <div>
                            <p className="text-rose-600 font-black uppercase tracking-wider">Diagnostic Interrupted</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{error}</p>
                        </div>
                        <DashboardButton size="sm" onClick={handleAnalyze}>Try Again</DashboardButton>
                    </motion.div>
                ) : aiData && financeData ? (
                    <motion.div 
                        key="results"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="pt-6 relative z-10"
                    >
                        {/* Summary Widget bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Current Month Net Flow */}
                            <div className="bg-white/50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between shadow-sm">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Net Profit (MAD)</span>
                                    <h3 className={`text-2xl font-black uppercase tracking-tight mt-1 ${financeData.cash_movements_current_month.net_profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {formatCurrency(financeData.cash_movements_current_month.net_profit)}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-xl ${financeData.cash_movements_current_month.net_profit >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {financeData.cash_movements_current_month.net_profit >= 0 ? <ArrowTrendingUpIcon className="w-6 h-6" /> : <ArrowTrendingDownIcon className="w-6 h-6" />}
                                </div>
                            </div>

                            {/* Predicted Profit */}
                            <div className="bg-white/50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between shadow-sm">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Predicted Profit (Gemini)</span>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">
                                        {formatCurrency(aiData.predicted_monthly_profit.amount)}
                                    </h3>
                                </div>
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500">
                                    <SparklesIcon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Confidence Level */}
                            <div className="bg-white/50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center justify-between shadow-sm">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Prediction Confidence</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xl font-black uppercase tracking-wider ${
                                            aiData.predicted_monthly_profit.confidence_level === 'High' ? 'text-emerald-500' : aiData.predicted_monthly_profit.confidence_level === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                                        }`}>
                                            {aiData.predicted_monthly_profit.confidence_level}
                                        </span>
                                    </div>
                                </div>
                                <div className={`p-3 rounded-xl ${
                                    aiData.predicted_monthly_profit.confidence_level === 'High' ? 'bg-emerald-500/10 text-emerald-500' : aiData.predicted_monthly_profit.confidence_level === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                                }`}>
                                    <CheckBadgeIcon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex bg-gray-100 dark:bg-gray-800/60 p-1.5 rounded-2xl mb-8 max-w-lg border border-gray-200/20">
                            {[
                                { id: 'summary', label: 'Summary', icon: <PresentationChartLineIcon className="w-4 h-4" /> },
                                { id: 'spending', label: 'Spending Breakdown', icon: <ChartPieIcon className="w-4 h-4" /> },
                                { id: 'risks', label: 'Risks & Alerts', icon: <ShieldExclamationIcon className="w-4 h-4" /> },
                                { id: 'actions', label: 'AI Actions', icon: <SparklesIcon className="w-4 h-4" /> }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                                        activeTab === tab.id 
                                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                                    }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[280px]">
                            {activeTab === 'summary' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600">Monthly Cashflow Diagnosis</h4>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                                                {aiData.monthly_cashflow_summary}
                                            </p>
                                        </div>
                                        <div className="space-y-2 p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-500/10">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Model Forecast Rationale</span>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed font-semibold italic">
                                                "{aiData.predicted_monthly_profit.rationale}"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-white/60 dark:bg-gray-900/30 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800/80 space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Current Month Cash Movement Ledger</h4>
                                        <div className="space-y-3 font-semibold text-sm">
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-gray-500">Incomes / Payments Received</span>
                                                <span className="text-emerald-500 font-bold">{formatCurrency(financeData.cash_movements_current_month.income_received)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-gray-500">Operating Expenses</span>
                                                <span className="text-rose-500 font-bold">-{formatCurrency(financeData.cash_movements_current_month.expenses_paid)}</span>
                                            </div>
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                                <span className="text-gray-500">Salaries Disbursed</span>
                                                <span className="text-rose-500 font-bold">-{formatCurrency(financeData.cash_movements_current_month.salaries_paid)}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <span className="text-gray-900 dark:text-white font-black uppercase tracking-wider text-xs">Liquid Net Flow</span>
                                                <span className={`font-black ${financeData.cash_movements_current_month.net_profit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {formatCurrency(financeData.cash_movements_current_month.net_profit)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'spending' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                    <div className="h-[250px] w-full relative">
                                        {pieData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        formatter={(value) => formatCurrency(value)}
                                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                                                    />
                                                    <Legend verticalAlign="bottom" height={36}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">No spending categories data</div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                                            <ChartPieIcon className="w-4 h-4" />
                                            Expense Diagnostics
                                        </h4>
                                        <div className="space-y-3">
                                            {aiData.top_spending_categories?.map((cat, idx) => (
                                                <div key={idx} className="p-4 bg-white/60 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-start gap-4 shadow-sm">
                                                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{cat.category}</span>
                                                            <span className="text-xs font-black text-indigo-500">{cat.percentage_of_total}% of Total</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">{cat.recommendation}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'risks' && (
                                <div className="space-y-6">
                                    {/* Risk Alerts */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                            <ShieldExclamationIcon className="w-4 h-4" />
                                            Active Exposure & Payment Risk Vectors
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {aiData.payment_risk_alerts?.map((risk, idx) => (
                                                <div key={idx} className={`p-5 rounded-2xl border flex items-start gap-4 ${
                                                    risk.level === 'Critical' 
                                                        ? 'bg-rose-50/40 dark:bg-rose-950/15 border-rose-500/20 text-rose-600' 
                                                        : risk.level === 'Warning'
                                                            ? 'bg-amber-50/40 dark:bg-amber-950/15 border-amber-500/20 text-amber-600'
                                                            : 'bg-emerald-50/40 dark:bg-emerald-950/15 border-emerald-500/20 text-emerald-600'
                                                }`}>
                                                    <ExclamationTriangleIcon className="w-6 h-6 shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                                                            {risk.title}
                                                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-lg bg-black/5 uppercase tracking-widest">{risk.level}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1 leading-relaxed">{risk.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Unpaid Invoices Alerts */}
                                    {aiData.unpaid_invoices_alerts && aiData.unpaid_invoices_alerts.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                                                <BanknotesIcon className="w-4 h-4" />
                                                High Risk Outstanding Receivables
                                            </h4>
                                            <div className="space-y-2">
                                                {aiData.unpaid_invoices_alerts.map((inv, idx) => (
                                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl gap-4 font-semibold text-xs">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
                                                                !
                                                            </div>
                                                            <div>
                                                                <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{inv.invoice_number} — {inv.client}</div>
                                                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Overdue by <span className="text-rose-500 font-black">{inv.days_overdue} days</span></div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            <div>
                                                                <span className="text-gray-400 uppercase tracking-widest text-[9px] block">Balance</span>
                                                                <span className="font-black text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</span>
                                                            </div>
                                                            <div className="max-w-xs text-right hidden sm:block">
                                                                <span className="text-gray-400 uppercase tracking-widest text-[9px] block">Action Plan</span>
                                                                <span className="text-indigo-500 font-semibold">{inv.action_item}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'actions' && (
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                        <SparklesIcon className="w-4 h-4 text-indigo-500" />
                                        Strategic Financial Actions
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {aiData.financial_recommendations?.map((rec, idx) => (
                                            <div key={idx} className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/5 p-6 rounded-3xl border border-indigo-500/10 flex flex-col justify-between shadow-sm relative group/card">
                                                <div className="absolute top-4 right-4 text-[2.5rem] font-black text-indigo-500/5 select-none font-italic">0{idx + 1}</div>
                                                <div className="relative z-10 space-y-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-black">
                                                        <CheckBadgeIcon className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-sm font-semibold leading-relaxed text-gray-700 dark:text-gray-300">
                                                        {rec}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-16 flex flex-col items-center justify-center space-y-6 relative z-10"
                    >
                        <div className="w-16 h-16 rounded-[2rem] bg-indigo-500/10 text-indigo-500 flex items-center justify-center shadow-lg animate-bounce">
                            <SparklesIcon className="w-8 h-8" />
                        </div>
                        <div className="text-center space-y-2 max-w-md">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Financial Auditor Offline</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                                Initiate a complete ledger diagnosis to analyze your invoice outstanding rates, expenditure categories, cash balance, and monthly net forecasts.
                            </p>
                        </div>
                        <DashboardButton 
                            onClick={handleAnalyze}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg shadow-indigo-500/20 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest animate-pulse"
                        >
                            Initiate Audit
                        </DashboardButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardCard>
    );
}
