import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChatBubbleLeftRightIcon, 
    PaperAirplaneIcon, 
    UserGroupIcon, 
    PlusIcon, 
    XMarkIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Groups({ auth, groups: initialGroups, allUsers }) {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [groups, setGroups] = useState(initialGroups);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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
            setMessages(response.data);
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

            <DashboardPage 
                title="Collaborative Groups"
                description="Coordinate with specific teams and project stakeholders in dedicated group spaces."
            >
                <DashboardCard className="!p-0 overflow-hidden flex flex-col md:flex-row h-[calc(100vh-220px)] min-h-[600px] border-0 ring-1 ring-gray-100 dark:ring-gray-800">
                    {/* Sidebar */}
                    <div className="w-full md:w-80 flex flex-col bg-gray-50/50 dark:bg-gray-900/20 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3 uppercase tracking-tight">
                                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
                                        <UserGroupIcon className="w-5 h-5" />
                                    </div>
                                    Groups
                                </h2>
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="p-2 bg-[#1F2BF3] text-white rounded-xl hover:scale-110 transition-transform shadow-lg shadow-blue-500/25"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex bg-gray-200/50 dark:bg-gray-800 p-1 rounded-xl">
                                <Link 
                                    href={route('chat.index')}
                                    className="flex-1 text-center text-xs font-bold py-2 px-4 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
                                >
                                    Direct
                                </Link>
                                <button className="flex-1 text-xs font-bold py-2 px-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white transition-all">
                                    Groups
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
                            {groups.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm italic font-medium">No groups found.</div>
                            ) : (
                                groups.map(group => (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        key={group.id}
                                        onClick={() => handleGroupSelect(group)}
                                        className={`w-full p-4 rounded-2xl flex items-center transition-all duration-300 group ${
                                            selectedGroup?.id === group.id 
                                                ? 'bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-lg shadow-blue-500/25' 
                                                : 'hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg mr-4 shadow-inner ${
                                            selectedGroup?.id === group.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                            {group.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="text-left overflow-hidden">
                                            <div className={`font-bold truncate ${selectedGroup?.id === group.id ? 'text-white' : 'group-hover:text-[#1F2BF3]'}`}>
                                                {group.name}
                                            </div>
                                            <div className={`text-[10px] uppercase tracking-widest font-bold ${selectedGroup?.id === group.id ? 'text-white/70' : 'text-gray-400'}`}>
                                                {group.users.length} Active Members
                                            </div>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900/50">
                        {selectedGroup ? (
                            <>
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                                            {selectedGroup.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-black text-lg text-gray-900 dark:text-white tracking-tight">{selectedGroup.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-xs">
                                                {selectedGroup.users.map(u => u.name).join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/20 dark:bg-gray-950/10 custom-scrollbar flex flex-col space-y-6">
                                    {messages.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 text-[#1F2BF3]">
                                                <ChatBubbleLeftRightIcon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">Group Chat Started</h3>
                                            <p className="text-sm font-medium text-gray-400">Be the first one to send a message to this group.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isMe = msg.user_id === auth.user.id;
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={index}
                                                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                                >
                                                    {!isMe && (
                                                        <span className="text-[10px] font-black text-[#1F2BF3] uppercase tracking-widest mb-1.5 ml-2">{msg.user.name}</span>
                                                    )}
                                                    <div
                                                        className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm relative group ${
                                                            isMe
                                                                ? 'bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] text-white rounded-br-sm shadow-blue-500/20'
                                                                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                                                        }`}
                                                    >
                                                        <div className="text-sm font-medium leading-relaxed">{msg.message}</div>
                                                        <div className={`text-[9px] mt-2 text-right font-bold uppercase tracking-tighter ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

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
                                            placeholder="Message this group..."
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-2xl px-5 py-4 pr-16 focus:ring-2 focus:ring-[#1F2BF3] shadow-inner resize-none min-h-[56px] max-h-32 custom-scrollbar transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 bottom-2 p-2.5 rounded-xl bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mb-6 border-4 border-white dark:border-gray-900 shadow-xl">
                                    <UserGroupIcon className="w-10 h-10 text-[#1F2BF3]" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-3">Team Collaboration Hub</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md leading-relaxed">
                                    Select a collaborative group from the sidebar to coordinate with your team members in real-time.
                                </p>
                            </div>
                        )}
                    </div>
                </DashboardCard>
            </DashboardPage>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-800"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Create New Group</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <XMarkIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateGroup}>
                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Group Identity</label>
                                        <input 
                                            type="text" 
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm transition-all"
                                            placeholder="e.g. Creative Design Hub"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Brief Description</label>
                                        <textarea 
                                            value={newGroupDescription}
                                            onChange={(e) => setNewGroupDescription(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1F2BF3] shadow-sm transition-all"
                                            placeholder="What is the purpose of this group?"
                                            rows="2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Invite Members</label>
                                        <div className="max-h-48 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 custom-scrollbar border border-gray-100 dark:border-gray-700">
                                            {allUsers.map(user => (
                                                <div 
                                                    key={user.id}
                                                    onClick={() => toggleUserSelection(user.id)}
                                                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all ${
                                                        selectedUsers.includes(user.id) 
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-[#1F2BF3]' 
                                                            : 'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center mr-3 transition-colors ${
                                                        selectedUsers.includes(user.id) ? 'border-[#1F2BF3] bg-[#1F2BF3]' : 'border-gray-300'
                                                    }`}>
                                                        {selectedUsers.includes(user.id) && (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-bold">{user.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                    <DashboardButton 
                                        type="submit"
                                        disabled={!newGroupName.trim() || selectedUsers.length === 0}
                                        className="w-full"
                                    >
                                        Initialize Team Group
                                    </DashboardButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
