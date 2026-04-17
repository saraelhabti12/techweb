import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import AvatarUploader from '@/Components/Admin/AvatarUploader';
import { User, Mail, Shield, Calendar, PencilIcon, TrashIcon } from 'lucide-react';

export default function Show({ member, auth }) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this member?')) {
            router.delete(route('admin.members.destroy', member.id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Member Profile"
                description={`Viewing details for ${member.name}`}
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        Go Back
                    </DashboardButton>
                }
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <DashboardCard>
                        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                            <div className="mb-6">
                                <AvatarUploader user={member} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                {member.name}
                            </h2>
                            <p className="px-4 py-1 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-full text-xs font-black uppercase tracking-widest">
                                {member.role || (member.is_admin ? 'Admin' : 'Member')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</span>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <User className="w-5 h-5 text-[#1F2BF3]" />
                                        </div>
                                        <span className="font-bold">{member.name}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</span>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Mail className="w-5 h-5 text-[#1F2BF3]" />
                                        </div>
                                        <span className="font-bold">{member.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">System Role</span>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Shield className="w-5 h-5 text-[#1F2BF3]" />
                                        </div>
                                        <span className="font-bold uppercase">{member.role || (member.is_admin ? 'Admin' : 'Member')}</span>
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Member Since</span>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="w-5 h-5 text-[#1F2BF3]" />
                                        </div>
                                        <span className="font-bold">{new Date(member.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-center gap-4">
                            <Link href={route('admin.members.edit', member.id)}>
                                <DashboardButton className="flex items-center gap-2 px-8">
                                    <PencilIcon className="w-4 h-4" />
                                    Edit Profile
                                </DashboardButton>
                            </Link>
                            <DashboardButton 
                                variant="secondary" 
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-8 !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Delete Member
                            </DashboardButton>
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
}
