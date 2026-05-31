<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $modules = [
            'Dashboard',
            'Projects',
            'Tasks',
            'Members',
            'Clients',
            'Contacts',
            'Appointments',
            'Calendar',
            'Chat',
            'Notifications',
            'Attendance',
            'History',
            'Finance',
            'Invoices',
            'Quotes',
            'Settings',
            'Blogs',
            'Templates',
            'Categories',
            'TeamHub',
            'Roles',
            'Creators',
            'Commercials',
            'Expenses',
        ];

        $actions = ['view', 'create', 'edit', 'delete', 'export'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(['name' => strtolower($action . ' ' . $module)]);
            }
        }

        // Create roles and assign existing permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo(Permission::all());

        $memberRole = Role::firstOrCreate(['name' => 'member']);
        // Assign some default permissions to member if needed
        $memberRole->givePermissionTo([
            'view dashboard',
            'view projects',
            'view tasks',
            'view chat',
            'view notifications',
            'view attendance',
        ]);

        $projectManagerRole = Role::firstOrCreate(['name' => 'project_manager']);
        $projectManagerRole->givePermissionTo([
            'view dashboard',
            'view projects',
            'create projects',
            'edit projects',
            'view tasks',
            'create tasks',
            'edit tasks',
            'view members',
            'view clients',
            'view chat',
        ]);

        // Assign admin role to existing admin users
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            $admin->assignRole($adminRole);
        }

        $members = User::where('role', 'member')->get();
        foreach ($members as $member) {
            $member->assignRole($memberRole);
        }

        $pms = User::where('role', 'project_manager')->get();
        foreach ($pms as $pm) {
            $pm->assignRole($projectManagerRole);
        }
    }
}
