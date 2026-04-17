import { motion } from "framer-motion";

export default function DashboardCard({ children, className = "", noHover = false }) {
    return (
        <motion.div
            whileHover={noHover ? {} : { y: -8, scale: 1.01 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/5 p-8 relative overflow-hidden group ${
                !noHover ? 'hover:shadow-[0_30px_70px_rgba(31,43,243,0.1)] transition-all duration-500' : ''
            } ${className}`}
        >
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
                {children}
            </div>
        </motion.div>
    );
}
