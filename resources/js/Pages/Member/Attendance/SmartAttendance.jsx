import React, { useState, useEffect } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Clock, CheckCircle2, History, ShieldCheck, Zap } from 'lucide-react';

export default function SmartAttendance({ auth, todayAttendance }) {
    const [qr, setQr] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!todayAttendance) {
            fetchQr();
        } else {
            setLoading(false);
        }
    }, [todayAttendance]);

    const fetchQr = async () => {
        try {
            setLoading(true);
            const res = await fetch(route('member.attendance.qr'));
            const data = await res.json();
            if (data.qr) {
                setQr(data.qr);
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError("Failed to load QR code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="Smart Attendance" />

            <DashboardPage 
                title="Smart Attendance"
                description="Mark your presence by scanning the secure dynamic QR code at the entrance."
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* QR Section */}
                    <div className="lg:col-span-8">
                        <DashboardCard className="relative overflow-hidden group min-h-[500px] flex flex-col items-center justify-center border-none shadow-2xl shadow-blue-500/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2BF3]/5 to-[#00D8C0]/5 opacity-50" />
                            
                            <div className="relative z-10 w-full max-w-sm text-center">
                                <AnimatePresence mode="wait">
                                    {todayAttendance ? (
                                        <motion.div 
                                            key="success"
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="flex flex-col items-center space-y-6"
                                        >
                                            <div className="w-32 h-32 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 shadow-xl shadow-emerald-500/20">
                                                <CheckCircle2 className="w-16 h-16" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Present Today</h3>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">Your attendance has been recorded successfully.</p>
                                            </div>
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                                                <span className="text-sm font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Logged at {new Date(todayAttendance.marked_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="qr"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="flex flex-col items-center space-y-8"
                                        >
                                            <div className="p-8 bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-[0.03] transition-opacity" />
                                                
                                                {loading ? (
                                                    <div className="w-64 h-64 flex items-center justify-center">
                                                        <div className="w-12 h-12 border-4 border-[#1F2BF3] border-t-transparent rounded-full animate-spin" />
                                                    </div>
                                                ) : qr ? (
                                                    <img src={`data:image/png;base64,${qr}`} alt="Attendance QR" className="w-64 h-64 dark:invert" />
                                                ) : (
                                                    <div className="w-64 h-64 flex items-center justify-center text-red-500 font-bold">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1F2BF3] to-transparent animate-pulse" />
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00D8C0] to-transparent animate-pulse" />
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-center gap-2 text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    <ShieldCheck className="w-4 h-4 text-[#1F2BF3]" />
                                                    Secure Dynamic Pass
                                                </div>
                                                <p className="text-xs text-gray-500 max-w-[200px] mx-auto font-medium leading-relaxed">
                                                    This QR code updates automatically and is for your use only.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* Sidebar Info */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Status Card */}
                        <DashboardCard className="border-none shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Current Status</h4>
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                                    todayAttendance 
                                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 shadow-gray-500/10'
                                }`}>
                                    <Zap className="w-7 h-7" />
                                </div>
                                <div>
                                    <div className={`text-xl font-black uppercase tracking-tight ${todayAttendance ? 'text-emerald-500' : 'text-gray-400'}`}>
                                        {todayAttendance ? 'Present Today' : 'Available'}
                                    </div>
                                    <div className="text-xs font-bold text-gray-500 mt-0.5">
                                        Last scan: {auth.user.last_attendance_at || 'Never'}
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>

                        {/* History Card */}
                        <DashboardCard className="border-none shadow-xl bg-[#1F2BF3] text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <History className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-black uppercase tracking-widest">Recent Logs</h4>
                            </div>
                            
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed font-medium">
                                Keep track of your consistent presence and studio activity.
                            </p>

                            <Link href={route('member.myAttendance')}>
                                <DashboardButton className="w-full bg-white text-[#1F2BF3] hover:bg-blue-50 border-none font-black uppercase tracking-widest py-4 text-xs">
                                    Full History
                                </DashboardButton>
                            </Link>
                        </DashboardCard>

                        {/* Tip Card */}
                        <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                            <div className="flex gap-4">
                                <div className="text-amber-500 shrink-0">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-tight">Pro Tip</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                                        Make sure to scan your QR code before 10:00 AM to maintain your performance streak!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}
