import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import moment from 'moment';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MyAttendance({ auth, attendance }) {
  return (
    <MemberLayout auth={auth}>
            <Head title="Dashboard" />
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>

      <div className="overflow-x-auto bg-purple-10/90 border border-purple-200 dark:bg-gray-800 shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Marked At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {attendance.map((entry, index) => (
              <tr key={index}>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">{entry.type}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-200">
                  {moment(entry.marked_at).format('YYYY-MM-DD HH:mm')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entry.status === 'present' ? 'bg-green-100 text-green-800' :
                    entry.status === 'absent' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       </MemberLayout>
  );
}
