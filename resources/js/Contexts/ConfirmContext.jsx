import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmModal from '@/Components/ConfirmModal';

const ConfirmContext = createContext();

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [config, setConfig] = useState({
        show: false,
        title: '',
        message: '',
        confirmText: '',
        cancelText: '',
        onConfirm: () => {},
        variant: 'danger',
    });

    const confirm = useCallback((options) => {
        return new Promise((resolve) => {
            setConfig({
                show: true,
                title: options.title || 'Are you sure?',
                message: options.message || 'This action cannot be undone.',
                confirmText: options.confirmText || (options.mode === 'alert' ? 'OK' : 'Confirm'),
                cancelText: options.cancelText || 'Cancel',
                variant: options.variant || 'danger',
                mode: options.mode || 'confirm',
                onConfirm: () => {
                    resolve(true);
                    setConfig(prev => ({ ...prev, show: false }));
                },
                onClose: () => {
                    resolve(false);
                    setConfig(prev => ({ ...prev, show: false }));
                }
            });
        });
    }, []);

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <ConfirmModal 
                show={config.show}
                onClose={() => {
                    config.onClose();
                }}
                onConfirm={config.onConfirm}
                title={config.title}
                message={config.message}
                confirmText={config.confirmText}
                cancelText={config.cancelText}
                variant={config.variant}
                mode={config.mode}
            />
        </ConfirmContext.Provider>
    );
};
