import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function Create({ auth, clients, client_id = null }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: client_id || '',
        appointment_date: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('member.appointments.store'));
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="Request Appointment" />

            <div className="max-w-2xl mx-auto space-y-6">
                <Link
                    href={route('member.clients.index')}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Clients
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Studio Visit</h1>
                    <p className="text-sm text-gray-500 mb-8">Submit an appointment request for admin approval.</p>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                            <select
                                value={data.client_id}
                                onChange={e => setData('client_id', e.target.value)}
                                className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                required
                            >
                                <option value="">-- Choose a client --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name} ({client.phone})</option>
                                ))}
                            </select>
                            {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proposed Date & Time</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <input
                                    type="datetime-local"
                                    value={data.appointment_date}
                                    onChange={e => setData('appointment_date', e.target.value)}
                                    className="w-full pl-10 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                            </div>
                            {errors.appointment_date && <p className="text-red-500 text-xs mt-1">{errors.appointment_date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes for Admin</label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                rows="4"
                                placeholder="Explain the purpose of the visit or any special requests..."
                            />
                            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-200 transition-all"
                            >
                                {processing ? 'Sending...' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MemberLayout>
    );
}
