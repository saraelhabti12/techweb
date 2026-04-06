import React from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import dayjs from "dayjs";

export default function Show({ schedule, auth }) {
    const formattedDate = schedule.date 
        ? dayjs(schedule.date).format("YYYY-MM-DD") 
        : "-";
    const formattedTime = schedule.time || "-";

    return (
        <AdminLayout auth={auth} header={`Schedule Details: ${schedule.title}`}>
            <div className="bg-gray-700 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 max-w-4xl mx-auto my-10 ">
                {/* Bouton Retour */}
                    <div className="mb-6">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Retour
                        </button>
                    </div>
                <div className="bg-gray-100 bg-opacity-60 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 max-w-md mx-auto">

                    {/* Titre */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">
                        {schedule.title}
                    </h1>

                    {/* Infos Schedule */}
                    <div className="space-y-4 text-gray-900 dark:text-gray-200">
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Date:</span> {formattedDate}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Time:</span> {formattedTime}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Person:</span> {schedule.person || '-'}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Content:</span> {schedule.content || '-'}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">ID:</span> {schedule.id}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Created at:</span> {dayjs(schedule.created_at).format("YYYY-MM-DD HH:mm")}</p>
                        </div>
                        <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-sm">
                            <p><span className="font-semibold text-gray-900 dark:text-gray-300">Updated at:</span> {dayjs(schedule.updated_at).format("YYYY-MM-DD HH:mm")}</p>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}









