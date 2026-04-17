import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import MemberLayout from "@/Layouts/MemberLayout";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";
import axios from "axios";
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';

export default function Chat({ admins = [], messages = [], admin = null }) {
  const [selectedAdmin, setSelectedAdmin] = useState(admin);
  const [messageList, setMessageList] = useState(messages);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { auth } = usePage().props;

  const [unreadCounts, setUnreadCounts] = useState({});
  const [contextMenu, setContextMenu] = useState(null);

  const handleRightClick = (e, message) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      message,
    });
  };

  const handleCopy = () => {
    if (contextMenu?.message?.message) {
      navigator.clipboard.writeText(contextMenu.message.message);
    }
    setContextMenu(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(route("member.teamhub.chat.delete", contextMenu.message.id));
      setMessageList((prev) =>
        prev.filter((msg) => msg.id !== contextMenu.message.id)
      );
    } catch (error) {
      console.error(error);
    }
    setContextMenu(null);
  };

  const { data, setData, processing, reset } = useForm({ message: "" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messageList]);

  useEffect(() => {
    setMessageList(messages);
    setSelectedAdmin(admin);
  }, [messages, admin]);

  useEffect(() => {
    const initialCounts = {};
    admins.forEach((a) => (initialCounts[a.id] = 0));
    setUnreadCounts(initialCounts);
  }, [admins]);

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const res = await axios.get(route("member.unreadCount"));
        const totalUnread = res.data.count;

        const updatedCounts = {};
        admins.forEach((a) => {
          updatedCounts[a.id] = totalUnread; 
        });

        setUnreadCounts(updatedCounts);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages non lus:", err);
      }
    };

    fetchUnreadCounts(); 
    const interval = setInterval(fetchUnreadCounts, 5000); 

    return () => clearInterval(interval);
  }, [admins]);

  const loadMessages = (admin) => {
    if (!admin) return;
    setIsLoading(true);
    axios
      .get(route("member.teamhub.chat.admin", admin.id))
      .then((res) => {
        setMessageList(res.data.messages || []);
        setIsLoading(false);
        axios.post(route("member.teamhub.chat.markAsRead", admin.id));
        setUnreadCounts((prev) => ({ ...prev, [admin.id]: 0 }));
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleAdminSelect = (admin) => {
    setSelectedAdmin(admin);
    loadMessages(admin);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!data.message.trim() || !selectedAdmin) return;
    try {
      const res = await axios.post(
        route("member.teamhub.chat.send", selectedAdmin.id),
        { message: data.message }
      );
      setMessageList((prev) => [...prev, res.data]);
      reset();
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAdmins = admins
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (unreadCounts[b.id] || 0) - (unreadCounts[a.id] || 0));

  return (
    <MemberLayout auth={auth}>
      <Head title="TeamHub Chat" />

      <DashboardPage 
        title="Admin Chat"
        description="Direct communication with studio administrators and support team."
        actions={
          <DashboardButton variant="secondary" onClick={() => window.history.back()}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </DashboardButton>
        }
      >
        <DashboardCard noHover className="p-0 overflow-hidden h-[calc(100vh-20rem)] flex">
          {/* Admins Sidebar */}
          <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col bg-gray-50/30 dark:bg-black/10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <DashboardInput
                placeholder="Search admins..."
                icon={MagnifyingGlassIcon}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {filteredAdmins.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-400 font-medium">No admins found</p>
                </div>
              ) : (
                filteredAdmins.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleAdminSelect(a)}
                    className={`w-full flex items-center p-4 rounded-2xl transition-all duration-300 ${
                      selectedAdmin?.id === a.id
                        ? 'bg-[#1F2BF3] text-white shadow-lg shadow-[#1F2BF3]/20'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {a.avatar ? (
                        <img
                          src={a.avatar.startsWith("http") ? a.avatar : `/storage/${a.avatar}`}
                          alt={a.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700"
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          selectedAdmin?.id === a.id ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                          <UserCircleIcon className={`h-6 w-6 ${
                            selectedAdmin?.id === a.id ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                      )}
                      {unreadCounts[a.id] > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white dark:ring-gray-900">
                          {unreadCounts[a.id]}
                        </span>
                      )}
                    </div>
                    <div className="ml-4 flex-1 text-left">
                      <p className={`text-sm font-bold truncate ${
                        selectedAdmin?.id === a.id ? 'text-white' : 'text-gray-900 dark:text-white'
                      }`}>
                        {a.name}
                      </p>
                      <p className={`text-[11px] font-medium truncate ${
                        selectedAdmin?.id === a.id ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {a.email}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white/50 dark:bg-black/5">
            {selectedAdmin ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedAdmin.avatar ? (
                      <img
                        src={selectedAdmin.avatar.startsWith("http") ? selectedAdmin.avatar : `/storage/${selectedAdmin.avatar}`}
                        alt={selectedAdmin.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-[#1F2BF3]/20"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <UserCircleIcon className="h-7 w-7 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                        {selectedAdmin.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-500">
                        {selectedAdmin.email}
                      </p>
                    </div>
                  </div>
                  <a href={route("member.teamhub.index")}>
                    <DashboardButton variant="secondary" className="px-4 py-2">
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Activities
                    </DashboardButton>
                  </a>
                </div>

                {/* Messages Container */}
                <div 
                  className="flex-1 overflow-y-auto p-8 space-y-6"
                  onClick={() => setContextMenu(null)}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1F2BF3]"></div>
                    </div>
                  ) : messageList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <ChatBubbleLeftRightIcon className="h-16 w-16 mb-4 text-gray-200 dark:text-gray-800" />
                      <h4 className="text-lg font-black text-gray-300 dark:text-gray-700 uppercase tracking-tighter">No messages yet</h4>
                      <p className="text-sm text-gray-400 font-medium">Start a conversation with {selectedAdmin.name}</p>
                    </div>
                  ) : (
                    messageList.map((m) => (
                      <div
                        key={m.id}
                        onContextMenu={(e) => handleRightClick(e, m)}
                        className={`flex ${
                          m.user_id === selectedAdmin.id ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div className={`flex flex-col ${m.user_id === selectedAdmin.id ? 'items-start' : 'items-end'} max-w-[70%]`}>
                          <div className={`px-6 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                            m.user_id === selectedAdmin.id
                              ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                              : 'bg-[#1F2BF3] text-white rounded-br-none'
                          }`}>
                            {m.message}
                          </div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 px-1">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  Select an admin
                </h3>
                <p className="text-sm font-medium text-gray-500 max-w-xs">
                  Choose an administrator from the sidebar to start a real-time conversation.
                </p>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Context Menu */}
        {contextMenu && (
          <div
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
              position: 'fixed',
            }}
            className="bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 rounded-2xl z-50 py-2 w-48 backdrop-blur-xl overflow-hidden"
            onMouseLeave={() => setContextMenu(null)}
          >
            <button
              onClick={handleCopy}
              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
            >
              Copier
            </button>

            <button
              onClick={handleDelete}
              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left transition-colors"
            >
              Supprimer
            </button>
          </div>
        )}
      </DashboardPage>
    </MemberLayout>
  );
}






