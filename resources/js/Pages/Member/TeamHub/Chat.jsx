import React, { useState, useEffect, useRef } from "react";
import { Head, useForm } from "@inertiajs/react";
import MemberLayout from "@/Layouts/MemberLayout";
import { usePage } from "@inertiajs/react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";


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

      <div
        className="flex h-[calc(100vh-4rem)] bg-transparent bg-center bg-contain bg-no-repeat"
        style={{ backgroundImage: "url('/images/blog2.jpg')" }}
      >
        <div className="w-1/3 bg-white/10 border-r border-purple-200 flex flex-col shadow-lg rounded-l-2xl">
          <div className="p-4 border-b border-gray-300">
            <h2 className="text-xl font-bold text-purple-800 mb-4">
              Administrators
            </h2>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500" />
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-purple-300 rounded-2xl bg-gray-200/30 text-purple-900 placeholder-purple-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredAdmins.length === 0 ? (
              <div className="p-4 text-center text-purple-500">
                {searchTerm ? "No admins found" : "No admins available"}
              </div>
            ) : (
              filteredAdmins.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleAdminSelect(a)}
                  className={`w-full flex items-center p-3 rounded-2xl transition-transform transform hover:scale-105 ${
                    selectedAdmin?.id === a.id
                      ? "bg-purple-200/30 border-purple-400 shadow-inner"
                      : "hover:bg-purple-100/20"
                  }`}
                >
                  <div className="flex-shrink-0 relative">

                {a.avatar ? (
        <img
          src={a.avatar.startsWith("http") ? a.avatar : `/storage/${a.avatar}`}
          alt={a.name}
          className="h-10 w-10 rounded-full object-cover shadow-sm"
        />
      ) : (
        <UserCircleIcon className="h-10 w-10 text-purple-500" />
      )}
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{a.name}</p>
        <p className="text-xs text-purple-600 truncate">{a.email}</p>
      </div>
      {unreadCounts[a.id] > 0 && (
        <span className="ml-auto inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-purple-500 rounded-full">
          {unreadCounts[a.id]}
        </span>
      )}
      </button>

              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedAdmin ? (
            <>
              <div className="bg-gray-100/40 border-b border-gray-300 p-4 flex items-center justify-between shadow-inner rounded-tr-2xl">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {selectedAdmin.avatar ? (
                      <img
                        src={
                          selectedAdmin.avatar.startsWith("http")
                            ? selectedAdmin.avatar
                            : `/storage/${selectedAdmin.avatar}`
                        }
                        alt={selectedAdmin.name}
                        className="h-10 w-10 rounded-full object-cover shadow-sm"
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-purple-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedAdmin.name}
                    </h3>
                    <p className="text-sm text-gray-700">
                      {selectedAdmin.email}
                    </p>
                  </div>
                </div>
                <a
                  href={route("member.teamhub.index")}
                  className="flex items-center px-3 py-2 text-sm text-purple-700 hover:text-purple-900 hover:bg-gray-200/30 rounded-xl transition-colors"
                >
                  <EyeIcon className="h-4 w-4 mr-2" /> View Activities
                </a>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/10 rounded-xl">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : messageList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-purple-500">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 mb-4" />
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  messageList.map((m) => (
                    <div
                      key={m.id}
                      onContextMenu={(e) => handleRightClick(e, m)}
                      className={`flex ${
                        m.user_id === selectedAdmin.id
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md ${
                          m.user_id === selectedAdmin.id
                            ? "bg-gray-100/30 text-purple-900"
                            : "bg-purple-500/80 text-white"
                        }`}
                      >
                        <p className="text-sm">{m.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            m.user_id === selectedAdmin.id
                              ? "text-purple-700"
                              : "text-purple-200"
                          }`}
                        >
                          {new Date(m.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-gray-100/40 backdrop-blur-lg border-t border-gray-300 p-4 flex items-center rounded-br-2xl">
                <form onSubmit={sendMessage} className="flex w-full space-x-4">
                  <input
                    type="text"
                    value={data.message}
                    onChange={(e) => setData("message", e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-purple-300 rounded-2xl bg-gray-200/30 text-purple-900 placeholder-purple-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-md"
                    disabled={processing}
                  />
                  <button
                    type="submit"
                    disabled={processing || !data.message.trim()}
                    className="px-4 py-2 bg-purple-600/80 text-white rounded-2xl hover:bg-purple-700/90 disabled:opacity-50 flex items-center space-x-2 transition-transform transform hover:scale-105"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-100/30 backdrop-blur-lg rounded-tr-2xl rounded-br-2xl">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-purple-900 mb-2">
                  Select an administrator to start chatting
                </h3>
                <p className="text-purple-700">
                  Choose an admin from the list to begin your conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div
          className="absolute bg-white shadow-lg border rounded-md z-50 py-1"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
          }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={handleCopy}
            className="block px-4 py-1 text-sm hover:bg-gray-100 w-full text-left"
          >
            Copier
          </button>
          <button
            onClick={handleDelete}
            className="block px-4 py-1 text-sm hover:bg-red-100 w-full text-left text-red-500"
          >
            Supprimer
          </button>
        </div>
      )}
    </MemberLayout>
  );
}






