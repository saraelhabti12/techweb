import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChatBubbleLeftRightIcon, 
    PaperAirplaneIcon, 
    UserGroupIcon, 
    PlusIcon, 
    XMarkIcon,
    ChevronLeftIcon,
    MagnifyingGlassIcon,
    InformationCircleIcon,
    UsersIcon
} from '@heroicons/react/24/outline';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Groups({ auth, groups: initialGroups, allUsers }) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groups, setGroups] = useState(initialGroups);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isMobileView, setIsMobileView] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
            if (selectedGroup) {
                fetchMessages(selectedGroup.id);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [selectedGroup]);

    const fetchMessages = async (groupId) => {
        try {
            const response = await axios.get(route('groups.messages', groupId));
            if (response.data.length !== messages.length) {
                setMessages(response.data);
            }
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };

    const handleGroupSelect = async (group) => {
        setSelectedGroup(group);
        setMessages([]);
        await fetchMessages(group.id);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedGroup) return;

        const messageText = newMessage;
        setNewMessage('');

        try {
            const response = await axios.post(route('groups.sendMessage', selectedGroup.id), {
                message: messageText
            });
            setMessages(prev => [...prev, response.data]);
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(route('groups.store'), {
                name: newGroupName,
                description: newGroupDescription,
                user_ids: selectedUsers
            });
            setGroups(prev => [...prev, response.data]);
            setShowCreateModal(false);
            setNewGroupName('');
            setNewGroupDescription('');
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error creating group", error);
        }
    };

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    const Layout = auth.user.role === 'admin' || auth.user.role === 'project_manager' 
        ? AdminLayout 
        : MemberLayout;

    return (
        <Layout auth={auth}>
            <Head title="Group Chat" />

            <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-gray-50 dark:bg-black">
                {/* Sidebar */}
                <div className={`${selectedGroup && isMobileView ? 'hidden' : 'flex'} w-full md:w-96 flex-col bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 z-20`}>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Communities</h2>
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="p-2.5 bg-[#1F2BF3] text-white rounded-xl hover:scale-105 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                            >
                                <PlusIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-100 dark:bg-gray-800/50 p-1 rounded-2xl">
                            <Link 
                                href={route('chat.index')}
                                className="flex-1 text-center text-xs font-black py-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white uppercase tracking-widest transition-all"
                            >
                                Direct
                            </Link>
                            <button className="flex-1 text-xs font-black py-2.5 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-[#1F2BF3] uppercase tracking-widest transition-all">
                                Groups
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1">
                        {groups.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <UserGroupIcon className="w-8 h-8" />
                                </div>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No groups active</p>
                            </div>
                        ) : (
                            groups.map(group => (
                                <motion.button
                                    whileHover={{ x: 4 }}
                                    key={group.id}
                                    onClick={() => handleGroupSelect(group)}
                                    className={`w-full p-4 rounded-3xl flex items-center transition-all duration-300 group ${
                                        selectedGroup?.id === group.id 
                                            ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-xl shadow-blue-500/25' 
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg mr-4 shadow-inner ${
                                        selectedGroup?.id === group.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                                    }`}>
                                        {group.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <div className={`font-black text-sm truncate ${selectedGroup?.id === group.id ? 'text-white' : 'group-hover:text-[#1F2BF3]'}`}>
                                            {group.name}
                                        </div>
                                        <div className={`text-[10px] uppercase tracking-widest font-black mt-0.5 ${selectedGroup?.id === group.id ? 'text-white/70' : 'text-gray-400'}`}>
                                            {group.users.length} Active Members
                                        </div>
                                    </div>
                                </motion.button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={`${!selectedGroup && isMobileView ? 'hidden' : 'flex'} flex-1 flex-col bg-white dark:bg-black relative`}>
                    {selectedGroup ? (
                        <>
                            {/* Chat Header */}
                            <div className="h-20 px-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {isMobileView && (
                                        <button 
                                            onClick={() => setSelectedGroup(null)}
                                            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                                        >
                                            <ChevronLeftIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                        {selectedGroup.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="font-black text-gray-900 dark:text-white tracking-tight truncate max-w-[200px] md:max-w-xs">{selectedGroup.name}</div>
                                        <div className="text-[10px] text-[#1F2BF3] font-black uppercase tracking-widest truncate max-w-[200px] md:max-w-xs">
                                            {selectedGroup.users.map(u => u.name).join(', ')}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                                        <InformationCircleIcon className="w-5 h-5" />
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
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Group Hub</h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Be the first to share an update with the team</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {messages.map((msg, index) => {
                                            const isMe = msg.user_id === auth.user.id;
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    key={index}
                                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                                >
                                                    {!isMe && (
                                                        <span className="text-[10px] font-black text-[#1F2BF3] uppercase tracking-widest mb-1.5 ml-2">{msg.user.name}</span>
                                                    )}
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
                                        placeholder={`Message #${selectedGroup.name.toLowerCase().replace(/\s/g, '-')}`}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner resize-none min-h-[60px] max-h-32 custom-scrollbar font-bold text-sm transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="absolute right-2.5 bottom-2.5 p-3 rounded-xl bg-[#1F2BF3] text-white shadow-xl shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all active:scale-95"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent dark:from-indigo-900/10 dark:via-transparent dark:to-transparent">
                            <div className="w-32 h-32 bg-white dark:bg-gray-900 rounded-[3rem] flex items-center justify-center mb-8 shadow-2xl border border-gray-100 dark:border-gray-800 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                <UserGroupIcon className="w-16 h-16 text-[#1F2BF3] group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4">Group Collaboration Hub</h3>
                            <p className="text-gray-400 font-bold max-w-sm leading-relaxed uppercase tracking-widest text-[10px]">
                                Coordinate with specific teams and stakeholders in dedicated real-time environments.
                            </p>
                            
                            <div className="mt-12 flex gap-8">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <PlusIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Create Room</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                        <UsersIcon className="w-6 h-6" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-gray-400">Invite Team</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/10"
                        >
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">New Hub</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Setup your collaboration space</p>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <XMarkIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGroup}>
                                <div className="p-8 space-y-8">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Room Identity</label>
                                        <input 
                                            type="text" 
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner font-bold text-sm"
                                            placeholder="e.g. Design Sprint Alpha"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Invite Members</label>
                                        <div className="max-h-56 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-3 custom-scrollbar border border-gray-100 dark:border-gray-800">
                                            {allUsers.map(user => (
                                                <div 
                                                    key={user.id}
                                                    onClick={() => toggleUserSelection(user.id)}
                                                    className={`flex items-center p-3.5 rounded-2xl cursor-pointer transition-all mb-1 ${
                                                        selectedUsers.includes(user.id) 
                                                            ? 'bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/20' 
                                                            : 'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    <div className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center mr-4 transition-colors ${
                                                        selectedUsers.includes(user.id) ? 'border-white bg-white' : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                        {selectedUsers.includes(user.id) && (
                                                            <div className="w-2.5 h-2.5 bg-[#1F2BF3] rounded-sm"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-black tracking-tight">{user.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                                    <button 
                                        type="submit"
                                        disabled={!newGroupName.trim() || selectedUsers.length === 0}
                                        className="w-full bg-[#1F2BF3] text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50 active:scale-95"
                                    >
                                        Initialize Hub Room
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
