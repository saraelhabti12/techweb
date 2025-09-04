import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function Services() {
    return (
        <MainLayout>

            <Head title="Services" />

            <div className="max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    hello this is Services page
                </h1>
            </div>
        </MainLayout>
    );
}