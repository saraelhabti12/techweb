import { Link, usePage  } from '@inertiajs/react';
import { useState } from 'react';

export default function MemberLayout({ auth, children }) {
    const [teamHubOpen, setTeamHubOpen] = useState(false);
    
    return (
        <div className="bg-white">
            {/* Top Navigation Bar */}
            <header className="bg-purple-10/90 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="absolute top-2 left-4">
                                <img
                                    className="h-12 w-auto"
                                    src="/images/logotechweb.png"
                                    alt="TechWeb"
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('attendance.qr')}
                                className="p-2 rounded-full text-gray-900 hover:bg-purple-500 transition-colors"
                                title="Attendance QR"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                            </Link>
                            {/* <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-purple-500  flex items-center justify-center text-gray-900 font-medium">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {auth.user.name}
                                </span>
                            </div> */}

                            <div className="h-8 w-8 rounded-full overflow-hidden">
                                {auth.user.avatar ? (
                                    <img
                                        src={`/storage/${auth.user.avatar}`}
                                        alt={auth.user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 bg-purple-500 flex items-center justify-center text-gray-900 font-medium">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

{/* Nom de l'utilisateur */}
    <span className="text-sm font-medium text-gray-900">
        {auth.user.name}
    </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex h-full">
                {/* Sidebar */}
                <aside className="w-64 bg-purple-10/90 border shadow-md hidden md:block">
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

                        {/* TeamHub Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setTeamHubOpen(!teamHubOpen)}
                                className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-900 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-700 rounded-md transition-colors"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM9 6h10v2H9V6zm0 4h10v2H9v-2zm0 4h10v2H9v-2z" />
                            </svg>
                                TeamHub Member
                                <svg className={`ml-auto h-4 w-4 transition-transform ${teamHubOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {teamHubOpen && (
                                <div className="ml-6 mt-1 space-y-1">
                                    <NavLink href={route('member.teamhub.index')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                        View Activity
                                    </NavLink>
                                    <NavLink href={route('member.teamhub.chat')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        Chat
                        </NavLink>
                                </div>
                            )}
                        </div>


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

// const NavLink = ({ href, children, ...props }) => {
//     return (
//         <Link
//             href={href}
//             className="flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors"
//             activeClassName="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 font-medium border-r-4 border-teal-500"
//             {...props}
//         >
//             {children}
//         </Link>
//     );
// };

const NavLink = ({ href, children, ...props }) => {
    const { url } = usePage(); // récupère l'URL actuelle
    const isActive = url === href; // simple comparaison, ou plus complexe si nécessaire

    return (
        <Link
            href={href}
            className={`flex items-center px-6 py-3 transition-colors
                ${isActive ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-medium border-r-4 border-purple-500'
                            : 'text-gray-900 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/20'}`}
            {...props}
        >
            {children}
        </Link>
    );
};
