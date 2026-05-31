import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '@/Components/NotificationDropdown';
import HistoryDropdown from '@/Components/HistoryDropdown';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ProfileDropdown from '@/Components/Admin/ProfileDropdown';
import {
    HomeIcon,
    FolderIcon,
    DocumentTextIcon,
    TagIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
    PlusIcon,
    ListBulletIcon,
    UserIcon,
    CogIcon,
    CalendarIcon,
    UsersIcon,
    ChatBubbleLeftRightIcon,
    Bars3Icon,
    XMarkIcon,
    ShieldExclamationIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    BriefcaseIcon
} from '@heroicons/react/24/outline';

import Avatar from '@/Components/UI/Avatar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import axios from 'axios';
import { 
    XMarkIcon as X, 
    CheckCircleIcon as CheckCircle2, 
    ExclamationTriangleIcon as AlertCircle 
} from '@heroicons/react/24/outline';

export default function AdminLayout({ auth, children, title = '', mainClassName = "", contentClassName = "" }) {
    const { t } = useTranslation();
    const { auth: sharedAuth, unreadChatCount = 0, flash } = usePage().props;
    // Use the most complete auth object available
    const userAuth = auth || sharedAuth;

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', text: '' });
    
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

    const [openMenus, setOpenMenus] = useState({
        projects: false,
        tasks: false,
        appointments: false,
        members: false,
        contacts: false,
        financial: false,
        categories: false,
        blogs: false,
        templates: false,
        teamhub: false,
        creators: false,
        commercials: false
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const hasPermission = (permission) => {
        const user = userAuth?.user;
        if (!user) return false;
        if (user.role === 'admin') return true;
        
        const userPermissions = user.permissions || [];
        const permsArray = Array.isArray(userPermissions) ? userPermissions : Object.values(userPermissions);
        return permsArray.some(p => typeof p === 'string' && p.toLowerCase() === permission.toLowerCase());
    };

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

    return (
        <div className="h-screen bg-[#F8FAFC] dark:bg-black font-sans flex flex-col transition-colors duration-500 overflow-hidden">
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
            <header className="h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 lg:px-8 flex items-center justify-between z-40 shrink-0 sticky top-0">
                <div className="flex items-center gap-4">
                    {/* Desktop Sidebar Toggle */}
                    <button 
                        onClick={toggleSidebar} 
                        className="hidden md:flex p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] transition-colors border border-gray-100 dark:border-gray-800 mr-2"
                    >
                        {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                        className="md:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] transition-colors border border-gray-100 dark:border-gray-800 mr-2"
                    >
                        {mobileMenuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>

                    <Link href="/" className="flex items-center gap-3 group">
                        <ApplicationLogo className="h-10 w-auto group-hover:scale-110 transition-transform" />
                    </Link>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    <div className="flex items-center gap-2 pr-4 border-r border-gray-100 dark:border-gray-800">
                         {hasPermission('view chat') && (
                            <Link
                                href={route('chat.index')}
                                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1F2BF3] transition-all relative group"
                                title="Chat"
                            >
                                <ChatBubbleLeftRightIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                {unreadChatCount > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-950">
                                        {unreadChatCount}
                                    </span>
                                )}
                            </Link>
                         )}
                        {hasPermission('view history') && <HistoryDropdown />}
                        {hasPermission('view notifications') && <NotificationDropdown />}
                        <LanguageSwitcher />
                        <DarkModeToggle />
                    </div>

                    <ProfileDropdown 
                        user={userAuth?.user} 
                        profileRoute={route('admin.profile')} 
                        logoutRoute={route('logout')} 
                    />
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Desktop */}
                <motion.aside
                    initial={false}
                    animate={{ width: sidebarOpen ? 280 : 88 }}
                    className={`hidden md:flex flex-col bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 shadow-xl overflow-hidden h-full`}
                >
                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                        {hasPermission('view dashboard') && (
                            <NavItem 
                                href={route('admin.dashboard')} 
                                icon={<ChartBarIcon className="w-5 h-5" />} 
                                label={t('dashboard')} 
                                active={route().current('admin.dashboard')}
                                sidebarOpen={sidebarOpen}
                            />
                        )}

                        {hasPermission('view roles') && (
                            <NavItem 
                                href={route('admin.roles.index')} 
                                icon={<ShieldExclamationIcon className="w-5 h-5" />} 
                                label={t('roles_permissions')} 
                                active={route().current('admin.roles.*')}
                                sidebarOpen={sidebarOpen}
                            />
                        )}

                        {hasPermission('view projects') && (
                            <NavGroup 
                                label={t('projects')} 
                                icon={<FolderIcon className="w-5 h-5" />} 
                                isOpen={openMenus.projects} 
                                onClick={() => toggleMenu('projects')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.projects.*')}
                                links={[
                                    { label: t('all_projects'), href: route('admin.projects.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                    hasPermission('create projects') && { label: t('add_project'), href: route('admin.projects.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        {hasPermission('view tasks') && (
                            <NavGroup 
                                label={t('tasks')} 
                                icon={<DocumentTextIcon className="w-5 h-5" />} 
                                isOpen={openMenus.tasks} 
                                onClick={() => toggleMenu('tasks')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.tasks.*') || route().current('admin.progress.*')}
                                links={[
                                    { label: t('all_tasks'), href: route('admin.tasks.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                    hasPermission('create tasks') && { label: t('add_task'), href: route('admin.tasks.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                    { label: t('progress_updates'), href: route('admin.progress.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        {hasPermission('view appointments') && (
                            <NavGroup 
                                label={t('appointments')} 
                                icon={<CalendarIcon className="w-5 h-5" />} 
                                isOpen={openMenus.appointments} 
                                onClick={() => toggleMenu('appointments')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.appointments.*')}
                                links={[
                                    { label: t('requests'), href: route('admin.appointments.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                    hasPermission('view calendar') && { label: t('calendar'), href: route('admin.appointments.calendar'), icon: <CalendarIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        {hasPermission('view members') && (
                            <NavGroup 
                                label={t('members')} 
                                icon={<UsersIcon className="w-5 h-5" />} 
                                isOpen={openMenus.members} 
                                onClick={() => toggleMenu('members')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.members.*') || route().current('admin.leaves.*')}
                                links={[
                                    { label: t('all_members'), href: route('admin.members.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                    hasPermission('create members') && { label: t('add_member'), href: route('admin.members.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                    hasPermission('view attendance') && { label: t('attendance'), href: route('admin.members.attendance'), icon: <CalendarIcon className="w-4 h-4" /> },
                                    { label: t('leave_requests'), href: route('admin.leaves.index'), icon: <CalendarIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        {(hasPermission('view clients') || hasPermission('view contacts') || hasPermission('view commercials')) && (
                            <NavGroup 
                                label={t('customers')} 
                                icon={<UserIcon className="w-5 h-5" />} 
                                isOpen={openMenus.contacts} 
                                onClick={() => toggleMenu('contacts')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.customers.*') || route().current('admin.clients.*') || route().current('admin.commercials.*')}
                                links={[
                                    hasPermission('view contacts') && { label: t('all_contacts'), href: route('admin.customers.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                    hasPermission('view clients') && { label: t('all_clients'), href: route('admin.clients.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                    hasPermission('create clients') && { label: t('add_client'), href: route('admin.clients.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                    hasPermission('view commercials') && { label: t('commercials'), href: route('admin.commercials.index'), icon: <BriefcaseIcon className="w-4 h-4" /> },
                                    hasPermission('edit clients') && { label: t('blocked_clients'), href: route('admin.clients.blacklist'), icon: <ShieldExclamationIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        {(hasPermission('view finance') || hasPermission('view invoices') || hasPermission('view quotes')) && (
                            <NavGroup 
                                label={t('financial')} 
                                icon={<DocumentTextIcon className="w-5 h-5" />} 
                                isOpen={openMenus.financial}
                                onClick={() => toggleMenu('financial')}
                                sidebarOpen={sidebarOpen}
                                active={route().current('admin.quotations.*') || route().current('admin.invoices.*') || route().current('admin.finance.*') || route().current('admin.expenses.*') || route().current('admin.salaries.*') || route().current('admin.incomes.*')}
                                links={[
                                    hasPermission('view finance') && { label: t('charges_tracking'), href: route('admin.finance.dashboard'), icon: <ChartBarIcon className="w-4 h-4" /> },
                                    hasPermission('view quotes') && { label: t('quotations'), href: route('admin.quotations.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                                    hasPermission('view invoices') && { label: t('invoices'), href: route('admin.invoices.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                    hasPermission('edit finance') && { label: t('expenses'), href: route('admin.expenses.index'), icon: <ArrowTrendingDownIcon className="w-4 h-4" /> },
                                    hasPermission('edit finance') && { label: t('incomes'), href: route('admin.incomes.index'), icon: <ArrowTrendingUpIcon className="w-4 h-4" /> },
                                    hasPermission('edit finance') && { label: t('salaries'), href: route('admin.salaries.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                    hasPermission('edit finance') && { label: t('exp_categories'), href: route('admin.expense-categories.index'), icon: <TagIcon className="w-4 h-4" /> },
                                ].filter(Boolean)}
                            />
                        )}

                        <NavItem 
                            href={route('admin.shared-files.index')} 
                            icon={<FolderIcon className="w-5 h-5" />} 
                            label={t('shared_files')} 
                            active={route().current('admin.shared-files.*')}
                            sidebarOpen={sidebarOpen}
                        />

                        {(hasPermission('view categories') || hasPermission('view blogs') || hasPermission('view templates') || hasPermission('view teamhub')) && (
                            <>
                                <div className="pt-4 pb-2">
                                    <div className={`text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4 mb-2 ${!sidebarOpen && 'text-center px-0'}`}>
                                        {sidebarOpen ? t('content_management') : 'CMS'}
                                    </div>
                                </div>

                                {hasPermission('view categories') && (
                                    <NavGroup 
                                        label={t('categories')} 
                                        icon={<TagIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.categories} 
                                        onClick={() => toggleMenu('categories')}
                                        sidebarOpen={sidebarOpen}
                                        active={route().current('admin.categories.*')}
                                        links={[
                                            { label: t('all_categories'), href: route('admin.categories.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                        ]}
                                    />
                                )}

                                {hasPermission('view blogs') && (
                                    <NavGroup 
                                        label={t('blogs')} 
                                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.blogs} 
                                        onClick={() => toggleMenu('blogs')}
                                        sidebarOpen={sidebarOpen}
                                        active={route().current('admin.blogs.*')}
                                        links={[
                                            { label: t('all_blogs'), href: route('admin.blogs.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('create blogs') && { label: t('create_blog'), href: route('admin.blogs.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                    />
                                )}

                                {hasPermission('view templates') && (
                                    <NavGroup 
                                        label={t('templates')} 
                                        icon={<TagIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.templates} 
                                        onClick={() => toggleMenu('templates')}
                                        sidebarOpen={sidebarOpen}
                                        active={route().current('admin.templates.*')}
                                        links={[
                                            { label: t('all_templates'), href: route('admin.templates.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('create templates') && { label: t('add_template'), href: route('admin.templates.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                    />
                                )}

                                {hasPermission('view creators') && (
                                    <NavGroup 
                                        label={t('creators')} 
                                        icon={<UsersIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.creators} 
                                        onClick={() => toggleMenu('creators')}
                                        sidebarOpen={sidebarOpen}
                                        active={route().current('admin.creators.*')}
                                        links={[
                                            { label: t('all_creators'), href: route('admin.creators.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('create creators') && { label: t('add_creator'), href: route('admin.creators.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                    />
                                )}

                                {hasPermission('view teamhub') && (
                                    <NavGroup 
                                        label={t('team_hub')} 
                                        icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.teamhub} 
                                        onClick={() => toggleMenu('teamhub')}
                                        sidebarOpen={sidebarOpen}
                                        active={route().current('admin.teamhub.*')}
                                        links={[
                                            { label: t('activities'), href: route('admin.teamhub.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('view chat') && { label: t('chat'), href: route('chat.index'), icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                    />
                                )}
                            </>
                        )}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            {sidebarOpen && <span>{t('logout')}</span>}
                        </Link>
                    </div>
                </motion.aside>

                {/* Main Content Wrapper */}
                <main className={`flex-1 min-w-0 h-full ${mainClassName} bg-gray-50 dark:bg-black relative overflow-hidden`}>
                    {/* Ambient Background Glows (Static) */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/5 blur-[120px] rounded-full dark:opacity-20 opacity-10 animate-pulse" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/5 blur-[120px] rounded-full dark:opacity-15 opacity-5" />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="h-full overflow-y-auto custom-scrollbar relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={route().current()}
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
                                    <XMarkIcon className="w-6 h-6 dark:text-white" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {hasPermission('view dashboard') && (
                                    <NavItem 
                                        href={route('admin.dashboard')} 
                                        icon={<ChartBarIcon className="w-5 h-5" />} 
                                        label={t('dashboard')} 
                                        active={route().current('admin.dashboard')}
                                        sidebarOpen={true}
                                        onClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {hasPermission('view projects') && (
                                    <NavGroup 
                                        label={t('projects')} 
                                        icon={<FolderIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.projects} 
                                        onClick={() => toggleMenu('projects')}
                                        sidebarOpen={true}
                                        active={route().current('admin.projects.*')}
                                        links={[
                                            { label: t('all_projects'), href: route('admin.projects.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('create projects') && { label: t('add_project'), href: route('admin.projects.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {hasPermission('view tasks') && (
                                    <NavGroup 
                                        label={t('tasks')} 
                                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.tasks} 
                                        onClick={() => toggleMenu('tasks')}
                                        sidebarOpen={true}
                                        active={route().current('admin.tasks.*') || route().current('admin.progress.*')}
                                        links={[
                                            { label: t('all_tasks'), href: route('admin.tasks.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('create tasks') && { label: t('add_task'), href: route('admin.tasks.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                            { label: t('progress_updates'), href: route('admin.progress.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {hasPermission('view appointments') && (
                                    <NavGroup 
                                        label={t('appointments')} 
                                        icon={<CalendarIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.appointments} 
                                        onClick={() => toggleMenu('appointments')}
                                        sidebarOpen={true}
                                        active={route().current('admin.appointments.*')}
                                        links={[
                                            { label: t('requests'), href: route('admin.appointments.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('view calendar') && { label: t('calendar'), href: route('admin.appointments.calendar'), icon: <CalendarIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {hasPermission('view members') && (
                                    <NavGroup 
                                        label={t('members')} 
                                        icon={<UsersIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.members} 
                                        onClick={() => toggleMenu('members')}
                                        sidebarOpen={true}
                                        active={route().current('admin.members.*') || route().current('admin.roles.*')}
                                        links={[
                                            { label: t('all_members'), href: route('admin.members.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                            hasPermission('create members') && { label: t('add_member'), href: route('admin.members.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                            hasPermission('view attendance') && { label: t('attendance'), href: route('admin.members.attendance'), icon: <CalendarIcon className="w-4 h-4" /> },
                                            hasPermission('view roles') && { label: t('roles_permissions'), href: route('admin.roles.index'), icon: <ShieldExclamationIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {(hasPermission('view clients') || hasPermission('view contacts') || hasPermission('view commercials')) && (
                                    <NavGroup 
                                        label={t('customers')} 
                                        icon={<UserIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.contacts} 
                                        onClick={() => toggleMenu('contacts')}
                                        sidebarOpen={true}
                                        active={route().current('admin.customers.*') || route().current('admin.clients.*') || route().current('admin.commercials.*')}
                                        links={[
                                            hasPermission('view contacts') && { label: t('all_contacts'), href: route('admin.customers.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('view clients') && { label: t('all_clients'), href: route('admin.clients.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                            hasPermission('create clients') && { label: t('add_client'), href: route('admin.clients.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                            hasPermission('view commercials') && { label: t('commercials'), href: route('admin.commercials.index'), icon: <BriefcaseIcon className="w-4 h-4" /> },
                                            hasPermission('edit clients') && { label: t('blocked_clients'), href: route('admin.clients.blacklist'), icon: <ShieldExclamationIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {(hasPermission('view finance') || hasPermission('view invoices') || hasPermission('view quotes')) && (
                                    <NavGroup 
                                        label={t('financial')} 
                                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                                        isOpen={openMenus.financial}
                                        onClick={() => toggleMenu('financial')}
                                        sidebarOpen={true}
                                        active={route().current('admin.quotations.*') || route().current('admin.invoices.*') || route().current('admin.finance.*') || route().current('admin.expenses.*') || route().current('admin.salaries.*') || route().current('admin.incomes.*')}
                                        links={[
                                            hasPermission('view finance') && { label: t('charges_tracking'), href: route('admin.finance.dashboard'), icon: <ChartBarIcon className="w-4 h-4" /> },
                                            hasPermission('view quotes') && { label: t('quotations'), href: route('admin.quotations.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                                            hasPermission('view invoices') && { label: t('invoices'), href: route('admin.invoices.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                            hasPermission('edit finance') && { label: t('expenses'), href: route('admin.expenses.index'), icon: <ArrowTrendingDownIcon className="w-4 h-4" /> },
                                            hasPermission('edit finance') && { label: t('incomes'), href: route('admin.incomes.index'), icon: <ArrowTrendingUpIcon className="w-4 h-4" /> },
                                            hasPermission('edit finance') && { label: t('salaries'), href: route('admin.salaries.index'), icon: <UsersIcon className="w-4 h-4" /> },
                                            hasPermission('edit finance') && { label: t('exp_categories'), href: route('admin.expense-categories.index'), icon: <TagIcon className="w-4 h-4" /> },
                                        ].filter(Boolean)}
                                        onLinkClick={() => setMobileMenuOpen(false)}
                                    />
                                )}

                                {(hasPermission('view categories') || hasPermission('view blogs') || hasPermission('view templates') || hasPermission('view teamhub')) && (
                                    <>
                                        <div className="pt-4 pb-2">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4 mb-2">
                                                {t('content_management')}
                                            </div>
                                        </div>

                                        {hasPermission('view categories') && (
                                            <NavGroup 
                                                label={t('categories')} 
                                                icon={<TagIcon className="w-5 h-5" />} 
                                                isOpen={openMenus.categories} 
                                                onClick={() => toggleMenu('categories')}
                                                sidebarOpen={true}
                                                active={route().current('admin.categories.*')}
                                                links={[
                                                    { label: t('all_categories'), href: route('admin.categories.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                                ]}
                                                onLinkClick={() => setMobileMenuOpen(false)}
                                            />
                                        )}

                                        {hasPermission('view blogs') && (
                                            <NavGroup 
                                                label={t('blogs')} 
                                                icon={<DocumentTextIcon className="w-5 h-5" />} 
                                                isOpen={openMenus.blogs} 
                                                onClick={() => toggleMenu('blogs')}
                                                sidebarOpen={true}
                                                active={route().current('admin.blogs.*')}
                                                links={[
                                                    { label: t('all_blogs'), href: route('admin.blogs.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                                    hasPermission('create blogs') && { label: t('create_blog'), href: route('admin.blogs.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                                ].filter(Boolean)}
                                                onLinkClick={() => setMobileMenuOpen(false)}
                                            />
                                        )}

                                        {hasPermission('view templates') && (
                                            <NavGroup 
                                                label={t('templates')} 
                                                icon={<TagIcon className="w-5 h-5" />} 
                                                isOpen={openMenus.templates} 
                                                onClick={() => toggleMenu('templates')}
                                                sidebarOpen={true}
                                                active={route().current('admin.templates.*')}
                                                links={[
                                                    { label: t('all_templates'), href: route('admin.templates.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                                    hasPermission('create templates') && { label: t('add_template'), href: route('admin.templates.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                                ].filter(Boolean)}
                                                onLinkClick={() => setMobileMenuOpen(false)}
                                            />
                                        )}

                                        {hasPermission('view creators') && (
                                            <NavGroup 
                                                label={t('creators')} 
                                                icon={<UsersIcon className="w-5 h-5" />} 
                                                isOpen={openMenus.creators} 
                                                onClick={() => toggleMenu('creators')}
                                                sidebarOpen={true}
                                                active={route().current('admin.creators.*')}
                                                links={[
                                                    { label: t('all_creators'), href: route('admin.creators.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                                    hasPermission('create creators') && { label: t('add_creator'), href: route('admin.creators.create'), icon: <PlusIcon className="w-4 h-4" /> },
                                                ].filter(Boolean)}
                                                onLinkClick={() => setMobileMenuOpen(false)}
                                            />
                                        )}

                                        {hasPermission('view teamhub') && (
                                            <NavGroup 
                                                label={t('team_hub')} 
                                                icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} 
                                                isOpen={openMenus.teamhub} 
                                                onClick={() => toggleMenu('teamhub')}
                                                sidebarOpen={true}
                                                active={route().current('admin.teamhub.*')}
                                                links={[
                                                    { label: t('activities'), href: route('admin.teamhub.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                                                    hasPermission('view chat') && { label: t('chat'), href: route('chat.index'), icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                                                ].filter(Boolean)}
                                                onLinkClick={() => setMobileMenuOpen(false)}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavItem({ href, icon, label, active, sidebarOpen, onClick }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                active 
                ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-lg shadow-blue-500/25' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
            }`}
        >
            <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            {sidebarOpen && (
                <span className={`text-sm font-bold tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
                    {label}
                </span>
            )}
            {active && (
                <motion.div layoutId="activePill" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
            )}
        </Link>
    );
}

function NavGroup({ label, icon, isOpen, onClick, sidebarOpen, links, active, onLinkClick }) {
    return (
        <div className="space-y-1">
            <button
                onClick={onClick}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    active && !isOpen 
                    ? 'bg-blue-50 dark:bg-blue-900/10 text-[#1F2BF3]' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`transition-transform duration-300 ${active ? 'text-[#1F2BF3]' : 'group-hover:scale-110'}`}>
                        {icon}
                    </div>
                    {sidebarOpen && <span className="text-sm font-bold tracking-tight">{label}</span>}
                </div>
                {sidebarOpen && (
                    <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>
            
            <AnimatePresence>
                {isOpen && sidebarOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-11 space-y-1"
                    >
                        {links.map((link, idx) => {
                            const linkActive = route().current(link.href.split('/').pop() + '*'); // Simple heuristic
                            return (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    onClick={onLinkClick}
                                    className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all hover:translate-x-1 ${
                                        active ? 'text-gray-700 dark:text-gray-200 hover:text-[#1F2BF3]' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-[#1F2BF3]" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}