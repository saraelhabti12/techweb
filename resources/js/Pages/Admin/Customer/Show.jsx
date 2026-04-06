import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from "react";
import ReplyModal from "./ReplyModal";
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ message }) {
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <AdminLayout title="Message Detail">
      <div className="p-16 bg-gray-500/30 rounded-xl shadow-lg border-2 border-purple-200 max-w-3xl mx-auto">
        
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-gray-900">{message.full_name}</h2>

        <div className="text-sm text-gray-900 mb-10 space-y-5">
            <p>📧 <strong>Email:</strong> {message.email}</p>
            <p>📞 <strong>Phone:</strong> {message.contact_number}</p>
            <p>🏢 <strong>Company:</strong> {message.company_name || "—"}</p>
            <p>🗓️ <strong>Date:</strong> {new Date(message.created_at).toLocaleString()}</p>
        </div>

        <div className="p-6 mb-8 rounded-lg border border-purple-300 shadow-inner">
          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{message.message}</p>
        </div>

        {message.services?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-purple-600 mb-2">Services demandés :</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {message.services.map((srv, i) => (
                <li key={i}>{srv}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => setReplyOpen(true)}
            className="px-6 py-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Reply to the message
          </button>
        </div>
      </div>

      <ReplyModal
        open={replyOpen}
        onClose={() => setReplyOpen(false)}
        customerEmail={message.email}
      />
    </AdminLayout>
  );
}
