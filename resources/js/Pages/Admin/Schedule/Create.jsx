import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Head } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        date: '',
        time: '',
        person: '',
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.schedule.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Create Schedule" />
            <DashboardPage 
                title="Create New Schedule"
                description="Schedule a new appointment, meeting, or event."
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()}>
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-4xl mx-auto">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Event Title
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                placeholder="Enter title..."
                                autoFocus
                            />
                            {errors.title && <div className="mt-1 text-sm text-red-500 font-bold">{errors.title}</div>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.date && <div className="mt-1 text-sm text-red-500 font-bold">{errors.date}</div>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={data.time}
                                    onChange={(e) => setData('time', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.time && <div className="mt-1 text-sm text-red-500 font-bold">{errors.time}</div>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Person In Charge / Participant
                            </label>
                            <input
                                type="text"
                                value={data.person}
                                onChange={(e) => setData('person', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                placeholder="Enter name..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Event Description / Content
                            </label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                rows={4}
                                placeholder="Details about the event..."
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? 'Creating...' : 'Create Schedule Event'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
