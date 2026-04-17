import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { 
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';

export default function Chat({ members = [], auth }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [unreadCounts, setUnreadCounts] = useState({});

  const { data, setData, post, processing, reset } = useForm({
    message: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await axios.get(route('admin.unreadCount'));
        setUnreadCounts(res.data);
      } catch (err) {
        console.error("Erreur chargement messages non lus :", err);
      }
    };

    fetchUnreadCounts(); 
    const interval = setInterval(fetchUnreadCounts, 5000); 

    return () => clearInterval(interval);
  }, []);

  const loadMessages = (user) => {
    if (!user) return;
    setIsLoading(true);
    
    router.get(route('admin.teamhub.chat.user', user.id), {}, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setMessages(page.props.messages || []);
        setSelectedUser(page.props.user || user);
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('Error loading messages:', errors);
        setIsLoading(false);
      }
    });
  };

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    setUnreadCounts(prev => ({ ...prev, [user.id]: 0 }));
    try {
      await axios.post(route('admin.markAsRead', user.id));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu :', error);
    }
    loadMessages(user);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!data.message.trim() || !selectedUser) return;
    try {
      const res = await axios.post(route('admin.teamhub.chat.send', selectedUser.id), data, {
        headers: {
          'Accept': 'application/json'
        }
      });
      setMessages(prev => [...prev, res.data]);
      reset();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    messageId: null,
  });

  return (
    <AdminLayout auth={auth}>
      <Head title="TeamHub Chat" />
      
      <DashboardPage 
        title="TeamHub Chat"
        description="Connect with your team members in real-time."
        actions={
          <DashboardButton variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Retour
          </DashboardButton>
        }
      >
        <DashboardCard noHover className="p-0 overflow-hidden h-[calc(100vh-20rem)] flex">
          {/* Members Sidebar */}
          <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/30 dark:bg-black/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <DashboardInput
                placeholder="Search members..."
                icon={MagnifyingGlassIcon}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400 font-medium">No members found</p>
                </div>
              ) : (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleUserSelect(member)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${
                      selectedUser?.id === member.id
                        ? 'bg-[#1F2BF3] text-white shadow-lg shadow-[#1F2BF3]/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {member.avatar ? (
                        <img
                          src={`/storage/${member.avatar}`}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          selectedUser?.id === member.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <UserCircleIcon className={`h-6 w-6 ${
                            selectedUser?.id === member.id ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                      )}
                      {unreadCounts[member.id] > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-gray-900">
                          {unreadCounts[member.id]}
                        </span>
                      )}
                    </div>
                    <div className="ml-4 flex-1 text-left">
                      <p className={`text-sm font-bold truncate ${
                        selectedUser?.id === member.id ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {member.name}
                      </p>
                      <p className={`text-[11px] font-medium truncate ${
                        selectedUser?.id === member.id ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {member.email}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white/50 dark:bg-black/5">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedUser.avatar ? (
                      <img
                        src={`/storage/${selectedUser.avatar}`}
                        alt={selectedUser.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-[#1F2BF3]/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <UserCircleIcon className="h-7 w-7 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        {selectedUser.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div 
                  className="flex-1 overflow-y-auto p-8 space-y-6"
                  onClick={() => setContextMenu({ ...contextMenu, visible: false })}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F2BF3]"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ChatBubbleLeftRightIcon className="h-16 w-16 mb-4 text-gray-200 dark:text-gray-800" />
                      <h4 className="text-lg font-black text-gray-300 dark:text-gray-700 uppercase tracking-tighter">No messages yet</h4>
                      <p className="text-sm text-gray-400 font-medium">Start a conversation with {selectedUser.name}</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setContextMenu({
                            visible: true,
                            x: e.clientX,
                            y: e.clientY,
                            messageId: message.id,
                          });
                        }}
                        className={`flex ${
                          message.user_id === selectedUser.id ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div className={`flex flex-col ${message.user_id === selectedUser.id ? 'items-start' : 'items-end'} max-w-[70%]`}>
                          <div className={`px-6 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                            message.user_id === selectedUser.id
                              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                              : 'bg-[#1F2BF3] text-white rounded-br-none'
                          }`}>
                            {message.message}
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-1">
                            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                  <form onSubmit={sendMessage} className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        placeholder="Type your message..."
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                        disabled={processing}
                      />
                    </div>
                    <DashboardButton
                      type="submit"
                      disabled={processing || !data.message.trim()}
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </DashboardButton>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center mb-6">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                  Select a team member
                </h3>
                <p className="text-sm font-medium text-gray-500 max-w-xs">
                  Choose someone from the sidebar to start a real-time conversation.
                </p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Context Menu */}
        {contextMenu.visible && (
          <div
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              position: 'fixed',
            }}
            className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-2xl z-50 py-2 w-48 backdrop-blur-xl overflow-hidden"
            onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
          >
            <button
              onClick={() => {
                const msg = messages.find((m) => m.id === contextMenu.messageId);
                if (msg) navigator.clipboard.writeText(msg.message);
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
            >
              Copier
            </button>

            <button
              onClick={async () => {
                try {
                  await axios.delete(route('admin.teamhub.chat.delete', contextMenu.messageId));
                  setMessages((prev) =>
                    prev.filter((m) => m.id !== contextMenu.messageId)
                  );
                } catch (err) {
                  console.error(err);
                }
                setContextMenu({ ...contextMenu, visible: false });
              }}
              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left transition-colors"
            >
              Supprimer
            </button>
          </div>
        )}
      </DashboardPage>
    </AdminLayout>
  );
}

