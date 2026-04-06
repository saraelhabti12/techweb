import React from 'react';
import { router ,Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Show({ item, auth }) {
  return (
    <AdminLayout auth={auth} header={`Team Hub - ${item.title}`}>
      <div className="max-w-4xl mx-auto bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 p-6 rounded-2xl shadow-lg border-2 border-purple-500 flex flex-col space-y-6">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-700">{item.title}</h2>
          <p className="text-sm text-purple-500 mt-1">Publié par {item.admin?.name}</p>
        </div>
        <div className="text-purple-600 text-base text-center">{item.content}</div>
        {item.files && item.files.length > 0 && (
          <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
            {item.files.map((file) => (
              <div key={file.id} className="flex flex-col items-center border-2 border-purple-500 p-2 rounded-lg">
                {file.file_path.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                  <img
                    src={`/storage/${file.file_path}`}
                    alt={file.file_name}
                    className="h-40 w-full object-contain rounded-lg mb-2 border-2 border-purple-500 transition-transform transform hover:scale-105"
                  />
                )}
                <a
                  href={`/storage/${file.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-purple-700 hover:text-purple-900 underline text-sm text-center break-words"
                >
                  {file.file_name}
                </a>
              </div>
            ))}
          </div>
        )}

        {!item.files || item.files.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-purple-500 rounded-xl bg-purple-100 text-gray-500 text-sm">
            No files
          </div>
        )}
        <div className="mt-4">
          <h3 className="font-semibold text-purple-700 mb-3 text-center">Messages</h3>
          <div className="space-y-3">
            {item.messages.map((m) => (
              <div key={m.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="text-sm font-medium text-gray-700">{m.user?.name}</div>
                <div className="text-sm text-gray-600">{m.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(m.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

