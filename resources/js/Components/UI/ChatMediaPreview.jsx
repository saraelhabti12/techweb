import React from 'react';
import { XMarkIcon, DocumentIcon } from '@heroicons/react/24/outline';

const ChatMediaPreview = ({ file, onClear }) => {
    if (!file) return null;

    const isImage = file.type.startsWith('image/');

    return (
        <div className="absolute bottom-20 left-6 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-4 z-50">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0">
                {isImage ? (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <DocumentIcon className="w-8 h-8 text-gray-400" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button 
                onClick={onClear}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 transition-colors"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default ChatMediaPreview;
