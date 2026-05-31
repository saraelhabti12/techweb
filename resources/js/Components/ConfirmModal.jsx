import React from 'react';
import Modal from '@/Components/Modal';
import DashboardButton from '@/Components/UI/DashboardButton';
import { ExclamationTriangleIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ 
    show, 
    onClose, 
    onConfirm, 
    title = "Confirmation", 
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    mode = "confirm",
    processing = false 
}) => {
    const isAlert = mode === 'alert';

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="relative overflow-hidden bg-white dark:bg-[#0A0A0A] rounded-[2rem] shadow-2xl">
                {/* Decorative Background Blur */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${isAlert ? 'bg-blue-500/10' : 'bg-red-500/10'} blur-[60px] rounded-full -mr-16 -mt-16 pointer-events-none`} />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#1F2BF3]/10 blur-[50px] rounded-full -ml-12 -mb-12 pointer-events-none" />

                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 ${isAlert ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-2xl`}>
                            {isAlert ? (
                                <InformationCircleIcon className="w-8 h-8 text-blue-500" />
                            ) : (
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                            )}
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        {!isAlert && (
                            <DashboardButton 
                                variant="secondary" 
                                onClick={onClose}
                                className="flex-1 !py-4"
                            >
                                {cancelText}
                            </DashboardButton>
                        )}
                        <DashboardButton 
                            onClick={onConfirm}
                            loading={processing}
                            className={`flex-1 !py-4 ${
                                isAlert 
                                ? '!bg-[#1F2BF3] hover:!bg-[#00D8C0]' 
                                : variant === 'danger' 
                                    ? '!bg-red-500 hover:!bg-red-600 shadow-lg shadow-red-500/20' 
                                    : '!bg-[#1F2BF3] hover:!bg-[#00D8C0]'
                            } text-white font-black`}
                        >
                            {confirmText}
                        </DashboardButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
