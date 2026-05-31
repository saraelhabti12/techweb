import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    SparklesIcon, 
    ArrowPathIcon,
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    ClipboardIcon,
    ClipboardDocumentCheckIcon,
    ClockIcon,
    EnvelopeIcon,
    ChatBubbleLeftRightIcon,
    ListBulletIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function AiTaskAdvisor({ task }) {
    const [loading, setLoading] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [error, setError] = useState(null);
    const [copiedKey, setCopiedKey] = useState(null);
    const [checkedItems, setCheckedItems] = useState({});

    useEffect(() => {
        // Clear state when task changes
        const cached = localStorage.getItem(`techweb_task_ai_${task.id}`);
        if (cached) {
            try {
                setAiData(JSON.parse(cached));
            } catch (e) {
                console.error("Failed to parse cached task AI data", e);
            }
        } else {
            setAiData(null);
        }
        setError(null);
    }, [task.id]);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('tasks.ai-analyze', task.id, false));
            if (response.data.success) {
                const analysis = response.data.analysis;
                setAiData(analysis);
                localStorage.setItem(`techweb_task_ai_${task.id}`, JSON.stringify(analysis));
            } else {
                setError('Failed to analyze task');
            }
        } catch (err) {
            console.error('Error in Task AI Analysis:', err);
            const msg = err.response?.data?.error || err.response?.data?.details || 'Failed to connect to AI service';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const handleToggleCheck = (index) => {
        setCheckedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <DashboardCard className="bg-gradient-to-br from-white/95 to-slate-50/90 dark:from-gray-900/95 dark:to-slate-900/90 backdrop-blur-xl border border-indigo-500/10 shadow-2xl relative overflow-hidden group rounded-[2rem]">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/15 transition-all duration-1000"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800/80 relative z-10">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-indigo-500 animate-pulse" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">
                        AI Task Assistant
                    </h3>
                </div>
                <DashboardButton 
                    size="sm"
                    onClick={handleAnalyze} 
                    disabled={loading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-none shadow-md shadow-indigo-500/10 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"
                >
                    {loading ? (
                        <>
                            <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                            Consulting AI...
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-3.5 h-3.5" />
                            {aiData ? 'Recalculate Plan' : 'Ask AI'}
                        </>
                    )}
                </DashboardButton>
            </div>

            {/* Content Body */}
            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex flex-col items-center justify-center space-y-3 relative z-10"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
                            <SparklesIcon className="w-5 h-5 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest animate-pulse">Analyzing task specs...</p>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Formulating micro-tasks & drafts</p>
                        </div>
                    </motion.div>
                ) : error ? (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-8 text-center space-y-3 relative z-10"
                    >
                        <ExclamationTriangleIcon className="w-10 h-10 text-rose-500 mx-auto" />
                        <div>
                            <p className="text-rose-600 text-xs font-black uppercase tracking-wider">Assistant Offline</p>
                            <p className="text-[11px] text-gray-500 font-semibold">{error}</p>
                        </div>
                        <DashboardButton size="sm" className="text-[10px] px-3 py-1" onClick={handleAnalyze}>Try Again</DashboardButton>
                    </motion.div>
                ) : aiData ? (
                    <motion.div 
                        key="results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="pt-4 space-y-6 relative z-10"
                    >
                        {/* Summary & Completion Time */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Summary Card */}
                            <div className="md:col-span-2 bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <DocumentTextIcon className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Task Summary</span>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-1 leading-relaxed">{aiData.summary}</p>
                                </div>
                            </div>
                            {/* Completion time */}
                            <div className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex items-start gap-3">
                                <ClockIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                <div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Completion Time</span>
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mt-1">{aiData.estimated_completion_time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Checklist & Next Steps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Checklist */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                                    <CheckBadgeIcon className="w-4 h-4" />
                                    Sub-Task Checklist
                                </h4>
                                <div className="space-y-2 bg-white/30 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60">
                                    {aiData.checklist?.map((item, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => handleToggleCheck(idx)}
                                            className="flex items-start gap-3 cursor-pointer group"
                                        >
                                            <input 
                                                type="checkbox" 
                                                checked={!!checkedItems[idx]}
                                                onChange={() => {}} // Controlled by parent div click
                                                className="mt-0.5 rounded border-gray-300 dark:border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                            <span className={`text-xs font-semibold select-none transition-colors ${
                                                checkedItems[idx] 
                                                    ? 'line-through text-gray-400 dark:text-gray-500' 
                                                    : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
                                            }`}>
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1.5">
                                    <ListBulletIcon className="w-4 h-4" />
                                    Next Action Steps
                                </h4>
                                <div className="space-y-2 bg-white/30 dark:bg-gray-900/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60">
                                    {aiData.next_steps?.map((step, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></div>
                                            <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Communication Drafts */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                                <EnvelopeIcon className="w-4 h-4" />
                                Communication Draft Templates
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Client Email */}
                                <div className="bg-white/40 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex flex-col justify-between space-y-3 relative group/card">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">External Client Email</span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-wrap max-h-32 overflow-y-auto">
                                            {aiData.communication_drafts?.client_email}
                                        </p>
                                    </div>
                                    <DashboardButton 
                                        size="sm" 
                                        variant="secondary"
                                        onClick={() => handleCopy(aiData.communication_drafts?.client_email, 'email')}
                                        className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-full justify-center"
                                    >
                                        {copiedKey === 'email' ? (
                                            <>
                                                <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardIcon className="w-3.5 h-3.5" />
                                                Copy Email Draft
                                            </>
                                        )}
                                    </DashboardButton>
                                </div>

                                {/* Slack message */}
                                <div className="bg-white/40 dark:bg-gray-900/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800/60 flex flex-col justify-between space-y-3 relative group/card">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Internal Slack Update</span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-semibold whitespace-pre-wrap max-h-32 overflow-y-auto">
                                            {aiData.communication_drafts?.internal_slack}
                                        </p>
                                    </div>
                                    <DashboardButton 
                                        size="sm" 
                                        variant="secondary"
                                        onClick={() => handleCopy(aiData.communication_drafts?.internal_slack, 'slack')}
                                        className="text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-full justify-center"
                                    >
                                        {copiedKey === 'slack' ? (
                                            <>
                                                <ClipboardDocumentCheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <ClipboardIcon className="w-3.5 h-3.5" />
                                                Copy Slack Draft
                                            </>
                                        )}
                                    </DashboardButton>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="intro"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-10 flex flex-col items-center justify-center space-y-4 relative z-10"
                    >
                        <SparklesIcon className="w-10 h-10 text-indigo-300 dark:text-indigo-700 animate-bounce" />
                        <div className="text-center space-y-1">
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Task Assistant Ready</h4>
                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">Generate sub-tasks, completion estimates, next actions, and updates.</p>
                        </div>
                        <DashboardButton 
                            onClick={handleAnalyze}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-md shadow-indigo-500/10 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse"
                        >
                            Initiate Advisor
                        </DashboardButton>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardCard>
    );
}
