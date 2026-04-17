import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

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

            <DashboardPage 
                title="Studio Visit" 
                description="Submit an appointment request for admin approval."
                actions={
                    <Link href={route('member.appointments.index')}>
                        <DashboardButton variant="secondary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Appointments
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="max-w-3xl">
                    <DashboardCard>
                        <form onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                        Select Client
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={data.client_id}
                                            onChange={e => setData('client_id', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 pl-11 shadow-sm transition-all appearance-none font-bold text-sm"
                                            required
                                        >
                                            <option value="">-- Choose a client --</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>{client.name} ({client.phone})</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.client_id && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.client_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                        Proposed Date & Time
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Calendar className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="datetime-local"
                                            value={data.appointment_date}
                                            onChange={e => setData('appointment_date', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 pl-11 shadow-sm transition-all font-bold text-sm"
                                            required
                                        />
                                    </div>
                                    {errors.appointment_date && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.appointment_date}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                    Notes for Admin
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold text-sm min-h-[150px]"
                                    rows="4"
                                    placeholder="Explain the purpose of the visit or any special requests..."
                                />
                                {errors.notes && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.notes}</p>}
                            </div>

                            <div className="flex justify-end pt-4">
                                <DashboardButton
                                    type="submit"
                                    disabled={processing}
                                    className="w-full md:w-auto"
                                >
                                    {processing ? 'Sending...' : 'Send Request'}
                                </DashboardButton>
                            </div>
                        </form>
                    </DashboardCard>
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}
