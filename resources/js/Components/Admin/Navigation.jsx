import { Link } from '@inertiajs/react';

export default function Navigation({ auth, darkMode, setDarkMode }) {
    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">
                                <span className="text-xl font-bold text-gray-800 dark:text-white">ProjectManager</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} /> */}


                        <div className="ml-3 relative">
                            <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                                    {auth.user.name}
                                </span>

                                <Link
                                    href={route('profile.edit')}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>

                                <Link
                                    method="post"
                                    href={route('logout')}
                                    as="button"
                                    className="ml-2 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
