import { motion } from "framer-motion";

export default function DashboardPage({ children, title, description, actions }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8 space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center gap-3">
                        {actions}
                    </div>
                )}
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </motion.div>
    );
}
