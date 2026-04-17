import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon, UsersIcon } from '@heroicons/react/24/outline';

import Avatar from '@/Components/UI/Avatar';
import UserStatus from '@/Components/UI/UserStatus';
import EmojiChatInput from '@/Components/UI/EmojiChatInput';

export default function Index({ auth, users }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState(users);
    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

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
            // Only update if messages length changed to avoid jumping
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
            // Preserve selected user state
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
        // We don't need to call markAsRead explicitly if fetchMessages handles it on backend
        // But for safety:
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
            fetchChatUsers(); // Refresh list to move user to top
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const Layout = auth.user.role === 'admin' || auth.user.role === 'project_manager' 
        ? AdminLayout 
        : MemberLayout;

    return (
        <Layout auth={auth}>
            <Head title="Team Chat" />

            <DashboardPage 
                title="Team Hub Chat"
                description="Secure, real-time messaging with your team and clients."
            >
                <DashboardCard className="!p-0 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-220px)] min-h-[600px] border-0 ring-1 ring-gray-100 dark:ring-gray-800">
                    {/* Sidebar - User List */}
                    <div className="w-full md:w-80 flex flex-col bg-gray-50/50 dark:bg-gray-900/20 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[#1F2BF3]">
                                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    </div>
                                    Chats
                                </h2>
                            </div>
                            <div className="flex bg-gray-200/50 dark:bg-gray-800 p-1 rounded-xl">
                                <button className="flex-1 text-xs font-bold py-2 px-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white transition-all">
                                    Direct
                                </button>
                                <Link 
                                    href={route('groups.index')}
                                    className="flex-1 text-center text-xs font-bold py-2 px-4 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                    Groups
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {chatUsers.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm italic font-medium">No contacts found.</div>
                            ) : (
                                chatUsers.map(user => (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={user.id}
                                        onClick={() => handleUserSelect(user)}
                                        className={`w-full p-3 rounded-2xl flex justify-between items-center transition-all duration-300 group ${
                                            selectedUser?.id === user.id 
                                                ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-lg shadow-blue-500/25' 
                                                : 'hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar user={user} size="md" />
                                                <div className="absolute -bottom-1 -right-1">
                                                    <UserStatus user={user} showText={false} className="border-2 border-white dark:border-gray-900 rounded-full bg-white dark:bg-gray-900" />
                                                </div>
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <div className={`font-bold truncate ${selectedUser?.id === user.id ? 'text-white' : 'group-hover:text-[#1F2BF3]'}`}>
                                                    {user.name}
                                                </div>
                                                <div className={`text-[10px] uppercase tracking-widest font-bold ${selectedUser?.id === user.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                    {user.role.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>
                                        {user.unread_count > 0 && (
                                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                                selectedUser?.id === user.id ? 'bg-white text-[#1F2BF3]' : 'bg-red-500 text-white shadow-md shadow-red-500/20'
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
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/50 relative">
                        {selectedUser ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <Avatar user={selectedUser} size="md" className="shadow-lg shadow-blue-500/20" />
                                        <div>
                                            <div className="font-black text-lg text-gray-900 dark:text-white tracking-tight">{selectedUser.name}</div>
                                            <UserStatus user={selectedUser} />
                                        </div>
                                    </div>
                                </div>

                                {/* Messages Container */}
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col space-y-6">
                                    {messages.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-[#1F2BF3]">
                                                <ChatBubbleLeftRightIcon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Say Hello!</h3>
                                            <p className="text-sm font-medium text-gray-400">Start the conversation with {selectedUser.name}.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = msg.sender_id === auth.user.id;
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={index}
                                                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                                                        <div
                                                            className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed ${
                                                                isMe
                                                                    ? 'bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white rounded-br-sm shadow-blue-500/20'
                                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-700'
                                                            }`}
                                                        >
                                                            {msg.message}
                                                        </div>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <div className="p-6 bg-white dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
                                    <EmojiChatInput 
                                        value={newMessage}
                                        onChange={setNewMessage}
                                        onSend={sendMessage}
                                        placeholder={`Message ${selectedUser.name}...`}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[url('/images/pattern-bg.png')] bg-cover bg-center bg-opacity-5">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#1F2BF3]/10 to-[#00D8C0]/10 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-900 shadow-xl">
                                    <UsersIcon className="w-10 h-10 text-[#1F2BF3]" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">Welcome to Hub Chat</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md">
                                    Select a team member or client from the sidebar to start collaborating in real-time.
                                </p>
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </DashboardPage>
        </Layout>
    );
}
