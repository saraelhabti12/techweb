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

export default function Index({ auth, users }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [chatUsers, setChatUsers] = useState(users);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const fetchChatUsers = async () => {
        try {
            const response = await axios.get(route('chat.users'));
            setChatUsers(response.data);
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
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            const response = await axios.post(route('chat.store', selectedUser.id), {
                message: messageText
            });
            setMessages(prev => [...prev, response.data]);
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
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-inner overflow-hidden ${
                                                    selectedUser?.id === user.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                                                }`}>
                                                    {user.avatar ? (
                                                        <img src={`/storage/${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name.charAt(0)
                                                    )}
                                                </div>
                                                <span className="absolute -bottom-1 -right-1 block h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 bg-green-500"></span>
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
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 overflow-hidden">
                                            {selectedUser.avatar ? (
                                                <img src={`/storage/${selectedUser.avatar}`} alt={selectedUser.name} className="w-full h-full object-cover" />
                                            ) : (
                                                selectedUser.name.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg text-gray-900 dark:text-white tracking-tight">{selectedUser.name}</div>
                                            <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                                <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                                Online
                                            </div>
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
                                    <form onSubmit={sendMessage} className="flex items-end gap-3 relative group">
                                        <textarea
                                            rows="1"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage(e);
                                                }
                                            }}
                                            placeholder="Type your message..."
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-5 py-4 pr-16 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all group"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </button>
                                    </form>
                                    <div className="mt-3 text-center">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Press Enter to send, Shift + Enter for new line</span>
                                    </div>
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
