import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import DashboardCard from '@/Components/UI/DashboardCard';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-black leading-tight text-gray-800 dark:text-white tracking-tight">
                    Profile Settings
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
                    <DashboardCard>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </DashboardCard>

                    <DashboardCard>
                        <UpdatePasswordForm className="max-w-xl" />
                    </DashboardCard>

                    <DashboardCard>
                        <DeleteUserForm className="max-w-xl" />
                    </DashboardCard>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
