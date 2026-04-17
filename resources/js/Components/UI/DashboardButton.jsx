import { motion } from "framer-motion";

export default function DashboardButton({ 
    children, 
    onClick, 
    className = "", 
    type = "button", 
    variant = "primary",
    disabled = false
}) {
    const variants = {
        primary: "bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-[0_10px_20px_rgba(31,43,243,0.3)] hover:shadow-[0_15px_30px_rgba(31,43,243,0.4)]",
        secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 shadow-sm",
        danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20",
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05, y: -2 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-3 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            <div className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </div>
        </motion.button>
    );
}
