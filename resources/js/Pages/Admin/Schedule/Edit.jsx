import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ schedule, auth }) {
    // schedule.date et schedule.time sont fournis par le controller
    const { data, setData, put, processing, errors } = useForm({
        title: schedule.title || '',
        date: schedule.date || '', // format YYYY-MM-DD
        time: schedule.time || '', // format HH:mm
        person: schedule.person || '',
        content: schedule.content || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // On envoie date et time séparés
        put(`/admin/schedule/${schedule.id}`);
    };
    
    console.log(auth);

    return (
        <AdminLayout auth={auth} title={`Edit ${schedule.title}`}>
            {/* <div className="bg-white dark:bg-gray-900 justify-center p-6 rounded-lg shadow"> */}
               <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 w-full max-w-2xl">

               <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Retour
                    </button>
                </div>
                <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Edit Schedule
                </h1>

                <form onSubmit={submit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                        {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                    </div>

                    {/* Date et Time côte à côte */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Date</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                            {errors.date && <div className="text-red-500 text-sm">{errors.date}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Time</label>
                            <input
                                type="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className="w-full rounded-md border-gray-300 
                                            dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                            shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                            {errors.time && <div className="text-red-500 text-sm">{errors.time}</div>}
                        </div>
                    </div>

                    {/* Person */}
                    <div>
                        <label className="block text-sm font-medium">Person</label>
                        <input
                            type="text"
                            value={data.person}
                            onChange={(e) => setData('person', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full rounded-md border-gray-300 
                                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                                        shadow-sm focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-6 py-3 
                                    bg-purple-600 border border-transparent rounded-md 
                                    font-semibold text-sm text-white uppercase tracking-widest 
                                    hover:bg-purple-700 active:bg-purple-900 
                                    focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                                    disabled:opacity-25 transition 
                                    dark:bg-purple-700 dark:hover:bg-purple-600"
                    >
                        Update
                    </button>
                    </div>
                </form>
            </div>
            </div>
        </AdminLayout>
    );
}




