import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDropdown from '@/Components/NotificationDropdown';
import HistoryDropdown from '@/Components/HistoryDropdown';
import DarkModeToggle from '@/Components/DarkModeToggle';
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
    ShieldExclamationIcon
} from '@heroicons/react/24/outline';

import Avatar from '@/Components/UI/Avatar';
import ApplicationLogo from '@/Components/ApplicationLogo';
import axios from 'axios';

export default function AdminLayout({ auth, children, title = '' }) {
    const { unreadChatCount = 0 } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
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
    
    const [openMenus, setOpenMenus] = useState({
        projects: false,
        tasks: false,
        members: false,
        categories: false,
        blogs: false,
        contacts: false,
        templates: false,
        schedule: false,
        teamhub: false,
        appointments: false,
        financial: false,
    });

    useEffect(() => {
        setOpenMenus(prev => ({
            ...prev,
            projects: route().current('admin.projects.*'),
            tasks: route().current('admin.tasks.*') || route().current('admin.progress.*'),
            members: route().current('admin.members.*'),
            contacts: route().current('admin.customers.*') || route().current('admin.clients.*'),
            financial: route().current('admin.quotations.*') || route().current('admin.invoices.*'),
            appointments: route().current('admin.appointments.*'),
            categories: route().current('admin.categories.*'),
            blogs: route().current('admin.blogs.*'),
            templates: route().current('admin.templates.*'),
            schedule: route().current('admin.schedule.*'),
            teamhub: route().current('admin.teamhub.*'),
        }));
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-black font-sans transition-colors duration-500">
            {/* Sidebar Desktop */}
            <motion.aside
                initial={false}
                animate={{ width: sidebarOpen ? 280 : 88 }}
                className={`hidden lg:flex flex-col bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 shadow-xl overflow-hidden`}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 border-b border-gray-100 dark:border-gray-800/50">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 overflow-hidden">
                        <ApplicationLogo className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem 
                        href={route('admin.dashboard')} 
                        icon={<ChartBarIcon className="w-5 h-5" />} 
                        label="Dashboard" 
                        active={route().current('admin.dashboard')}
                        sidebarOpen={sidebarOpen}
                    />

                    <NavGroup 
                        label="Projects" 
                        icon={<FolderIcon className="w-5 h-5" />} 
                        isOpen={openMenus.projects} 
                        onClick={() => toggleMenu('projects')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.projects.*')}
                        links={[
                            { label: 'All Projects', href: route('admin.projects.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Add Project', href: route('admin.projects.create'), icon: <PlusIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Tasks" 
                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                        isOpen={openMenus.tasks} 
                        onClick={() => toggleMenu('tasks')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.tasks.*') || route().current('admin.progress.*')}
                        links={[
                            { label: 'All Tasks', href: route('admin.tasks.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Add Task', href: route('admin.tasks.create'), icon: <PlusIcon className="w-4 h-4" /> },
                            { label: 'Progress Updates', href: route('admin.progress.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Appointments" 
                        icon={<CalendarIcon className="w-5 h-5" />} 
                        isOpen={openMenus.appointments} 
                        onClick={() => toggleMenu('appointments')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.appointments.*')}
                        links={[
                            { label: 'Requests', href: route('admin.appointments.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Calendar', href: route('admin.appointments.calendar'), icon: <CalendarIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Members" 
                        icon={<UsersIcon className="w-5 h-5" />} 
                        isOpen={openMenus.members} 
                        onClick={() => toggleMenu('members')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.members.*')}
                        links={[
                            { label: 'All Members', href: route('admin.members.index'), icon: <UsersIcon className="w-4 h-4" /> },
                            { label: 'Add Member', href: route('admin.members.create'), icon: <PlusIcon className="w-4 h-4" /> },
                            { label: 'Attendance', href: route('admin.members.attendance'), icon: <CalendarIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Customers" 
                        icon={<UserIcon className="w-5 h-5" />} 
                        isOpen={openMenus.contacts} 
                        onClick={() => toggleMenu('contacts')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.customers.*') || route().current('admin.clients.*')}
                        links={[
                            { label: 'All Contacts', href: route('admin.customers.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'All Clients', href: route('admin.clients.index'), icon: <UsersIcon className="w-4 h-4" /> },
                            { label: 'Add Client', href: route('admin.clients.create'), icon: <PlusIcon className="w-4 h-4" /> },
                            { label: 'Blocked Clients', href: route('admin.clients.blacklist'), icon: <ShieldExclamationIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Financial" 
                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                        isOpen={openMenus.financial}
                        onClick={() => toggleMenu('financial')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.quotations.*') || route().current('admin.invoices.*')}
                        links={[
                            { label: 'Quotations', href: route('admin.quotations.index'), icon: <DocumentTextIcon className="w-4 h-4" /> },
                            { label: 'Invoices', href: route('admin.invoices.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <div className="pt-4 pb-2">
                        <div className={`text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-4 mb-2 ${!sidebarOpen && 'text-center px-0'}`}>
                            {sidebarOpen ? 'Content Management' : 'CMS'}
                        </div>
                    </div>

                    <NavGroup 
                        label="Categories" 
                        icon={<TagIcon className="w-5 h-5" />} 
                        isOpen={openMenus.categories} 
                        onClick={() => toggleMenu('categories')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.categories.*')}
                        links={[
                            { label: 'All Categories', href: route('admin.categories.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Blogs" 
                        icon={<DocumentTextIcon className="w-5 h-5" />} 
                        isOpen={openMenus.blogs} 
                        onClick={() => toggleMenu('blogs')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.blogs.*')}
                        links={[
                            { label: 'All Blogs', href: route('admin.blogs.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Create Blog', href: route('admin.blogs.create'), icon: <PlusIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Templates" 
                        icon={<TagIcon className="w-5 h-5" />} 
                        isOpen={openMenus.templates} 
                        onClick={() => toggleMenu('templates')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.templates.*')}
                        links={[
                            { label: 'All Templates', href: route('admin.templates.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Add Template', href: route('admin.templates.create'), icon: <PlusIcon className="w-4 h-4" /> },
                        ]}
                    />

                    <NavGroup 
                        label="Team Hub" 
                        icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />} 
                        isOpen={openMenus.teamhub} 
                        onClick={() => toggleMenu('teamhub')}
                        sidebarOpen={sidebarOpen}
                        active={route().current('admin.teamhub.*')}
                        links={[
                            { label: 'Activities', href: route('admin.teamhub.index'), icon: <ListBulletIcon className="w-4 h-4" /> },
                            { label: 'Chat', href: route('chat.index'), icon: <ChatBubbleLeftRightIcon className="w-4 h-4" /> },
                        ]}
                    />
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
                        {sidebarOpen && <span>Logout</span>}
                    </Link>
                </div>
            </motion.aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800 z-40 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ApplicationLogo className="h-8 w-auto" />
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-400">
                    {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden pt-16 lg:pt-0">
                {/* Topbar Desktop */}
                <header className="hidden lg:flex h-20 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-8 items-center justify-between sticky top-0 z-20">
                    <button onClick={toggleSidebar} className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] transition-colors border border-gray-100 dark:border-gray-800">
                        {sidebarOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 pr-6 border-r border-gray-100 dark:border-gray-800">
                             <Link
                                href={route('chat.index')}
                                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1F2BF3] transition-all relative"
                            >
                                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                {unreadChatCount > 0 && (
                                    <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-950">
                                        {unreadChatCount}
                                    </span>
                                )}
                            </Link>
                            <HistoryDropdown />
                            <NotificationDropdown />
                            <DarkModeToggle />
                        </div>

                        <Link href={route('admin.profile')} className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group">
                            <div className="relative">
                                <Avatar user={auth?.user} size="md" className="border border-gray-100 dark:border-gray-800 shadow-sm" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                            </div>
                            <div className="text-left hidden xl:block">
                                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">{auth?.user?.name}</p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{auth?.user?.role}</p>
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Main Content Scrollable */}
                <main className="flex-1 overflow-y-auto scroll-smooth bg-gray-50 dark:bg-black relative">
                    {/* Ambient Background Glows */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1F2BF3]/5 blur-[120px] rounded-full dark:opacity-20 opacity-10 animate-pulse" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#00D8C0]/5 blur-[120px] rounded-full dark:opacity-15 opacity-5" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={route().current()}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
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
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }} 
                            animate={{ x: 0 }} 
                            exit={{ x: '-100%' }}
                            className="fixed top-0 left-0 bottom-0 w-80 bg-white dark:bg-[#0A0A0A] z-50 lg:hidden shadow-2xl flex flex-col"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b dark:border-gray-800">
                                <ApplicationLogo className="h-10 w-auto" />
                                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl bg-gray-50 dark:bg-gray-900">
                                    <XMarkIcon className="w-6 h-6 dark:text-white" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                {/* Duplicate nav here for mobile if needed, or extract to component */}
                                <NavItem href={route('admin.dashboard')} icon={<ChartBarIcon className="w-5 h-5" />} label="Dashboard" active={route().current('admin.dashboard')} sidebarOpen={true} />
                                
                                <NavGroup 
                                    label="Financial" 
                                    icon={<DocumentTextIcon className="w-5 h-5" />} 
                                    isOpen={openMenus.financial}
                                    onClick={() => toggleMenu('financial')}
                                    sidebarOpen={true}
                                    active={route().current('admin.quotations.*') || route().current('admin.invoices.*')}
                                    links={[
                                        { label: 'Quotations', href: route('admin.quotations.index') },
                                        { label: 'Invoices', href: route('admin.invoices.index') },
                                    ]}
                                />
                                {/* ... more items */}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function NavItem({ href, icon, label, active, sidebarOpen }) {
    return (
        <Link
            href={href}
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

function NavGroup({ label, icon, isOpen, onClick, sidebarOpen, links, active }) {
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
