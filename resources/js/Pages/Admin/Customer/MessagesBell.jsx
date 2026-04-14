import { useState } from 'react';
import { Link } from '@inertiajs/react';
import ReplyModal from './ReplyModal';

export default function MessagesBell({ unreadCount = 0, messages = [] }) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyTo, setReplyTo] = useState('');

  const handleReplyClick = (email) => {
    setReplyTo(email);
    setModalOpen(true);
  };

  const safeMessages = Array.isArray(messages) ? messages : [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 7 8.388 7 11v3.159c0 .538-.214 1.055-.595 1.436L5 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex min-w-[16px] h-4 items-center justify-center px-0.5 text-[10px] font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
          {safeMessages.length === 0 ? (
            <div className="p-4 text-gray-500">No messages</div>
          ) : (
            safeMessages.map(msg => (
              <Link
                key={msg?.id || Math.random()}
                href={(msg && msg.id && typeof route === 'function' && route().has('admin.customers.show')) ? route('admin.customers.show', msg.id) : '#'}
                className={`block px-4 py-3 border-b hover:bg-gray-100 ${msg?.is_read ? 'bg-gray-50 text-gray-500' : 'bg-white font-bold'}`}
              >
                <div className="flex justify-between items-center">
                  <span>{(msg?.full_name || 'Anonymous')} - {(msg?.subject || 'No Subject')}</span>
                  <span className="text-xs text-gray-400">
                    {msg?.created_at ? new Date(msg.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <p className="truncate mt-1">{msg?.message || ''}</p>
                <div className="mt-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation(); 
                      if (msg?.email) window.location.href = `mailto:${msg.email}`;
                    }}
                    className="text-[#8000FF] text-xs underline "
                  >
                    view
                  </button>
                </div>
              </Link>

            ))
          )}
        </div>
      )}
    </div>
  );
}
