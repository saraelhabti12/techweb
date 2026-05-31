import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChatBubbleLeftRightIcon, 
    PaperAirplaneIcon, 
    UsersIcon, 
    ChevronLeftIcon,
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    ArrowDownTrayIcon,
    PhotoIcon,
    DocumentIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';

import Avatar from '@/Components/UI/Avatar';
import UserStatus from '@/Components/UI/UserStatus';
import EmojiChatInput from '@/Components/UI/EmojiChatInput';

export default function Index({ auth, users }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState(users);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileView, setIsMobileView] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const messagesEndRef = useRef(null);
    const selectedUserRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'nearest' });
        }
    };

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (selectedUserRef.current) {
                fetchMessages(selectedUserRef.current.id);
            }
            fetchChatUsers();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(route('chat.messages', userId));
            // Only update if it's still the same user we intended to fetch for
            if (selectedUserRef.current?.id === userId && JSON.stringify(response.data) !== JSON.stringify(messages)) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const fetchChatUsers = async () => {
        try {
            const response = await axios.get(route('chat.users'));
            setChatUsers(response.data);
            if (selectedUserRef.current) {
                const updatedSelectedUser = response.data.find(u => u.id === selectedUserRef.current.id);
                if (updatedSelectedUser) {
                    selectedUserRef.current = updatedSelectedUser;
                    setSelectedUser(updatedSelectedUser);
                }
            }
        } catch (error) {
            console.error("Error fetching chat users", error);
        }
    };

    const handleUserSelect = async (user) => {
        selectedUserRef.current = user;
        setSelectedUser(user);
        setMessages([]);
        await fetchMessages(user.id);
        await axios.post(route('chat.markAsRead', user.id));
        fetchChatUsers();
        setTimeout(() => scrollToBottom("auto"), 100);
    };

    const sendMessage = async (file = null) => {
        if (!newMessage.trim() && !file) return;

        const formData = new FormData();
        formData.append('message', newMessage);
        if (file) {
            formData.append('file', file);
            formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');
        } else {
            formData.append('type', 'text');
        }

        setNewMessage('');

        try {
            const response = await axios.post(route('chat.store', selectedUserRef.current.id), formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prev => [...prev, response.data]);
            fetchChatUsers();
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const handleTyping = async (isTyping) => {
        if (!selectedUserRef.current) return;
        try {
            await axios.post(route('chat.setTyping', selectedUserRef.current.id), { is_typing: isTyping });
        } catch (error) {
            console.error("Error setting typing status", error);
        }
    };

    const filteredUsers = chatUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const PageLayout = auth.user.role === 'admin' || auth.user.role === 'project_manager' 
        ? AdminLayout 
        : MemberLayout;

    return (
        <PageLayout auth={auth} mainClassName="overflow-hidden" contentClassName="p-0">
            <Head title="Team Chat" />

            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50 dark:bg-black">
                {/* Sidebar - User List */}
                <div className={`${selectedUser && isMobileView ? 'hidden' : 'flex'} w-full md:w-96 flex-col bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 z-20`}>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Messages</h2>
                            <div className="flex gap-2">
                                <Link 
                                    href={route('groups.index')}
                                    className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-[#1F2BF3] transition-all"
                                    title="Groups"
                                >
                                    <UsersIcon className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative group">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search contacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1F2BF3] transition-all"
                            />
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-2xl">
                            <button className="flex-1 text-xs font-black py-2.5 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-[#1F2BF3] uppercase tracking-widest transition-all">
                                Direct
                            </button>
                            <Link 
                                href={route('groups.index')}
                                className="flex-1 text-center text-xs font-black py-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-all"
                            >
                                Groups
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
                        {filteredUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <UsersIcon className="w-8 h-8" />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No contacts found</p>
                            </div>
                        ) : (
                            filteredUsers.map(user => (
                                <motion.button
                                    type="button"
                                    whileHover={{ x: 4 }}
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full p-4 rounded-3xl flex justify-between items-center transition-all duration-300 group ${
                                        selectedUser?.id === user.id 
                                            ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-xl shadow-blue-500/25' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="relative shrink-0">
                                            <Avatar user={user} size="lg" className={`ring-2 ${selectedUser?.id === user.id ? 'ring-white/20' : 'ring-transparent'}`} />
                                            <div className="absolute -bottom-1 -right-1">
                                                <UserStatus user={user} showText={false} className="border-2 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900" />
                                            </div>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className={`font-black text-sm truncate ${selectedUser?.id === user.id ? 'text-white' : 'group-hover:text-[#1F2BF3]'}`}>
                                                {user.name}
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                {user.is_typing ? (
                                                    <span className={`text-[10px] font-black uppercase tracking-widest animate-pulse ${selectedUser?.id === user.id ? 'text-white' : 'text-[#00D8C0]'}`}>Typing...</span>
                                                ) : (
                                                    <div className={`text-[10px] uppercase tracking-widest font-black truncate ${selectedUser?.id === user.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                        {user.latest_message ? (
                                                            <span className="flex items-center gap-1">
                                                                {user.latest_message.is_me && (
                                                                    <CheckIcon className={`w-3 h-3 ${user.latest_message.is_read ? 'text-blue-400' : 'text-gray-400'}`} />
                                                                )}
                                                                {user.latest_message.type === 'image' ? '📷 Photo' : user.latest_message.type === 'file' ? '📁 File' : user.latest_message.content}
                                                            </span>
                                                        ) : user.role.replace('_', ' ')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 shrink-0">
                                        {user.latest_message && (
                                            <span className={`text-[9px] font-bold ${selectedUser?.id === user.id ? 'text-white/60' : 'text-gray-400'}`}>
                                                {new Date(user.latest_message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                        {user.unread_count > 0 && (
                                            <span className={`text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full ${
                                                selectedUser?.id === user.id ? 'bg-white text-[#1F2BF3]' : 'bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/20'
                                            }`}>
                                                {user.unread_count}
                                            </span>
                                        )}
                                    </div>
                                </motion.button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`${!selectedUser && isMobileView ? 'hidden' : 'flex'} flex-1 flex-col bg-white dark:bg-black relative`}>
                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 px-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {isMobileView && (
                                        <button 
                                            onClick={() => {
                                                setSelectedUser(null);
                                                selectedUserRef.current = null;
                                            }}
                                            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                        >
                                            <ChevronLeftIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    <div className="relative">
                                        <Avatar user={selectedUser} size="md" className="shadow-lg shadow-blue-500/20" />
                                        <div className="absolute -bottom-1 -right-1">
                                            <div className={`w-3 h-3 rounded-full border-2 border-white dark:border-black ${selectedUser.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-black text-gray-900 dark:text-white tracking-tight">{selectedUser.name}</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3]">
                                            {selectedUser.is_typing ? (
                                                <span className="text-[#00D8C0] animate-pulse">Typing...</span>
                                            ) : selectedUser.is_online ? (
                                                'Active Now'
                                            ) : (
                                                `Last seen: ${selectedUser.last_seen_formatted}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 relative">
                                    <button 
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                                    >
                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                    </button>
                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <>
                                                <div 
                                                    className="fixed inset-0 z-40" 
                                                    onClick={() => setShowUserMenu(false)}
                                                ></div>
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50"
                                                >
                                                    <button 
                                                        onClick={() => {
                                                            setShowUserMenu(false);
                                                            // Clear messages logic can go here if needed
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        Clear Chat History
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setShowUserMenu(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                    >
                                                        Block User
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-6 bg-gray-50/30 dark:bg-gray-900/10">
                                {messages.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-[#1F2BF3] animate-bounce">
                                            <ChatBubbleLeftRightIcon className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Say Hello!</h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Start the conversation with {selectedUser.name}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {messages.map((msg, index) => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    key={index}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div
                                                            className={`rounded-3xl shadow-sm text-sm font-bold leading-relaxed overflow-hidden ${
                                                                isMe
                                                                    ? 'bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white rounded-br-none shadow-blue-500/20'
                                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-800'
                                                            }`}
                                                        >
                                                            {msg.type === 'image' && (
                                                                <div className="relative group">
                                                                    <img src={msg.file_url} alt="Shared" className="max-w-full h-auto max-h-80 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                                                                    <a 
                                                                        href={msg.file_url} 
                                                                        download={msg.file_name}
                                                                        className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    >
                                                                        <ArrowDownTrayIcon className="w-8 h-8 text-white" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                            
                                                            {msg.type === 'file' && (
                                                                <div className={`p-4 flex items-center gap-3 ${isMe ? 'bg-black/10' : 'bg-gray-50 dark:bg-gray-900/50'}`}>
                                                                    <div className="p-2 rounded-xl bg-white dark:bg-gray-800 text-[#1F2BF3]">
                                                                        <DocumentIcon className="w-6 h-6" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="truncate text-sm font-bold">{msg.file_name}</p>
                                                                        <p className={`text-[10px] font-black uppercase tracking-widest ${isMe ? 'text-white/70' : 'text-gray-400'}`}>File Attachment</p>
                                                                    </div>
                                                                    <a 
                                                                        href={msg.file_url} 
                                                                        download={msg.file_name}
                                                                        className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${isMe ? 'text-white' : 'text-gray-400'}`}
                                                                    >
                                                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                                                    </a>
                                                                </div>
                                                            )}

                                                            {(msg.type === 'text' || (msg.type !== 'text' && msg.message !== msg.file_name)) && (
                                                                <div className="px-6 py-4">
                                                                    {msg.message}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 px-1">
                                                            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400">
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMe && (
                                                                <div className="flex">
                                                                    <CheckIcon className={`w-3 h-3 ${msg.is_read ? 'text-blue-500' : 'text-gray-400'}`} />
                                                                    <CheckIcon className={`w-3 h-3 -ml-2 ${msg.is_read ? 'text-blue-500' : 'text-gray-400'}`} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="p-6 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800">
                                <EmojiChatInput 
                                    value={newMessage}
                                    onChange={setNewMessage}
                                    onSend={sendMessage}
                                    onTyping={handleTyping}
                                    placeholder={`Write your message to ${selectedUser.name.split(' ')[0]}...`}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent dark:from-blue-900/10 dark:via-transparent dark:to-transparent">
                            <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <ChatBubbleLeftRightIcon className="w-16 h-16 text-[#1F2BF3] group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Select a Conversation</h3>
                            <p className="text-gray-400 font-bold max-w-sm leading-relaxed uppercase tracking-widest text-[10px]">
                                Choose a team member or client from the sidebar to start a secure real-time collaboration session.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    );
}
