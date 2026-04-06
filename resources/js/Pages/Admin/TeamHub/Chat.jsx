import React, { useState, useEffect, useRef } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import axios from 'axios';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

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
    <AdminLayout  auth={auth} title="TeamHub Chat">
      <Head title="TeamHub Chat" />
      <div
        className="w-full h-[calc(100vh-4rem)] bg-transparent bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: "url('/images/blog2.jpg')", 
        }}
      >
      <div className="flex h-[100vh] bg-gray-500/20">
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col bg-gray-200/20">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-purple-700 mb-4">Team Members</h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredMembers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'No members found' : 'No members available'}
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleUserSelect(member)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${
                      selectedUser?.id === member.id
                        ? 'bg-purple-100 border-purple-200'
                        : 'hover:bg-purple-50'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {member.avatar ? (
                        <img
                          src={member.avatar ? `/storage/${member.avatar}` : ''}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-10 w-10 text-purple-400" />
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0 ">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {member.email}
                      </p>
                    </div>
                    {unreadCounts[member.id] > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full">
                        {unreadCounts[member.id]}
                      </span>
                    )}

                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex flex-col bg-gray-500/20">
          {selectedUser ? (
            <>
              <div className="bg-white border-b border-gray-200 p-4 bg-purple-600/50">
                {selectedUser && (
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar ? `/storage/${selectedUser.avatar}` : ''}
                        alt={selectedUser.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-purple-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedUser.name || 'User'}
                    </h3>
                    <p className="text-sm text-gray-900">
                      {selectedUser.email || 'No email available'}
                    </p>
                  </div>
                </div>
                )}
              </div>
  <div
    className="flex-1 overflow-y-auto p-4 space-y-4 relative"
    onClick={() => setContextMenu({ ...contextMenu, visible: false })} 
  >
    {isLoading ? (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    ) : messages.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4 text-purple-400" />
        <p>No messages yet. Start a conversation!</p>
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
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg cursor-pointer ${
              message.user_id === selectedUser.id
                ? 'bg-white text-purple-700'
                : 'bg-purple-500 text-white'
            }`}
          >
            <p className="text-sm">{message.message}</p>
            <p
              className={`text-xs mt-1 ${
                message.user_id === selectedUser.id ? 'text-gray-500' : 'text-purple-100'
              }`}
            >
              {new Date(message.created_at).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))
    )}
  {contextMenu.visible && (
    <div
      style={{
        top: contextMenu.y,
        left: contextMenu.x,
        position: 'fixed',
      }}
      className="bg-white shadow-lg border rounded-md z-50 py-1 w-32"
      onMouseLeave={() => setContextMenu({ ...contextMenu, visible: false })}
    >
      <button
        onClick={() => {
          const msg = messages.find((m) => m.id === contextMenu.messageId);
          if (msg) navigator.clipboard.writeText(msg.message);
          setContextMenu({ ...contextMenu, visible: false });
        }}
        className="block px-4 py-1 text-sm hover:bg-gray-100 w-full text-left"
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
        className="block px-4 py-1 text-sm hover:bg-red-100 w-full text-left text-red-500"
      >
        Supprimer
      </button>
    </div>
  )}

  <div ref={messagesEndRef} />
</div>

              <div className="bg-white border-t border-gray-200 p-4">
                <form onSubmit={sendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={processing}
                  />
                  <button
                    type="submit"
                    disabled={processing || !data.message.trim()}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-purple-50">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a team member to start chatting
                </h3>
                <p className="text-gray-500">
                  Choose someone from the list to begin your conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </AdminLayout>
  );
}

