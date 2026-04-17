import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const UserStatus = ({ user, showText = true, className = '' }) => {
    const isOnline = user?.is_online;
    
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {showText && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? 'text-green-500' : 'text-gray-400'}`}>
                    {isOnline ? 'Online' : (user?.last_seen ? `Last seen ${dayjs(user.last_seen).fromNow()}` : 'Offline')}
                </span>
            )}
        </div>
    );
};

export default UserStatus;
