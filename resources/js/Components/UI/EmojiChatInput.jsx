import React, { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { 
    FaceSmileIcon, 
    PaperAirplaneIcon, 
    PhotoIcon, 
    PaperClipIcon, 
    CameraIcon 
} from '@heroicons/react/24/outline';
import ChatMediaPreview from './ChatMediaPreview';
import CameraModal from './CameraModal';

const EmojiChatInput = ({ value, onChange, onSend, onTyping, placeholder = "Type your message..." }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const pickerRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);

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
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        if (!value.trim() && !selectedFile) return;
        onSend(selectedFile);
        setSelectedFile(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleTextChange = (e) => {
        onChange(e.target.value);
        
        if (onTyping) {
            onTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
                onTyping(false);
            }, 3000);
        }
    };

    return (
        <div className="relative group">
            <ChatMediaPreview file={selectedFile} onClear={() => setSelectedFile(null)} />
            
            <CameraModal 
                isOpen={showCamera} 
                onClose={() => setShowCamera(false)} 
                onCapture={(file) => setSelectedFile(file)} 
            />

            <div className="flex items-end gap-3 relative">
                {/* Hidden Inputs */}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <input type="file" ref={imageInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                <div className="flex gap-1 mb-2">
                    <button
                        type="button"
                        onClick={() => imageInputRef.current.click()}
                        className="p-2 text-gray-400 hover:text-[#1F2BF3] transition-colors"
                        title="Send Image"
                    >
                        <PhotoIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCamera(true)}
                        className="p-2 text-gray-400 hover:text-[#1F2BF3] transition-colors"
                        title="Take Photo"
                    >
                        <CameraIcon className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="p-2 text-gray-400 hover:text-[#1F2BF3] transition-colors"
                        title="Send File"
                    >
                        <PaperClipIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 relative">
                    <textarea
                        rows="1"
                        value={value}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-5 py-4 pr-12 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all"
                    />
                    
                    <div className="absolute right-3 bottom-2.5">
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
                    onClick={handleSend}
                    disabled={!value.trim() && !selectedFile}
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
