import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function DashboardInput(
    { type = 'text', className = '', isFocused = false, icon: Icon, label, ...props },
    ref
) {
    const inputRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <div className="space-y-1.5 w-full group">
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                    </div>
                )}
                <input
                    {...props}
                    type={type}
                    className={`w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 placeholder-gray-400 text-sm font-bold ${
                        Icon ? 'pl-11' : 'px-5'
                    } py-4 ${className}`}
                    ref={inputRef}
                />
            </div>
        </div>
    );
});
