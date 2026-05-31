import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import PermissionSelector from '@/Components/Admin/PermissionSelector';

export default function Create({ auth, roles, permissions, modules }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: roles?.[0]?.name || 'member',
        permissions: [],
        job_title: '',
        show_on_homepage: false,
        avatar: null,
    });

    const actions = ['view', 'create', 'edit', 'delete', 'export'];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.members.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
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
                title="Add Team Member"
                description="Onboard a new professional to your studio team."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <DashboardCard className="lg:col-span-2 border-transparent shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    placeholder="Enter member's full name"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    placeholder="name@techweb.com"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500 font-bold">{errors.email}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Password</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        autoComplete="new-password"
                                        required
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-500 font-bold">{errors.password}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        autoComplete="new-password"
                                        required
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-sm text-red-500 font-bold">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">System Role</label>
                                <select
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
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Job Title</label>
                                    <input
                                        type="text"
                                        value={data.job_title}
                                        onChange={(e) => setData('job_title', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        placeholder="e.g. Full Stack Developer"
                                    />
                                    {errors.job_title && <p className="mt-1 text-sm text-red-500 font-bold">{errors.job_title}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Profile Photo</label>
                                    <input
                                        type="file"
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

                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                <DashboardButton 
                                    type="submit" 
                                    disabled={processing} 
                                    className="w-full md:w-auto !px-12"
                                >
                                    {processing ? 'Registering...' : 'Complete Onboarding'}
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
}
