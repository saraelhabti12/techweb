import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import TeamHubAllActivities from './TeamHubAllActivities';
import { router, Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Index({ activities, auth }) {
  return (
    <AdminLayout auth={auth}>
      <DashboardPage 
        title="TeamHub Activities"
        description="Monitor and manage all activities happening within your team workspace."
        actions={
          <Link href={route('admin.teamhub.create')}>
            <DashboardButton className="flex items-center gap-2">
              <PlusIcon className="w-5 h-5" />
              New Activity
            </DashboardButton>
          </Link>
        }
      >
        <TeamHubAllActivities activities={activities} />
      </DashboardPage>
    </AdminLayout>
  );
}
