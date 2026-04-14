import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

export default function Index({ auth, appointments }) {
    const statusIcons = {
        pending: <Clock className="w-4 h-4 text-yellow-500" />,
        approved: <CheckCircle className="w-4 h-4 text-green-500" />,
        rejected: <XCircle className="w-4 h-4 text-red-500" />,
    };

    const statusClasses = {
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        approved: 'bg-green-50 text-green-700 border-green-100',
        rejected: 'bg-red-50 text-red-700 border-red-100',
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="My Appointments" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Appointment Requests</h1>
                        <p className="text-sm text-gray-500">Track the status of your client visit requests</p>
                    </div>
                    <Link
                        href={route('member.appointments.create')}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Request
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {appointments.map((apt) => (
                        <div key={apt.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-wrap justify-between items-center gap-4">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{apt.client.name}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(apt.appointment_date).toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {apt.notes && (
                                    <div className="hidden md:block max-w-xs">
                                        <p className="text-xs text-gray-500 italic truncate">"{apt.notes}"</p>
                                    </div>
                                )}
                                
                                <div className={`flex items-center px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusClasses[apt.status]}`}>
                                    <span className="mr-2">{statusIcons[apt.status]}</span>
                                    {apt.status}
                                </div>
                            </div>
                        </div>
                    ))}

                    {appointments.length === 0 && (
                        <div className="bg-white p-12 rounded-xl border border-dashed border-gray-200 text-center text-gray-500">
                            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                            <p>You haven't requested any appointments yet.</p>
                            <Link href={route('member.appointments.create')} className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                                Request your first appointment
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MemberLayout>
    );
}
