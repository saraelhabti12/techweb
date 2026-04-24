import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, Clock, User, Phone, MessageSquare, TagIcon, CalendarDaysIcon, PlusIcon } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import Modal from '@/Components/Modal';
import DashboardInput from '@/Components/UI/DashboardInput';
import InputError from '@/Components/InputError';
import { motion } from 'framer-motion';

export default function Index({ auth, appointments }) {
    const [selectedApt, setSelectedApt] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        status: 'accepted',
        end_time: '',
        type: 'client_visit',
        notes: '',
    });

    const handleStatusUpdate = (id, status) => {
        if (status === 'accepted') {
            const apt = appointments.find(a => a.id === id);
            setSelectedApt(apt);
            // Default end time 1 hour later
            const startDate = new Date(apt.appointment_date);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            setData({
                status: 'accepted',
                end_time: endDate.toTimeString().slice(0, 5),
                type: 'client_visit',
                notes: apt.notes || '',
            });
            setShowApproveModal(true);
        } else {
            if (confirm(`Are you sure you want to reject this appointment?`)) {
                router.post(route('admin.appointments.updateStatus', id), { status: 'rejected' });
            }
        }
    };

    const submitApproval = (e) => {
        e.preventDefault();
        // Construct end_date from appointment_date and end_time
        const baseDate = selectedApt.appointment_date.split('T')[0];
        const end_date = `${baseDate} ${data.end_time}`;

        post(route('admin.appointments.updateStatus', selectedApt.id), {
            data: {
                ...data,
                end_date
            },
            onSuccess: () => {
                setShowApproveModal(false);
                reset();
            },
        });
    };

    const eventTypes = [
        { id: 'client_visit', label: 'Client Visit', color: '#7c3aed' },
        { id: 'client_meeting', label: 'Client Meeting', color: '#3b82f6' },
        { id: 'internal_meeting', label: 'Internal Meeting', color: '#10b981' },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Appointment Requests" />

            <DashboardPage 
                title="Appointment Requests"
                description="Manage studio visit requests and team consultations."
            >
                <div className="grid grid-cols-1 gap-6">
                    {appointments.length === 0 ? (
                        <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
                            <Clock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-400 font-medium italic">No pending appointment requests.</p>
                        </div>
                    ) : (
                        appointments.map((apt) => (
                            <DashboardCard key={apt.id} className="group !p-0 overflow-hidden border-transparent hover:border-[#1F2BF3]/20 transition-all">
                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        <div className="flex gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
                                                <User className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-black text-xl text-gray-900 dark:text-white tracking-tight">
                                                    {apt.title || apt.client?.name || 'Untitled Appointment'}
                                                </h3>
                                                {apt.client && (
                                                    <div className="flex items-center text-sm font-bold text-gray-500">
                                                        <Phone className="w-3.5 h-3.5 mr-2 text-[#1F2BF3]" />
                                                        {apt.client.phone}
                                                    </div>
                                                )}
                                                <div className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded inline-block">
                                                    Requested by: {apt.user?.name || 'Admin'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:items-end gap-2 shrink-0">
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
                                                <Clock className="w-5 h-5 text-[#1F2BF3]" />
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Schedule</span>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full self-start md:self-end shadow-sm ${
                                                apt.status === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                apt.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                                {apt.status}
                                            </span>
                                        </div>
                                    </div>

                                    {apt.notes && (
                                        <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4">
                                            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm h-fit">
                                                <MessageSquare className="w-4 h-4 text-[#1F2BF3]" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Message from requester</span>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic">"{apt.notes}"</p>
                                            </div>
                                        </div>
                                    )}

                                    {apt.status === 'pending' && (
                                        <div className="mt-8 flex items-center justify-end gap-4 pt-6 border-t border-gray-50 dark:border-gray-800">
                                            <DashboardButton 
                                                variant="secondary"
                                                onClick={() => handleStatusUpdate(apt.id, 'rejected')}
                                                className="text-red-600 border-red-100 hover:bg-red-50 !px-8"
                                            >
                                                Decline
                                            </DashboardButton>
                                            <DashboardButton
                                                onClick={() => handleStatusUpdate(apt.id, 'accepted')}
                                                className="!px-10"
                                            >
                                                Approve Visit
                                            </DashboardButton>
                                        </div>
                                    )}
                                </div>
                            </DashboardCard>
                        ))
                    )}
                </div>
            </DashboardPage>

            {/* Approval Modal */}
            <Modal show={showApproveModal} onClose={() => setShowApproveModal(false)} maxWidth="xl">
                {selectedApt && (
                    <form onSubmit={submitApproval} className="p-8 bg-white dark:bg-[#0A0A0A]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Approve Appointment
                                </h2>
                                <p className="text-sm font-bold text-gray-400">Finalize details for {selectedApt.client.name}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 block">Date</label>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[1.25rem] border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-900 dark:text-white">
                                        {new Date(selectedApt.appointment_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2 block">From</label>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-[1.25rem] border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-900 dark:text-white">
                                        {new Date(selectedApt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                            <DashboardInput
                                label="To (End Time)"
                                type="time"
                                icon={Clock}
                                value={data.end_time}
                                onChange={e => setData('end_time', e.target.value)}
                            />
                            <InputError message={errors.end_date} />

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                    Appointment Type
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <TagIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                                    </div>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 pl-11 py-4 text-sm font-bold appearance-none"
                                    >
                                        {eventTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <InputError message={errors.type} />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                    Internal Notes
                                </label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 px-5 py-4 text-sm font-bold min-h-[100px]"
                                    placeholder="Any internal notes about this visit..."
                                />
                                <InputError message={errors.notes} />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <DashboardButton 
                                type="button" 
                                variant="secondary" 
                                onClick={() => setShowApproveModal(false)}
                            >
                                Cancel
                            </DashboardButton>
                            <DashboardButton 
                                type="submit" 
                                disabled={processing}
                                className="!bg-[#1F2BF3] hover:!bg-[#00D8C0] text-white px-8"
                            >
                                Confirm Approval
                            </DashboardButton>
                        </div>
                    </form>
                )}
            </Modal>
        </AdminLayout>
    );
}
