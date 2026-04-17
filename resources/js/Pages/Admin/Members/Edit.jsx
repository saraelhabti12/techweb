import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

const Edit = ({ member, auth }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: member.name || '',
        email: member.email || '',
        password: '',
        password_confirmation: '',
        role: member.role || 'member',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.members.update', member.id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Edit Team Member"
                description={`Update profile and permissions for ${member.name}`}
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        Go Back
                    </DashboardButton>
                }
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <DashboardCard>
                        <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
                            <div className="relative mb-4">
                                {member.avatar ? (
                                    <img
                                        src={`/storage/${member.avatar}`}
                                        alt={member.name}
                                        className="w-24 h-24 rounded-2xl object-cover shadow-xl ring-4 ring-white dark:ring-gray-900"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white text-3xl font-black shadow-xl">
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-950 rounded-full"></div>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {member.name}
                            </h2>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{member.role}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500 font-bold">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    System Role
                                </label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    required
                                >
                                    <option value="member">Member</option>
                                    <option value="project_manager">Project Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && <p className="mt-1 text-sm text-red-500 font-bold">{errors.role}</p>}
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Security Settings</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            New Password (Leave blank to keep current)
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            autoComplete="new-password"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-500 font-bold">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            autoComplete="new-password"
                                        />
                                        {errors.password_confirmation && <p className="mt-1 text-sm text-red-500 font-bold">{errors.password_confirmation}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                <DashboardButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full"
                                >
                                    {processing ? 'Saving Changes...' : 'Update Member Profile'}
                                </DashboardButton>
                            </div>
                        </form>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
};

export default Edit;
