import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from '../Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '../Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '../Profile/Partials/UpdateProfileInformationForm';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AdminLayout auth={auth} title="Profile">
            <Head title="Profile" />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* Profile Information Section */}
                    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Profile Information
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Update your account's profile information and email address.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                            />
                        </div>
                    </div>

                    {/* Password Update Section */}
                    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Update Password
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                        </div>
                        <div className="p-6">
                            <UpdatePasswordForm />
                        </div>
                    </div>

                    {/* Account Deletion Section */}
                    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-red-50 dark:bg-red-900/10">
                            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
                                Delete Account
                            </h3>
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                Once your account is deleted, all of its resources and data will be permanently deleted.
                            </p>
                        </div>
                        <div className="p-6">
                            <DeleteUserForm />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
