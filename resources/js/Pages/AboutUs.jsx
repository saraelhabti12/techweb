import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <MainLayout>

            <Head title="Innovative Web Design & Development Solutions" />
            
            <div className="max-w-4xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    hello this is About Us page
                </h1>
            </div>
        </MainLayout>
    );
}