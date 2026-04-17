import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, Head } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Edit({ schedule, auth }) {
    const { data, setData, put, processing, errors } = useForm({
        title: schedule.title || '',
        date: schedule.date || '',
        time: schedule.time || '',
        person: schedule.person || '',
        content: schedule.content || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.schedule.update', schedule.id));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Edit ${schedule.title}`} />
            <DashboardPage 
                title="Edit Schedule"
                description={`Updating event: ${schedule.title}`}
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
                            />
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                            <DashboardButton
                                type="submit"
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? 'Updating...' : 'Update Schedule Event'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
