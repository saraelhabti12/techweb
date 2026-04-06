import React from 'react';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, User, Mail, Shield, Calendar } from 'lucide-react';
import AvatarUploader from '@/Components/Admin/AvatarUploader';

export default function Show({ member, auth }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this member?')) {
      await fetch(`/members/${member.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
      }).then(() => window.location.href = '/members');
    }
  };

  return (
    <AdminLayout auth={auth} header="Members Management">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 shadow">
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Member Details
            </h1>
          </div>

          <div className="flex justify-center mb-6">
            <AvatarUploader user={member} />
          </div>

          <div className="space-y-4 text-gray-900 dark:text-gray-200">
            <p>
              <span className="font-semibold text-gray-900 dark:text-gray-300 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" /> Full Name:
              </span>
              <span className="ml-7 text-gray-900 dark:text-gray-100">{member.name}</span>
            </p>

            <p>
              <span className="font-semibold text-gray-900 dark:text-gray-300 flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" /> Email:
              </span>
              <span className="ml-7 text-gray-900 dark:text-gray-100">{member.email}</span>
            </p>

            <p>
              <span className="font-semibold text-gray-900 dark:text-gray-300 flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" /> Role:
              </span>
              <span className="ml-7 text-gray-900 dark:text-gray-100">
                {member.is_admin ? 'Admin' : 'Member'}
              </span>
            </p>

            <p>
              <span className="font-semibold text-gray-900 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" /> Created At:
              </span>
              <span className="ml-7 text-gray-900 dark:text-gray-100">
                {new Date(member.created_at).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <Link
              href={`/members/${member.id}/edit`}
              className="inline-flex items-center px-8 py-3 
                         bg-purple-600 border border-transparent rounded-md 
                         font-semibold text-xs text-white uppercase tracking-widest 
                         hover:bg-purple-700 active:bg-purple-900 
                         focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                         transition dark:bg-purple-700 dark:hover:bg-purple-600"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-8 py-3 
                         bg-red-600 border border-transparent rounded-md 
                         font-semibold text-xs text-white uppercase tracking-widest 
                         hover:bg-red-700 active:bg-red-900 
                         focus:outline-none focus:border-red-900 focus:ring focus:ring-red-300 
                         transition dark:bg-red-700 dark:hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}



