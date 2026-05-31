import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import Avatar from '@/Components/UI/Avatar';

const ProfileDropdown = ({ user, profileRoute, logoutRoute }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 group"
            >
                <div className="relative">
                    <Avatar user={user} size="md" className="border border-gray-100 dark:border-gray-800 shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                </div>
                <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors">{user?.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{user?.role}</p>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-[#0F0F0F] shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-2 space-y-1">
                            <Link
                                href={profileRoute}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Cog8ToothIcon className="w-5 h-5 text-gray-400 group-hover:text-[#1F2BF3] transition-colors" />
                                Profile Settings
                            </Link>

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>

                            <Link
                                href={logoutRoute}
                                method="post"
                                as="button"
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all group text-left"
                                onClick={() => setIsOpen(false)}
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Logout
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
