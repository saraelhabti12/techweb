import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { History, Clock, User, Activity as ActivityIcon } from 'lucide-react';

const HistoryDropdown = () => {
    const [activities, setActivities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchActivities = async () => {
        try {
            const response = await axios.get('/activities');
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchActivities();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-[#1F2BF3] transition-all group relative"
                title="Activity History"
            >
                <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {isOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-80 sm:w-96 max-h-[500px] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-[#1F2BF3]" />
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Activity History</h3>
                        </div>
                        <button 
                            onClick={() => fetchActivities()}
                            className="text-[10px] font-bold text-[#1F2BF3] hover:underline"
                        >
                            Refresh
                        </button>
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {activities.length === 0 ? (
                            <div className="p-10 text-center">
                                <ActivityIcon className="w-10 h-10 text-gray-200 dark:text-gray-800 mx-auto mb-3" />
                                <p className="text-sm text-gray-500 italic">No recent activities found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                {activities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <User className="w-3.5 h-3.5 text-[#1F2BF3]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <p className="text-xs font-black text-gray-900 dark:text-white truncate">
                                                        {activity.user?.name || 'Unknown User'}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1 shrink-0 ml-2">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] font-bold text-[#1F2BF3] uppercase tracking-wide mb-1">
                                                    {activity.action}
                                                </p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                    {activity.description}
                                                </p>
                                                <p className="text-[9px] text-gray-400 mt-1.5">
                                                    {formatTime(activity.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 text-center">
                        <p className="text-[10px] text-gray-400 font-medium">Showing latest 15 actions</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoryDropdown;
