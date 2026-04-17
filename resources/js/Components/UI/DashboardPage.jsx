import { motion } from "framer-motion";

export default function DashboardPage({ children, title, description, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 md:p-10 space-y-10"
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-gray-100 dark:border-gray-800/50">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex flex-wrap items-center gap-4">
                        {actions}
                    </div>
                )}
            </div>
            
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
