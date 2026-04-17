import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Index({ auth, appointments }) {
    const statusIcons = {
        pending: <Clock className="w-3.5 h-3.5" />,
        approved: <CheckCircle className="w-3.5 h-3.5" />,
        rejected: <XCircle className="w-3.5 h-3.5" />,
    };

    const statusClasses = {
        pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="My Appointments" />

            <DashboardPage 
                title="Appointments" 
                description="Track the status of your client visit requests and schedule new studio visits."
                actions={
                    <Link href={route('member.appointments.create')}>
                        <DashboardButton>
                            <Plus className="w-4 h-4 mr-2" />
                            New Request
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="grid grid-cols-1 gap-6">
                    {appointments.map((apt) => (
                        <DashboardCard key={apt.id} className="p-6">
                            <div className="flex flex-wrap justify-between items-center gap-6">
                                <div className="flex gap-5 items-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[#1F2BF3]/10 flex items-center justify-center text-[#1F2BF3]">
                                        <Calendar className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                            {apt.client.name}
                                        </h3>
                                        <div className="flex items-center gap-3 mt-1">
                                            <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3 mr-1.5" />
                                                {new Date(apt.appointment_date).toLocaleDateString(undefined, { 
                                                    month: 'short', 
                                                    day: 'numeric', 
                                                    year: 'numeric' 
                                                })}
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {new Date(apt.appointment_date).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 flex-1 justify-end">
                                    {apt.notes && (
                                        <div className="hidden lg:block max-w-sm">
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-xl">
                                                "{apt.notes}"
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className={`flex items-center px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest ${statusClasses[apt.status]}`}>
                                        <span className="mr-2">{statusIcons[apt.status]}</span>
                                        {apt.status}
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>
                    ))}

                    {appointments.length === 0 && (
                        <DashboardCard className="p-16 text-center" noHover>
                            <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center mx-auto mb-6">
                                <AlertCircle className="w-10 h-10 text-gray-300" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2">
                                No appointments found
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mb-8 max-w-xs mx-auto">
                                You haven't requested any studio visits yet. Start by creating a new request.
                            </p>
                            <Link href={route('member.appointments.create')}>
                                <DashboardButton variant="secondary">
                                    Request your first appointment
                                </DashboardButton>
                            </Link>
                        </DashboardCard>
                    )}
                </div>
            </DashboardPage>
        </MemberLayout>
    );
}
