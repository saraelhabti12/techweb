import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import TeamHubAllActivities from './TeamHubAllActivities';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Index({ activities, auth  }) {
  return (
    <AdminLayout auth={auth}>
      <div className="p-6">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
        <h1 className="text-6xl font-extrabold mb-6">TeamHub Activities</h1>
        <TeamHubAllActivities activities={activities} />
      </div>
    </AdminLayout>
  );
}

