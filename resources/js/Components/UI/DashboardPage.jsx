import { motion } from "framer-motion";

export default function DashboardPage({ children, title, description, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8 md:space-y-10 w-full overflow-hidden"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 pb-2 border-b border-gray-100 dark:border-gray-800/50">
                <div className="space-y-1.5 md:space-y-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase break-words">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 lg:mt-0">
                        {actions}
                    </div>
                )}
            </div>
            
            <div className="relative z-10 w-full overflow-hidden">
                {children}
            </div>
        </motion.div>
    );
}
