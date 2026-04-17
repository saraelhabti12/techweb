import React from 'react';

const Avatar = ({ user, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-2xl'
    };

    const getInitials = (name) => {
        return name
            ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
            : '?';
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center font-black shadow-inner overflow-hidden bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500`}>
                {user?.avatar ? (
                    <img 
                        src={`/storage/${user.avatar}`} 
                        alt={user.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = getInitials(user.name);
                        }}
                    />
                ) : (
                    getInitials(user?.name)
                )}
            </div>
        </div>
    );
};

export default Avatar;
