import { Link } from '@inertiajs/react';
import { useState } from 'react';
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
  UsersIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({ auth, children, title = '' }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [openMenus, setOpenMenus] = useState({
        projects: false,
        tasks: false,
        members: false,
        categories: false,
    });

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 flex flex-col`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                    <Link href="/admin/dashboard" className="flex items-center">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className={`${sidebarOpen ? 'h-60' : 'h-40'} transition-all`}
                        />

                    </Link>
                    {sidebarOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 flex flex-col px-3 py-4 space-y-1 overflow-y-auto">
                    <SimpleLink
                        title="Dashboard"
                        href="/admin/dashboard"
                        sidebarOpen={sidebarOpen}
                        icon={<ChartBarIcon className="h-5 w-5" />}
                        active={route().current('admin.dashboard')}
                    />

                    <CollapsibleSection
                        title="Projects"
                        menuKey="projects"
                        links={[
                            { name: 'All Projects', href: '/projects', icon: <ListBulletIcon className="h-4 w-4" /> },
                            { name: 'Add Project', href: '/projects/create', icon: <PlusIcon className="h-4 w-4" /> },
                        ]}
                        sidebarOpen={sidebarOpen}
                        openMenus={openMenus}
                        toggleMenu={toggleMenu}
                        icon={<FolderIcon className="h-5 w-5" />}
                    />

                    <CollapsibleSection
                        title="Tasks"
                        menuKey="tasks"
                        links={[
                            { name: 'All Tasks', href: '/tasks', icon: <ListBulletIcon className="h-4 w-4" /> },
                            { name: 'Add Task', href: '/tasks/create', icon: <PlusIcon className="h-4 w-4" /> },
                            { name: 'Progress Updates', href: '/admin/progress-updates', icon: <DocumentTextIcon className="h-4 w-4" /> },
                        ]}
                        sidebarOpen={sidebarOpen}
                        openMenus={openMenus}
                        toggleMenu={toggleMenu}
                        icon={<DocumentTextIcon className="h-5 w-5" />}
                    />

                    <CollapsibleSection
                        title="Members"
                        menuKey="members"
                        links={[
                            { name: 'All Members', href: '/members', icon: <UsersIcon className="h-4 w-4" /> },
                            { name: 'Add Member', href: '/members/create', icon: <PlusIcon className="h-4 w-4" /> },
                            { name: 'Attendance', href: '/members/attendance', icon: <CalendarIcon className="h-4 w-4" /> },
                        ]}
                        sidebarOpen={sidebarOpen}
                        openMenus={openMenus}
                        toggleMenu={toggleMenu}
                        icon={<UsersIcon className="h-5 w-5" />}
                    />

                    <CollapsibleSection
                        title="Categories"
                        menuKey="categories"
                        links={[
                            { name: 'All Categories', href: '/categories', icon: <ListBulletIcon className="h-4 w-4" /> },
                            { name: 'Add Category', href: '/categories/create', icon: <PlusIcon className="h-4 w-4" /> },
                        ]}
                        sidebarOpen={sidebarOpen}
                        openMenus={openMenus}
                        toggleMenu={toggleMenu}
                        icon={<TagIcon className="h-5 w-5" />}
                    />

                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                        <SimpleLink
                            title="Profile"
                            href="/admin/profile"
                            sidebarOpen={sidebarOpen}
                            icon={<UserIcon className="h-5 w-5" />}
                            active={route().current('admin.profile')}
                        />
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className={`flex items-center ${sidebarOpen ? 'px-4 py-3 justify-start space-x-3' : 'p-3 justify-center'} w-full text-sm font-medium rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            {sidebarOpen && <span>Logout</span>}
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            {!sidebarOpen && (
                                <button
                                    onClick={toggleSidebar}
                                    className="mr-4 p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            )}
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {title || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/admin/profile"
                                className="flex items-center space-x-2 group"
                            >
                                <div className="relative">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                        <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-900 bg-green-400"></span>
                                </div>
                                {sidebarOpen && (
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{auth.user.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function SimpleLink({ title, href, sidebarOpen, icon, active = false }) {
    return (
        <Link
            href={href}
            className={`flex items-center ${sidebarOpen ? 'px-4 py-3 justify-start space-x-3' : 'p-3 justify-center'}
            text-sm font-medium rounded-lg transition-colors ${
                active
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
        >
            {icon}
            {sidebarOpen && <span>{title}</span>}
        </Link>
    );
}

function CollapsibleSection({ title, links, sidebarOpen, menuKey, openMenus, toggleMenu, icon }) {
    const isActive = links.some(link => route().current(link.href.replace(/^\//, '').replace(/\//g, '.')));

    return (
        <div className="space-y-1">
            <button
                onClick={() => toggleMenu(menuKey)}
                className={`w-full flex items-center ${sidebarOpen ? 'px-4 py-3 justify-between' : 'p-3 justify-center'}
                text-sm font-medium rounded-lg transition-colors ${
                    isActive
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
                <div className="flex items-center space-x-3">
                    {icon}
                    {sidebarOpen && <span>{title}</span>}
                </div>
                {sidebarOpen && (
                    openMenus[menuKey] ?
                    <ChevronUpIcon className="h-4 w-4" /> :
                    <ChevronDownIcon className="h-4 w-4" />
                )}
            </button>

            {openMenus[menuKey] && sidebarOpen && (
                <div className="space-y-1 ml-12">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center px-4 py-2 text-sm rounded-lg transition-colors space-x-2 ${
                                route().current(link.href.replace(/^\//, '').replace(/\//g, '.'))
                                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
