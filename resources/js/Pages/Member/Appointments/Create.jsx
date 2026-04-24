import React, { useState, useEffect } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { motion } from 'framer-motion';

export default function Create({ auth, clients, adminEvents, client_id = null }) {
    const [overlapError, setOverlapError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        client_id: client_id || '',
        appointment_date: '',
        notes: '',
    });

    const checkOverlap = (dateTimeStr) => {
        if (!dateTimeStr) return false;
        const selectedStart = new Date(dateTimeStr);
        const selectedEnd = new Date(selectedStart.getTime() + 60 * 60 * 1000); // Assume 1 hour

        const overlap = adminEvents.find(event => {
            const eventStart = new Date(event.start);
            const eventEnd = event.end ? new Date(event.end) : new Date(eventStart.getTime() + 60 * 60 * 1000);
            
            return (selectedStart < eventEnd && selectedEnd > eventStart);
        });

        if (overlap) {
            setOverlapError(`This slot overlaps with an existing ${overlap.extendedProps.is_manual ? 'busy slot' : 'appointment'}. Please choose another time.`);
            return true;
        }

        setOverlapError(null);
        return false;
    };

    const handleDateSelect = (selectInfo) => {
        const dateStr = selectInfo.startStr.slice(0, 16);
        setData('appointment_date', dateStr);
        setSelectedSlot(selectInfo.startStr);
        checkOverlap(dateStr);
    };

    useEffect(() => {
        if (data.appointment_date) {
            checkOverlap(data.appointment_date);
        }
    }, [data.appointment_date]);

    const submit = (e) => {
        e.preventDefault();
        if (overlapError) return;
        post(route('member.appointments.store'));
    };

    return (
        <MemberLayout auth={auth}>
            <Head title="Request Appointment" />

            <DashboardPage 
                title="Studio Visit" 
                description="Check admin availability and request a free slot for your client visit."
                actions={
                    <Link href={route('member.appointments.index')}>
                        <DashboardButton variant="secondary">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </DashboardButton>
                    </Link>
                }
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <DashboardCard className="!p-6 overflow-hidden border-transparent shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    Admin Availability
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded bg-[#9ca3af]"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Busy</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 rounded bg-[#7c3aed]"></div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">Booked</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="member-calendar-container">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView="timeGridWeek"
                                    events={adminEvents}
                                    selectable={true}
                                    selectMirror={true}
                                    select={handleDateSelect}
                                    headerToolbar={{
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'timeGridWeek,timeGridDay'
                                    }}
                                    allDaySlot={false}
                                    slotMinTime="08:00:00"
                                    slotMaxTime="20:00:00"
                                    height="500px"
                                    eventTimeFormat={{
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        meridiem: 'short'
                                    }}
                                />
                            </div>
                        </DashboardCard>

                        {overlapError && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{overlapError}</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <DashboardCard className="sticky top-8">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                        1. Select Client
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
                                                <option key={client.id} value={client.id}>{client.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.client_id && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.client_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                        2. Request Slot
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="datetime-local"
                                            value={data.appointment_date}
                                            onChange={e => setData('appointment_date', e.target.value)}
                                            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${overlapError ? 'border-rose-500' : 'border-gray-200 dark:border-gray-700'} text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 pl-11 shadow-sm transition-all font-bold text-sm`}
                                            required
                                        />
                                    </div>
                                    {!overlapError && data.appointment_date && (
                                        <div className="flex items-center gap-1.5 mt-2 ml-2 text-emerald-500">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Time slot is available</span>
                                        </div>
                                    )}
                                    {errors.appointment_date && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.appointment_date}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 ml-2">
                                        3. Purpose of Visit
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold text-sm min-h-[120px]"
                                        rows="3"
                                        placeholder="Brief details for the admin..."
                                    />
                                    {errors.notes && <p className="text-rose-500 text-xs font-bold mt-1 ml-2 uppercase tracking-wider">{errors.notes}</p>}
                                </div>

                                <DashboardButton
                                    type="submit"
                                    disabled={processing || !!overlapError || !data.appointment_date}
                                    className={`w-full !py-4 ${overlapError ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Sending...' : 'Request Appointment'}
                                </DashboardButton>
                                
                                <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest px-4">
                                    * Requests are subject to admin final approval
                                </p>
                            </form>
                        </DashboardCard>
                    </div>
                </div>
            </DashboardPage>

            <style dangerouslySetInnerHTML={{ __html: `
                .member-calendar-container {
                    --fc-button-bg-color: #1F2BF3;
                    --fc-button-border-color: #1F2BF3;
                    --fc-button-hover-bg-color: #00D8C0;
                    --fc-button-hover-border-color: #00D8C0;
                    --fc-button-active-bg-color: #00D8C0;
                    --fc-button-active-border-color: #00D8C0;
                    --fc-event-bg-color: #1F2BF3;
                    --fc-event-border-color: #1F2BF3;
                    --fc-today-bg-color: rgba(31, 43, 243, 0.05);
                }
                
                .fc .fc-toolbar-title {
                    font-size: 1rem !important;
                    font-weight: 900 !important;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .fc .fc-button {
                    border-radius: 0.5rem !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 0.65rem !important;
                    padding: 0.4rem 0.8rem !important;
                }

                .fc-theme-standard td, .fc-theme-standard th {
                    border-color: #f3f4f6 !important;
                }
                .dark .fc-theme-standard td, .dark .fc-theme-standard th {
                    border-color: #1f2937 !important;
                }

                .fc-event {
                    border-radius: 0.35rem !important;
                    padding: 2px 4px !important;
                    font-weight: 700 !important;
                    font-size: 0.65rem !important;
                    border: none !important;
                }

                .fc-timegrid-slot {
                    height: 3rem !important;
                }

                .fc-v-event {
                    background-color: var(--fc-event-bg-color);
                    border: none;
                }

                .fc-timegrid-slot-label-cushion {
                    font-size: 0.65rem !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    color: #9ca3af !important;
                }
            `}} />
        </MemberLayout>
    );
}
