import { Link } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/solid'; // Tu peux utiliser Heroicons ou ton propre SVG


export default function DashboardStats({ stats }) {
    const statCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: (
                <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: route('admin.projects.index'),
            color: 'bg-blue-100 dark:bg-blue-900',
        },
        {
            title: 'Total Tasks',
            value: stats.tasks,
            icon: (
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            link: route('admin.tasks.index'),
            color: 'bg-white dark:bg-purple-50',
        },
        {
            title: 'Categories',
            value: stats.categories,
            icon: (
                <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
            ),
            link: route('admin.categories.index'),
            color: 'bg-purple-100 dark:bg-purple-900',
        },
        {
            title: 'Pending Approvals',
            value: stats.pending_approvals,
            icon: (
                <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            link: '#',
            color: 'bg-yellow-100 dark:bg-yellow-900',
        },

        {
    title: 'Total Templates',
    value: stats.templates, 
    icon: (
        <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h10" />
        </svg>
    ),
    link: route('admin.templates.index'), 
    color: 'bg-pink-100 dark:bg-pink-900',
},


        // ← AJOUTE ICI ton Team Hub
    {
        title: 'Team Hub',
        value: stats.team_hub || '-', 
        icon: (
            <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2h2m3-4h4m-2-2v4" />
            </svg>
        ),
        link: route('admin.teamhub.index'),
        color: 'bg-indigo-100 dark:bg-indigo-900',
    },
        
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <Link
                    key={index}
                    href={stat.link || '#'}
                    className={`${stat.color} rounded-lg shadow p-6 flex items-center justify-between transition-transform hover:scale-105`}
                >
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className="p-3 rounded-full bg-white dark:bg-gray-700">
                        {stat.icon}
                    </div>
                </Link>
            ))}
        </div>
    );
}
