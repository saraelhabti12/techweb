import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, 
    TrendingUp, 
    TrendingDown, 
    Minus, 
    Calendar, 
    ArrowRight, 
    Loader2,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardCard from '@/Components/UI/DashboardCard';

const AiSummary = ({ client }) => {
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    const fetchAiSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(route('clients.ai-analyze', client.id, false));
            setSummary(response.data);
        } catch (err) {
            console.error('AI Analysis failed:', err);
            const errorMsg = err.response?.data?.error || 'Failed to generate AI summary';
            const errorDetails = err.response?.data?.details ? ` (Details: ${err.response.data.details})` : '';
            setError(errorMsg + errorDetails);
        } finally {
            setLoading(false);
        }
    };

    const getScoreBadge = (score = '') => {
        const normalizedScore = score?.toLowerCase();
        const styles = {
            hot: 'bg-red-50 text-red-700 border-red-100 ring-red-500/10',
            warm: 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-500/10',
            cold: 'bg-blue-50 text-blue-700 border-blue-100 ring-blue-500/10',
        };
        const Icon = normalizedScore === 'hot' ? TrendingUp : (normalizedScore === 'cold' ? TrendingDown : Minus);
        
        return (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles[normalizedScore] || styles.cold}`}>
                <Icon className="w-3 h-3" />
                {normalizedScore} Lead
            </div>
        );
    };

    return (
        <DashboardCard 
            title={
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500/20" />
                    <span>AI Client Assistant</span>
                </div>
            }
            actions={
                <button 
                    onClick={fetchAiSummary}
                    disabled={loading}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-500 disabled:opacity-50"
                    title="Refresh AI Analysis"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            }
        >
            <AnimatePresence mode="wait">
                {!summary && !loading && !error && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="py-8 text-center"
                    >
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-[#1F2BF3]" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Ready for Analysis</h4>
                        <p className="text-xs text-gray-400 max-w-[240px] mx-auto mb-6 uppercase font-black tracking-widest leading-relaxed">
                            Let AI analyze notes, contacts, and activity to give you strategic insights.
                        </p>
                        <button 
                            onClick={fetchAiSummary}
                            className="bg-[#1F2BF3] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
                        >
                            Generate Insight
                        </button>
                    </motion.div>
                )}

                {loading && (
                    <motion.div 
                        key="loading"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="py-12 text-center"
                    >
                        <Loader2 className="w-10 h-10 text-[#1F2BF3] animate-spin mx-auto mb-4" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Analyzing relationship data...</p>
                    </motion.div>
                )}

                {error && (
                    <motion.div 
                        key="error"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl flex gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-red-800 dark:text-red-400">Analysis Error</p>
                            <p className="text-[10px] text-red-600 dark:text-red-500 mt-1 uppercase font-black">{error}</p>
                        </div>
                    </motion.div>
                )}

                {summary && !loading && (
                    <motion.div 
                        key="summary"
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            {getScoreBadge(summary.lead_score)}
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-medium italic">
                                "{summary.summary}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <ArrowRight className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Next Step</span>
                                </div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white leading-relaxed">
                                    {summary.suggested_action}
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/50 dark:border-purple-800/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-purple-600" />
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Target Date</span>
                                </div>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                    {summary.recommended_follow_up}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardCard>
    );
};

export default AiSummary;
