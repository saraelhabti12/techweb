import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function DashboardInput(
    { type = 'text', className = '', isFocused = false, icon: Icon, ...props },
    ref
) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                </div>
            )}
            <input
                {...props}
                type={type}
                className={`w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl shadow-sm focus:ring-2 focus:ring-[#1F2BF3]/50 focus:border-[#1F2BF3] transition-all duration-300 placeholder-gray-400 ${
                    Icon ? 'pl-11' : 'px-4'
                } py-3 ${className}`}
                ref={inputRef}
            />
        </div>
    );
});
