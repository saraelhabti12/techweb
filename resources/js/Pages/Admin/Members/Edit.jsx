import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import PermissionSelector from '@/Components/Admin/PermissionSelector';

const Edit = ({ member, auth, roles, permissions, memberRoles, memberPermissions, modules }) => {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: member.name || '',
        email: member.email || '',
        password: '',
        password_confirmation: '',
        role: memberRoles?.[0] || member.role || 'member',
        permissions: memberPermissions || [],
        job_title: member.job_title || '',
        show_on_homepage: !!member.show_on_homepage,
        avatar: null,
    });

    const actions = ['view', 'create', 'edit', 'delete', 'export'];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.members.update', member.id), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    const togglePermission = (p) => {
        const newPermissions = [...data.permissions];
        const index = newPermissions.indexOf(p);
        if (index > -1) {
            newPermissions.splice(index, 1);
        } else {
            newPermissions.push(p);
        }
        setData('permissions', newPermissions);
    };

    const toggleModuleAll = (moduleLower, checked) => {
        let newPermissions = [...data.permissions];
        actions.forEach(action => {
            const p = `${action} ${moduleLower}`;
            const index = newPermissions.indexOf(p);
            if (checked && index === -1) {
                newPermissions.push(p);
            } else if (!checked && index > -1) {
                newPermissions.splice(newPermissions.indexOf(p), 1);
            }
        });
        setData('permissions', newPermissions);
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <DashboardCard className="lg:col-span-2">
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
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">{data.role}</p>
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
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name.toUpperCase()}</option>
                                    ))}
                                </select>
                                {errors.role && <p className="mt-1 text-sm text-red-500 font-bold">{errors.role}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="job_title" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        id="job_title"
                                        value={data.job_title}
                                        onChange={(e) => setData('job_title', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        placeholder="e.g. Full Stack Developer"
                                    />
                                    {errors.job_title && <p className="mt-1 text-sm text-red-500 font-bold">{errors.job_title}</p>}
                                </div>

                                <div>
                                    <label htmlFor="avatar" className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                        Update Profile Photo
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar"
                                        onChange={(e) => setData('avatar', e.target.files[0])}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        accept="image/*"
                                    />
                                    {errors.avatar && <p className="mt-1 text-sm text-red-500 font-bold">{errors.avatar}</p>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#1F2BF3]/5 dark:bg-[#1F2BF3]/10 rounded-2xl border border-[#1F2BF3]/20">
                                <input 
                                    type="checkbox" 
                                    id="show_on_homepage"
                                    checked={data.show_on_homepage}
                                    onChange={(e) => setData('show_on_homepage', e.target.checked)}
                                    className="w-5 h-5 text-[#1F2BF3] border-gray-300 rounded focus:ring-[#1F2BF3] dark:bg-gray-900 dark:border-gray-700"
                                />
                                <label htmlFor="show_on_homepage" className="text-sm font-black uppercase tracking-widest text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Show this member on Homepage Team Section
                                </label>
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

                    <DashboardCard title="Optional Overrides" description="Directly assign specific permissions to this user." className="lg:col-span-1 h-fit sticky top-8">
                        <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
                            <PermissionSelector 
                                modules={modules}
                                selectedPermissions={data.permissions}
                                onTogglePermission={togglePermission}
                                onToggleModuleAll={toggleModuleAll}
                            />
                        </div>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </AdminLayout>
    );
};

export default Edit;
