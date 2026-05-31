import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import DashboardInput from '@/Components/UI/DashboardInput';
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import PermissionSelector from '@/Components/Admin/PermissionSelector';

export default function RoleCreate({ auth, modules }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [],
    });

    const actions = ['view', 'create', 'edit', 'delete', 'export'];

    const togglePermission = (permission) => {
        const newPermissions = [...data.permissions];
        const index = newPermissions.indexOf(permission);
        if (index > -1) {
            newPermissions.splice(index, 1);
        } else {
            newPermissions.push(permission);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Create New Role"
                description="Define a new role and assign specific module permissions."
                actions={
                    <Link href={route('admin.roles.index')}>
                        <DashboardButton variant="secondary" className="flex items-center gap-2">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Roles
                        </DashboardButton>
                    </Link>
                }
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DashboardCard title="Role Information">
                        <div className="max-w-md">
                            <DashboardInput 
                                label="Role Name"
                                placeholder="e.g. Project Manager, Accountant"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                error={errors.name}
                                icon={ShieldCheckIcon}
                                required
                            />
                        </div>
                    </DashboardCard>

                    <DashboardCard title="Permissions Matrix" description="Select which actions this role can perform across different modules.">
                        <PermissionSelector 
                            modules={modules}
                            selectedPermissions={data.permissions}
                            onTogglePermission={togglePermission}
                            onToggleModuleAll={toggleModuleAll}
                        />
                    </DashboardCard>

                    <div className="flex justify-end gap-3">
                        <Link href={route('admin.roles.index')}>
                            <DashboardButton variant="secondary" type="button">Cancel</DashboardButton>
                        </Link>
                        <DashboardButton type="submit" loading={processing}>Create Role</DashboardButton>
                    </div>
                </form>
            </DashboardPage>
        </AdminLayout>
    );
}
