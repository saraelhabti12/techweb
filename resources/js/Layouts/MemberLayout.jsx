import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '@/Components/NotificationDropdown';
import HistoryDropdown from '@/Components/HistoryDropdown';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { 
    LayoutDashboard, 
    Users, 
    CalendarCheck, 
    CheckSquare, 
    TrendingUp, 
    Clock, 
    MessageSquare,
    Folder,
    LogOut,
    ChevronDown,
    QrCode,
    X,
    CheckCircle2,
    AlertCircle,
    Menu,
    Banknote
} from 'lucide-react';

import Avatar from '@/Components/UI/Avatar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import axios from 'axios';
import CustomCursor from "@/Components/UI/CustomCursor";

import ProfileDropdown from '@/Components/Admin/ProfileDropdown';

export default function MemberLayout({ auth, children, mainClassName = "", contentClassName = "p-6 sm:p-8" }) {
    const [teamHubOpen, setTeamHubOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { flash } = usePage().props;
    const { t } = useTranslation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    // Heartbeat logic
    useEffect(() => {
        const heartbeat = () => {
            axios.post(route('heartbeat')).catch(err => console.error("Heartbeat failed", err));
        };

        // Initial heartbeat
        heartbeat();

        // Interval every 20 seconds
        const interval = setInterval(heartbeat, 20000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage({ type: 'success', text: flash.success });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        } else if (flash?.error) {
            setToastMessage({ type: 'error', text: flash.error });
            setShowToast(true);
            setTimeout(() => setShowToast(false), 5000);
        }
    }, [flash]);
    
    return (
        <div className="h-screen bg-[#F8FAFC] dark:bg-black flex flex-col font-sans transition-colors duration-500 overflow-hidden">
            <CustomCursor />
            {/* Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div 
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className={`fixed top-6 right-6 z-[100] flex items-center p-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
                        toastMessage.type === 'success' 
                            ? 'bg-green-50/90 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-100 dark:border-green-800' 
                            : 'bg-red-50/90 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-100 dark:border-red-800'
                    }`}>
                        {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                        <span className="font-bold mr-8">{toastMessage.text}</span>
                        <button onClick={() => setShowToast(false)} className="ml-auto p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Navigation Bar */}
            <header className="h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 px-6 lg:px-8 shrink-0">
                <div className="h-full flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleSidebar} 
                            className="hidden md:flex p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] transition-colors border border-gray-100 dark:border-gray-800 mr-2"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        
                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                            className="md:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] transition-colors border border-gray-100 dark:border-gray-800 mr-2"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <Link href="/" className="flex items-center gap-3 group">
                            <ApplicationLogo className="h-10 w-auto group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-100 dark:border-gray-800">
                            <Link
                                href={route('chat.index')}
                                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1F2BF3] transition-all relative group"
                                title="Chat"
                            >
                                <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                {usePage().props.unreadChatCount > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-950">
                                        {usePage().props.unreadChatCount}
                                    </span>
                                )}
                            </Link>

                            <HistoryDropdown />
                            <NotificationDropdown />
                            <LanguageSwitcher />
                            <DarkModeToggle />

                            <Link
                                href="/member/attendance"
                                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1F2BF3] transition-all group"
                                title="Attendance QR"
                            >
                                <QrCode className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            </Link>
                        </div>

                        <ProfileDropdown 
                            user={auth?.user} 
                            profileRoute={route('member.profile')} 
                            logoutRoute={route('logout')} 
                        />
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <motion.aside 
                    initial={false}
                    animate={{ width: sidebarOpen ? 288 : 88 }}
                    className="bg-white dark:bg-[#0A0A0A] border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col z-30 shadow-xl overflow-hidden transition-all duration-300 h-full"
                >
                    <nav className="mt-8 flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                        <NavLink href="/member/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('dashboard')}
                        </NavLink>
                        <NavLink href="/member/clients" icon={<Users className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('my_clients_crm')}
                        </NavLink>
                        <NavLink href="/member/appointments" icon={<CalendarCheck className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('appointments')}
                        </NavLink>
                        <NavLink href="/member/tasks" icon={<CheckSquare className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('my_tasks')}
                        </NavLink>
                        <NavLink href="/member/progress" icon={<TrendingUp className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('progress_updates')}
                        </NavLink>
                        <NavLink href="/member/attendance" icon={<Clock className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('my_attendance')}
                        </NavLink>
                        <NavLink href="/member/salary" icon={<Banknote className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('my_salary')}
                        </NavLink>
                        <NavLink href="/member/leaves" icon={<CalendarCheck className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('my_leaves')}
                        </NavLink>
                        <NavLink href={route('member.shared-files.index')} icon={<Folder className="w-5 h-5" />} sidebarOpen={sidebarOpen}>
                            {t('shared_resources')}
                        </NavLink>

                        {/* TeamHub Dropdown */}
                        <div className="pt-2">
                            <button
                                onClick={() => sidebarOpen && setTeamHubOpen(!teamHubOpen)}
                                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                    teamHubOpen && sidebarOpen ? 'bg-blue-50/50 dark:bg-blue-900/10 text-[#1F2BF3]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <MessageSquare className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${teamHubOpen && sidebarOpen ? 'text-[#1F2BF3]' : ''}`} />
                                    {sidebarOpen && <span className="text-sm font-bold tracking-tight">{t('team_hub')}</span>}
                                </div>
                                {sidebarOpen && <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${teamHubOpen ? 'rotate-180' : ''}`} />}
                            </button>
                            
                            <AnimatePresence>
                                {teamHubOpen && sidebarOpen && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pl-11 mt-1 space-y-1"
                                    >
                                        <Link href="/member/teamhub" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] dark:hover:text-white transition-all hover:translate-x-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                            {t('view_activity')}
                                        </Link>
                                        <Link href={route('chat.index')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] dark:hover:text-white transition-all hover:translate-x-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                            {t('chat')}
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-gray-50 dark:border-gray-800">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {sidebarOpen && <span>{t('logout')}</span>}
                        </Link>
                    </div>
                </motion.aside>

                {/* Main Content Wrapper */}
                <main className={`flex-1 min-w-0 h-full overflow-hidden ${mainClassName} bg-gray-50/50 dark:bg-black relative`}>
                    {/* Ambient Background Glows (Static) */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/5 blur-[120px] rounded-full dark:opacity-20 opacity-10 animate-pulse" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/5 blur-[120px] rounded-full dark:opacity-15 opacity-5" />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="h-full overflow-y-auto custom-scrollbar relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={usePage().url}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className={contentClassName}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-[#0A0A0A] z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b dark:border-gray-800">
                                <Link href="/">
                                    <ApplicationLogo className="h-10 w-auto" />
                                </Link>
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                                    <X className="w-6 h-6 dark:text-white" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                <NavLink href="/member/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('dashboard')}
                                </NavLink>
                                <NavLink href="/member/attendance" icon={<Clock className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('my_attendance')}
                                </NavLink>
                                <NavLink href="/member/salary" icon={<Banknote className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('my_salary')}
                                </NavLink>
                                <NavLink href="/member/leaves" icon={<CalendarCheck className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('my_leaves')}
                                </NavLink>
                                <NavLink href="/member/tasks" icon={<CheckSquare className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('my_tasks')}
                                </NavLink>
                                <NavLink href="/member/progress" icon={<TrendingUp className="w-5 h-5" />} sidebarOpen={true} onClick={() => setMobileMenuOpen(false)}>
                                    {t('progress_updates')}
                                </NavLink>

                                <div className="pt-2">
                                    <button
                                        onClick={() => setTeamHubOpen(!teamHubOpen)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                                            teamHubOpen ? 'bg-blue-50/50 dark:bg-blue-900/10 text-[#1F2BF3]' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageSquare className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${teamHubOpen ? 'text-[#1F2BF3]' : ''}`} />
                                            <span className="text-sm font-bold tracking-tight">{t('team_hub')}</span>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${teamHubOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {teamHubOpen && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-11 mt-1 space-y-1"
                                            >
                                                <Link href="/member/teamhub" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] dark:hover:text-white transition-all hover:translate-x-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                    {t('view_activity')}
                                                </Link>
                                                <Link href={route('chat.index')} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] dark:hover:text-white transition-all hover:translate-x-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                    {t('chat')}
                                                </Link>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all group"
                                >
                                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>{t('logout')}</span>
                                </Link>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

const NavLink = ({ href = "#", icon, children, sidebarOpen, className = "", ...props }) => {
    const { url } = usePage();
    const currentPath = url.split('?')[0];
    const isActive = currentPath === href || (href !== '/member/dashboard' && currentPath.startsWith(href));

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                    ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-lg shadow-blue-500/25' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            } ${className}`}
            {...props}
        >
            <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            {sidebarOpen && (
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                    {children}
                </span>
            )}
            {isActive && (
                <motion.div layoutId="activePillMember" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
            )}
        </Link>
    );
};

    

