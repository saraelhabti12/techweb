import { Link } from '@inertiajs/react';

export default function MemberLayout({ auth, children }) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation Bar */}
            <header className="bg-teal-600 dark:bg-teal-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="h-64 w-auto"
                                    src="/images/logo.png"
                                    alt="TechWeb"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('attendance.qr')}
                                className="p-2 rounded-full text-white hover:bg-teal-500 dark:hover:bg-teal-700 transition-colors"
                                title="Attendance QR"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-teal-500 dark:bg-teal-700 flex items-center justify-center text-white font-medium">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-white">
                                    {auth.user.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-full">
                {/* Sidebar */}
                <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:block">
                    <nav className="mt-6">
                        <NavLink href={route('member.dashboard')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            Dashboard
                        </NavLink>
                        <NavLink href={route('member.tasks.index')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                            </svg>
                            My Tasks
                        </NavLink>
                        <NavLink href={route('member.progress.index')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                            Progress Updates
                        </NavLink>
                        <NavLink href={route('member.myAttendance')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            My Attendance
                        </NavLink>

                        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 mx-4">
                            <NavLink
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                </svg>
                                Logout
                            </NavLink>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-teal-50 to-white dark:from-gray-800 dark:to-gray-900">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

const NavLink = ({ href, children, ...props }) => {
    return (
        <Link
            href={href}
            className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
            activeClassName="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium border-r-4 border-teal-500"
            {...props}
        >
            {children}
        </Link>
    );
};
