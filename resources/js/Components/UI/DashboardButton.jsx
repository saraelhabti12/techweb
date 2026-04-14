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
        primary: "bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white",
        secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
        danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm",
    };

    return (
        <motion.button
            whileHover={disabled ? {} : { scale: 1.05, brightness: 1.1 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            transition={{ duration: 0.2 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
}
