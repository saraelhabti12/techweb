import { motion } from "framer-motion";

export default function DashboardCard({ children, className = "", noHover = false }) {
    return (
        <motion.div
            whileHover={noHover ? {} : { y: -5, scale: 1.02 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${
                !noHover ? 'hover:shadow-xl transition-shadow duration-300' : ''
            } ${className}`}
        >
            {children}
        </motion.div>
    );
}
