import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, CheckIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const PermissionSelector = ({ modules, selectedPermissions, onTogglePermission, onToggleModuleAll }) => {
    const [expandedModules, setExpandedModules] = useState({});

    const toggleExpand = (module) => {
        setExpandedModules(prev => ({
            ...prev,
            [module]: !prev[module]
        }));
    };

    const actions = ['view', 'create', 'edit', 'delete', 'export'];

    const getBackendModuleName = (module) => {
        if (module === 'Quotations') return 'quotes';
        return module.toLowerCase();
    };

    return (
        <div className="space-y-4">
            {modules.map((module) => {
                const backendModule = getBackendModuleName(module);
                const isExpanded = expandedModules[module];
                
                const allChecked = actions.every(action => selectedPermissions.includes(`${action} ${backendModule}`));
                const someChecked = actions.some(action => selectedPermissions.includes(`${action} ${backendModule}`));
                const activeCount = actions.filter(a => selectedPermissions.includes(`${a} ${backendModule}`)).length;

                return (
                    <div key={module} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow">
                        <div 
                            className="flex items-center justify-between p-4 cursor-pointer select-none"
                            onClick={() => toggleExpand(module)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${someChecked ? 'bg-[#1F2BF3] text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {isExpanded ? (
                                        <ChevronDownIcon className="w-5 h-5" />
                                    ) : (
                                        <ChevronRightIcon className="w-5 h-5" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{module}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {activeCount} / {actions.length} Actions
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-6" onClick={e => e.stopPropagation()}>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-[#1F2BF3] transition-colors">Select All</span>
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only"
                                            checked={allChecked}
                                            onChange={(e) => onToggleModuleAll(backendModule, e.target.checked)}
                                        />
                                        <div className={`w-11 h-6 rounded-full transition-colors ${allChecked ? 'bg-[#1F2BF3]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${allChecked ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <div className="px-4 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 border-t border-gray-50 dark:border-gray-800/50">
                                        {actions.map(action => {
                                            const p = `${action} ${backendModule}`;
                                            const isChecked = selectedPermissions.includes(p);
                                            return (
                                                <button
                                                    key={action}
                                                    type="button"
                                                    onClick={() => onTogglePermission(p)}
                                                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        isChecked 
                                                            ? 'bg-[#1F2BF3]/5 border-[#1F2BF3] text-[#1F2BF3] shadow-sm' 
                                                            : 'bg-transparent border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200 dark:hover:border-gray-700'
                                                    }`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${isChecked ? 'bg-[#1F2BF3] border-[#1F2BF3]' : 'border-gray-300 dark:border-gray-700'}`}>
                                                        {isChecked && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                                                    </div>
                                                    {action}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};

export default PermissionSelector;
