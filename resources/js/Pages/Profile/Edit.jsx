import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePhotoForm from './Partials/UpdateProfilePhotoForm';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const Layout = auth.user.role === 'admin' || auth.user.role === 'project_manager' 
        ? AdminLayout 
        : MemberLayout;

    return (
        <Layout auth={auth}>
            <Head title="Profile Settings" />

            <DashboardPage 
                title="Account Settings"
                description="Manage your professional profile, security preferences, and account data."
            >
                <div className="max-w-4xl mx-auto space-y-8 pb-12">
                    <DashboardCard className="!p-0 overflow-hidden border-transparent shadow-lg">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                Profile Photo
                            </h3>
                            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Personalize your account with a profile picture.
                            </p>
                        </div>
                        <div className="p-8">
                            <UpdateProfilePhotoForm />
                        </div>
                    </DashboardCard>

                    <DashboardCard className="!p-0 overflow-hidden border-transparent shadow-lg">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                Profile Information
                            </h3>
                            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Update your account's public profile and primary contact details.
                            </p>
                        </div>
                        <div className="p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </DashboardCard>

                    <DashboardCard className="!p-0 overflow-hidden border-transparent shadow-lg">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                                Security & Password
                            </h3>
                            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Maintain a strong password to ensure your account remains protected.
                            </p>
                        </div>
                        <div className="p-8">
                            <UpdatePasswordForm />
                        </div>
                    </DashboardCard>

                    <DashboardCard className="!p-0 overflow-hidden border-red-100 dark:border-red-900/30 shadow-xl shadow-red-500/5">
                        <div className="px-8 py-6 border-b border-red-50 dark:border-red-900/20 bg-red-50/50 dark:bg-red-900/10">
                            <h3 className="text-xl font-black text-red-800 dark:text-red-400 tracking-tight uppercase">
                                Danger Zone
                            </h3>
                            <p className="mt-1 text-sm font-medium text-red-600 dark:text-red-500/70">
                                Permanent account deletion and data removal. Proceed with caution.
                            </p>
                        </div>
                        <div className="p-8">
                            <DeleteUserForm />
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </Layout>
    );
}
