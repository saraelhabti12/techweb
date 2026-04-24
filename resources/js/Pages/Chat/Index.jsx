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
    EllipsisVerticalIcon
} from '@heroicons/react/24/outline';

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
    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
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
            if (selectedUser) {
                fetchMessages(selectedUser.id);
            }
            fetchChatUsers();
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedUser]);

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(route('chat.messages', userId));
            if (response.data.length !== messages.length) {
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
            if (selectedUser) {
                const updatedSelectedUser = response.data.find(u => u.id === selectedUser.id);
                if (updatedSelectedUser) {
                    setSelectedUser(updatedSelectedUser);
                }
            }
        } catch (error) {
            console.error("Error fetching chat users", error);
        }
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        setMessages([]);
        await fetchMessages(user.id);
        await axios.post(route('chat.markAsRead', user.id));
        fetchChatUsers();
        setTimeout(() => scrollToBottom("auto"), 100);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            const response = await axios.post(route('chat.store', selectedUser.id), {
                message: messageText
            });
            setMessages(prev => [...prev, response.data]);
            fetchChatUsers();
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const filteredUsers = chatUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const Layout = auth.user.role === 'admin' || auth.user.role === 'project_manager' 
        ? AdminLayout 
        : MemberLayout;

    return (
        <Layout auth={auth}>
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
                                    whileHover={{ x: 4 }}
                                    key={user.id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`w-full p-4 rounded-3xl flex justify-between items-center transition-all duration-300 group ${
                                        selectedUser?.id === user.id 
                                            ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-xl shadow-blue-500/25' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar user={user} size="lg" className={`ring-2 ${selectedUser?.id === user.id ? 'ring-white/20' : 'ring-transparent'}`} />
                                            <div className="absolute -bottom-1 -right-1">
                                                <UserStatus user={user} showText={false} className="border-2 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900" />
                                            </div>
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className={`font-black text-sm truncate ${selectedUser?.id === user.id ? 'text-white' : 'group-hover:text-[#1F2BF3]'}`}>
                                                {user.name}
                                            </div>
                                            <div className={`text-[10px] uppercase tracking-widest font-black mt-0.5 ${selectedUser?.id === user.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                {user.role.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    {user.unread_count > 0 && (
                                        <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                                            selectedUser?.id === user.id ? 'bg-white text-[#1F2BF3]' : 'bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/20'
                                        }`}>
                                            {user.unread_count}
                                        </span>
                                    )}
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
                                            onClick={() => setSelectedUser(null)}
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
                                            {selectedUser.is_online ? 'Active Now' : 'Offline'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                    </button>
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
                                                            className={`px-6 py-4 rounded-3xl shadow-sm text-sm font-bold leading-relaxed ${
                                                                isMe
                                                                    ? 'bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white rounded-br-none shadow-blue-500/20'
                                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-800'
                                                            }`}
                                                        >
                                                            {msg.message}
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-tighter text-gray-400 px-1">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
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
                            
                            <div className="mt-12 grid grid-cols-3 gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <PaperAirplaneIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Fast Delivery</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <UsersIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Secure Network</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <ChatBubbleLeftRightIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Real-time Sync</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
