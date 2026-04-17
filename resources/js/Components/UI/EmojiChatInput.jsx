import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { FaceSmileIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const EmojiChatInput = ({ value, onChange, onSend, placeholder = "Type your message..." }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const pickerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;
        onChange(value + emoji);
        // setShowEmojiPicker(false); // keep open if they want more emojis
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <div className="relative group">
            <div className="flex items-end gap-3 relative">
                <div className="flex-1 relative">
                    <textarea
                        rows="1"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-5 py-4 pr-24 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all"
                    />
                    
                    <div className="absolute right-14 bottom-2.5">
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 text-gray-400 hover:text-[#1F2BF3] transition-colors"
                        >
                            <FaceSmileIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {showEmojiPicker && (
                        <div ref={pickerRef} className="absolute bottom-16 right-0 z-50">
                            <EmojiPicker 
                                onEmojiClick={onEmojiClick} 
                                theme="auto"
                                searchDisabled={false}
                                skinTonesDisabled={true}
                                previewConfig={{ showPreview: false }}
                            />
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={onSend}
                    disabled={!value.trim()}
                    className="p-3.5 rounded-xl bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all"
                >
                    <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                </button>
            </div>
            <div className="mt-3 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Press Enter to send, Shift + Enter for new line</span>
            </div>
        </div>
    );
};

export default EmojiChatInput;
