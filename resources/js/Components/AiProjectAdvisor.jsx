import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { 
    SparklesIcon, 
    BeakerIcon, 
    ExclamationTriangleIcon, 
    ClockIcon,
    ChartBarIcon,
    CheckBadgeIcon,
    CpuChipIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function AiProjectAdvisor({ project }) {
    const [loading, setLoading] = useState(false);
    const [aiData, setAiData] = useState(null);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(true);

    useEffect(() => {
        fetchLatestSuggestion();
    }, [project.id]);

    const fetchLatestSuggestion = async () => {
        try {
            const response = await axios.get(route('admin.projects.ai-latest', project.id, false));
            if (response.data) {
                setAiData(response.data);
            }
        } catch (err) {
            console.error('Error fetching AI data:', err);
        }
    };

    const handleAnalyze = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        setLoading(true);
        setError(null);
        
        try {
            console.log('Initiating AI Analysis POST request to:', route('admin.projects.ai-analyze', project.id, false));
            
            const response = await axios({
                method: 'post',
                url: route('admin.projects.ai-analyze', project.id, false),
                data: {}, // Explicitly send empty data for POST
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            setAiData(response.data.suggestion);
        } catch (err) {
            console.error('AI Analysis detailed error:', err);
            const errorMsg = err.response?.data?.error || 'Failed to analyze project';
            const errorDetails = err.response?.data?.details ? ` (Details: ${err.response.data.details})` : '';
            setError(errorMsg + errorDetails);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-purple-500 animate-pulse" />
                    AI Project Advisor
                </h3>
                <div className="flex items-center gap-2">
                    <DashboardButton 
                        size="sm" 
                        variant="secondary"
                        onClick={() => setExpanded(!expanded)}
                    >
                        {expanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                    </DashboardButton>
                    <DashboardButton 
                        size="sm" 
                        onClick={handleAnalyze} 
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-[#1F2BF3] hover:from-purple-700 hover:to-blue-700 text-white border-none"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <CpuChipIcon className="w-4 h-4 animate-spin" />
                                Analyzing...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4" />
                                Generate AI Plan
                            </div>
                        )}
                    </DashboardButton>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <DashboardCard className="bg-gradient-to-br from-white/80 to-purple-50/30 dark:from-gray-800/80 dark:to-purple-900/10 backdrop-blur-xl border-purple-500/20 shadow-xl shadow-purple-500/5 relative overflow-hidden group">
                            {/* Decorative background elements */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700"></div>
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#1F2BF3]/10 rounded-full blur-3xl group-hover:bg-[#1F2BF3]/20 transition-all duration-700"></div>

                            {loading ? (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                                        <SparklesIcon className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-[#1F2BF3] uppercase tracking-widest animate-pulse">Consulting the Digital Oracle</p>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Processing project parameters and risk vectors...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="p-6 text-center space-y-4">
                                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto" />
                                    <p className="text-red-600 font-bold">{error}</p>
                                    <DashboardButton size="sm" onClick={handleAnalyze}>Try Again</DashboardButton>
                                </div>
                            ) : aiData ? (
                                <div className="space-y-8 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Risk Level */}
                                        <div className="bg-white/50 dark:bg-gray-900/40 p-5 rounded-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ExclamationTriangleIcon className={`w-5 h-5 ${aiData.risk_level === 'High' ? 'text-red-500' : aiData.risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Risk Assessment</span>
                                            </div>
                                            <div className={`text-2xl font-black uppercase tracking-tight ${aiData.risk_level === 'High' ? 'text-red-600' : aiData.risk_level === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {aiData.risk_level} Risk
                                            </div>
                                        </div>

                                        {/* Completion Prob */}
                                        <div className="bg-white/50 dark:bg-gray-900/40 p-5 rounded-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <ChartBarIcon className="w-5 h-5 text-purple-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Success Probability</span>
                                            </div>
                                            <div className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                {aiData.raw_ai_output?.completion_probability || 'N/A'}
                                            </div>
                                        </div>

                                        {/* BottleNeck Info */}
                                        <div className="bg-white/50 dark:bg-gray-900/40 p-5 rounded-2xl border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
                                            <div className="flex items-center gap-2 mb-3">
                                                <BeakerIcon className="w-5 h-5 text-blue-500" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Potential Bottleneck</span>
                                            </div>
                                            <div className="text-sm font-bold text-gray-700 dark:text-gray-300 line-clamp-2">
                                                {aiData.raw_ai_output?.bottlenecks || 'None predicted'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendations Section */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                                            <CheckBadgeIcon className="w-4 h-4" />
                                            Strategic Recommendations
                                        </h4>
                                        <div className="bg-white/40 dark:bg-gray-900/30 p-6 rounded-2xl border border-white/40 dark:border-gray-700/30">
                                            <TypewriterText text={aiData.recommendations} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {/* Suggested Tasks */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                                <ChartBarIcon className="w-4 h-4" />
                                                Suggested Roadmap Tasks
                                            </h4>
                                            <div className="space-y-3">
                                                {aiData.suggested_tasks?.map((task, idx) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        key={idx} 
                                                        className="flex items-start gap-4 p-4 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-white/60 dark:border-gray-700/40"
                                                    >
                                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-red-500 shadow-lg shadow-red-500/50' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{task.title}</div>
                                                            <div className="text-xs text-gray-500 font-medium">{task.description}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* AI Timeline */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4" />
                                                Estimated Phase Timeline
                                            </h4>
                                            <div className="space-y-3">
                                                {aiData.ai_timeline?.map((item, idx) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        key={idx} 
                                                        className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/40 rounded-xl border border-white/60 dark:border-gray-700/40"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.phase}</div>
                                                            <div className="text-[10px] text-purple-500 font-black uppercase tracking-widest">Milestone: {item.milestone}</div>
                                                        </div>
                                                        <div className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-xs font-black text-purple-600 uppercase tracking-widest border border-purple-100 dark:border-purple-900/30">
                                                            {item.duration}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 text-center">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI suggestions are generated based on available project parameters and should be reviewed by a human PM.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                                    <SparklesIcon className="w-12 h-12 text-purple-300 dark:text-purple-700" />
                                    <div className="text-center">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest">Ready for Analysis</h4>
                                        <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Generate a comprehensive strategic plan for this project.</p>
                                    </div>
                                    <DashboardButton 
                                        onClick={handleAnalyze}
                                        className="bg-gradient-to-r from-purple-600 to-[#1F2BF3] text-white border-none shadow-lg shadow-purple-500/20"
                                    >
                                        Initiate AI Advisory
                                    </DashboardButton>
                                </div>
                            )}
                        </DashboardCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TypewriterText({ text = '' }) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    const safeText = text || '';

    useEffect(() => {
        setDisplayedText('');
        setIndex(0);
    }, [safeText]);

    useEffect(() => {
        if (index < safeText.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + safeText[index]);
                setIndex(prev => prev + 1);
            }, 10);
            return () => clearTimeout(timeout);
        }
    }, [index, safeText]);

    return (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
            {displayedText}
            {index < safeText.length && <span className="inline-block w-1.5 h-4 bg-purple-500 animate-pulse ml-0.5" />}
        </p>
    );
}
