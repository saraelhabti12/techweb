import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import { 
    Banknote, 
    Download, 
    Calendar, 
    TrendingUp, 
    ArrowDownCircle, 
    ArrowUpCircle,
    History,
    FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SalaryIndex({ auth, salaries, nextPaymentDate }) {
    const latestSalary = salaries[0] || null;

    return (
        <MemberLayout auth={auth}>
            <Head title="My Salary" />

            <DashboardPage 
                title="My Salary & Financials" 
                description="Track your earnings, deductions, and payment history."
            >
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#1F2BF3] to-[#7C3AED] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Banknote size={120} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-2">Current Monthly Base</p>
                            <h3 className="text-4xl font-black tracking-tighter mb-6">
                                {auth.user.base_salary ? `${Number(auth.user.base_salary).toLocaleString()} DH` : 'N/A'}
                            </h3>
                            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl p-3 inline-flex">
                                <Calendar className="w-4 h-4 text-blue-200" />
                                <span className="text-xs font-bold text-blue-50">Next: {nextPaymentDate}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <FinancialStat 
                            title="Total Bonuses" 
                            value={latestSalary ? `${Number(latestSalary.bonuses).toLocaleString()} DH` : '0 DH'}
                            icon={<TrendingUp className="w-5 h-5" />}
                            color="text-emerald-500"
                            bg="bg-emerald-50 dark:bg-emerald-900/20"
                            description="From last payment"
                        />
                        <FinancialStat 
                            title="Total Advances" 
                            value={latestSalary ? `${Number(latestSalary.advances).toLocaleString()} DH` : '0 DH'}
                            icon={<ArrowDownCircle className="w-5 h-5" />}
                            color="text-amber-500"
                            bg="bg-amber-50 dark:bg-amber-900/20"
                            description="Outstanding amount"
                        />
                        <FinancialStat 
                            title="Total Deductions" 
                            value={latestSalary ? `${Number(latestSalary.deductions).toLocaleString()} DH` : '0 DH'}
                            icon={<ArrowUpCircle className="w-5 h-5" />}
                            color="text-red-500"
                            bg="bg-red-50 dark:bg-red-900/20"
                            description="Last cycle"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Latest Payment Details */}
                    <div className="lg:col-span-2">
                        <DashboardCard>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-500">
                                        <History className="w-5 h-5" />
                                    </div>
                                    Payment History
                                </h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-gray-100 dark:border-gray-800">
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Month</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Base</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Bonuses</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Net Paid</th>
                                            <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {salaries.map((salary) => (
                                            <tr key={salary.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                                <td className="py-5">
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {new Date(salary.payment_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{Number(salary.base_salary).toLocaleString()} DH</span>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-bold text-emerald-500">+{Number(salary.bonuses).toLocaleString()} DH</span>
                                                </td>
                                                <td className="py-5">
                                                    <span className="text-sm font-black text-[#1F2BF3] dark:text-blue-400">{Number(salary.final_paid).toLocaleString()} DH</span>
                                                </td>
                                                <td className="py-5 text-right">
                                                    <a 
                                                        href={route('member.salary.download-payslip', salary.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-[#1F2BF3] hover:border-[#1F2BF3] transition-all shadow-sm"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        PDF
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                        {salaries.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-12 text-center">
                                                    <p className="text-gray-400 text-sm font-medium italic">No payment records found.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Breakdown & Help */}
                    <div className="space-y-6">
                        <DashboardCard className="!bg-[#1F2BF3]/5 border-[#1F2BF3]/10">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#1F2BF3]" />
                                Latest Breakdown
                            </h4>
                            {latestSalary ? (
                                <div className="space-y-4">
                                    <BreakdownRow label="Base Salary" value={`${Number(latestSalary.base_salary).toLocaleString()} DH`} />
                                    <BreakdownRow label="Bonuses" value={`+${Number(latestSalary.bonuses).toLocaleString()} DH`} color="text-emerald-500" />
                                    <BreakdownRow label="Advances" value={`-${Number(latestSalary.advances).toLocaleString()} DH`} color="text-amber-500" />
                                    <BreakdownRow label="Deductions" value={`-${Number(latestSalary.deductions).toLocaleString()} DH`} color="text-red-500" />
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <span className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Net Paid</span>
                                        <span className="text-lg font-black text-[#1F2BF3]">{Number(latestSalary.final_paid).toLocaleString()} DH</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 italic">No breakdown available yet.</p>
                            )}
                        </DashboardCard>

                        <DashboardCard>
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Financial Support</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                                If you have questions about your payslip or notice any discrepancies, please contact the HR or Finance department.
                            </p>
                            <button className="w-full py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest transition-all">
                                Request Clarification
                            </button>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}

function FinancialStat({ title, value, icon, color, bg, description }) {
    return (
        <DashboardCard className="relative overflow-hidden group">
            <div className="relative z-10">
                <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h4 className={`text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1`}>{value}</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
            </div>
        </DashboardCard>
    );
}

function BreakdownRow({ label, value, color = "text-gray-600 dark:text-gray-400" }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            <span className={`text-sm font-black ${color}`}>{value}</span>
        </div>
    );
}
