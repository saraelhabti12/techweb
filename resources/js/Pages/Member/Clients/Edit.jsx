import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ auth, client }) {
    const { data, setData, put, processing, errors } = useForm({
        name: client.name || '',
        phone: client.phone || '',
        city: client.city || '',
        notes: client.notes || '',
        status: client.status || 'pending',
        contact_method: client.contact_method || 'whatsapp',
        contact_date: client.contact_date || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('member.clients.update', client.id));
    };

    return (
        <MemberLayout auth={auth}>
            <Head title={`Edit Client: ${client.name}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                <Link
                    href={route('member.clients.index')}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Clients
                </Link>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Client</h1>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                    required
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Date</label>
                                <input
                                    type="date"
                                    value={data.contact_date}
                                    onChange={e => setData('contact_date', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                />
                                {errors.contact_date && <p className="text-red-500 text-xs mt-1">{errors.contact_date}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
                                <select
                                    value={data.contact_method}
                                    onChange={e => setData('contact_method', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="call">Phone Call</option>
                                    <option value="meeting">Meeting</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="interested">Interested</option>
                                    <option value="not_interested">Not Interested</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className="w-full rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                                rows="4"
                            />
                            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all"
                            >
                                {processing ? 'Updating...' : 'Update Client'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MemberLayout>
    );
}
