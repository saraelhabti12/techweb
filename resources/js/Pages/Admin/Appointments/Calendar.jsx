import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import Modal from '@/Components/Modal';
import DashboardInput from '@/Components/UI/DashboardInput';
import InputError from '@/Components/InputError';
import { 
    CalendarDaysIcon, 
    ListBulletIcon, 
    PlusIcon,
    ClockIcon,
    TagIcon,
    PencilSquareIcon,
    UserIcon,
    PhoneIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

export default function Calendar({ auth, events }) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'client_meeting',
        date: '',
        start_time: '09:00',
        end_time: '10:00',
        notes: '',
    });

    const handleEventClick = (info) => {
        setSelectedEvent({
            title: info.event.title,
            start: info.event.start,
            end: info.event.end,
            ...info.event.extendedProps
        });
        setShowViewModal(true);
    };

    const handleDateClick = (arg) => {
        setData('date', arg.dateStr);
        setShowAddModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.appointments.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                reset();
            },
        });
    };

    const eventTypes = [
        { id: 'client_meeting', label: 'Client Meeting', color: '#3b82f6' },
        { id: 'internal_meeting', label: 'Internal Meeting', color: '#10b981' },
        { id: 'lunch_break', label: 'Lunch Break', color: '#f59e0b' },
        { id: 'busy_outside', label: 'Busy Outside Office', color: '#ef4444' },
        { id: 'personal_event', label: 'Personal Event', color: '#ec4899' },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title="Appointments Calendar" />

            <DashboardPage 
                title="Studio Schedule"
                description="Monitor and manage all confirmed studio visits and team consultations."
                actions={
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.appointments.index')}>
                            <DashboardButton variant="secondary" className="flex items-center gap-2">
                                <ListBulletIcon className="w-5 h-5" />
                                View Requests
                            </DashboardButton>
                        </Link>
                        <DashboardButton 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 !bg-[#1F2BF3] hover:!bg-[#00D8C0] text-white"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Appointment
                        </DashboardButton>
                    </div>
                }
            >
                <DashboardCard className="!p-8 overflow-hidden border-transparent shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={handleEventClick}
                            dateClick={handleDateClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            displayEventEnd={true}
                            eventTimeFormat={{
                                hour: 'numeric',
                                minute: '2-digit',
                                meridiem: 'short'
                            }}
                            height="auto"
                            selectable={true}
                        />
                    </div>
                </DashboardCard>
            </DashboardPage>

            {/* Add Appointment Modal */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="xl">
                <form onSubmit={submit} className="p-8 bg-white dark:bg-[#0A0A0A]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-[#1F2BF3]/10 rounded-2xl">
                            <CalendarDaysIcon className="w-6 h-6 text-[#1F2BF3]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Add New Appointment
                            </h2>
                            <p className="text-sm font-bold text-gray-400">Manually block studio schedule</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <DashboardInput
                            label="Event Title"
                            placeholder="e.g. Client Design Sync"
                            icon={PencilSquareIcon}
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} />

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                Event Type
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

                        <DashboardInput
                            label="Date"
                            type="date"
                            icon={CalendarDaysIcon}
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                        />
                        <InputError message={errors.date} />

                        <div className="grid grid-cols-2 gap-4">
                            <DashboardInput
                                label="From (Start Time)"
                                type="time"
                                icon={ClockIcon}
                                value={data.start_time}
                                onChange={e => setData('start_time', e.target.value)}
                            />
                            <DashboardInput
                                label="To (End Time)"
                                type="time"
                                icon={ClockIcon}
                                value={data.end_time}
                                onChange={e => setData('end_time', e.target.value)}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                Notes
                            </label>
                            <textarea
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 px-5 py-4 text-sm font-bold min-h-[100px]"
                                placeholder="Any extra details..."
                            />
                            <InputError message={errors.notes} />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <DashboardButton 
                            type="button" 
                            variant="secondary" 
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </DashboardButton>
                        <DashboardButton 
                            type="submit" 
                            disabled={processing}
                            className="!bg-[#1F2BF3] hover:!bg-[#00D8C0] text-white px-8"
                        >
                            Create Event
                        </DashboardButton>
                    </div>
                </form>
            </Modal>

            {/* View Appointment Modal */}
            <Modal show={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="lg">
                {selectedEvent && (
                    <div className="p-8 bg-white dark:bg-[#0A0A0A]">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-[#1F2BF3]/10 rounded-2xl">
                                    <InformationCircleIcon className="w-6 h-6 text-[#1F2BF3]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                        Appointment Details
                                    </h2>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400">
                                        {selectedEvent.type?.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setShowViewModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                                <PlusIcon className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Title</label>
                                <p className="text-lg font-black text-gray-900 dark:text-white">{selectedEvent.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block flex items-center gap-1">
                                        <ClockIcon className="w-3 h-3" /> From
                                    </label>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                        {new Date(selectedEvent.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                                {selectedEvent.end && (
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block flex items-center gap-1">
                                            <ClockIcon className="w-3 h-3" /> To
                                        </label>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                            {new Date(selectedEvent.end).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {selectedEvent.client_name && (
                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Client Information</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">
                                            <UserIcon className="w-4 h-4 text-[#1F2BF3]" />
                                            {selectedEvent.client_name}
                                        </div>
                                        {selectedEvent.client_phone && (
                                            <div className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                                                <PhoneIcon className="w-4 h-4 text-[#00D8C0]" />
                                                {selectedEvent.client_phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block flex items-center gap-1">
                                    <UserIcon className="w-3 h-3" /> Responsible Person
                                </label>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedEvent.member}</p>
                            </div>

                            {selectedEvent.notes && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 block">Notes</label>
                                    <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {selectedEvent.notes}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8">
                            <DashboardButton 
                                onClick={() => setShowViewModal(false)}
                                className="w-full !bg-gray-100 dark:!bg-white/5 !text-gray-900 dark:!text-white border-none shadow-none hover:!bg-gray-200 dark:hover:!bg-white/10 transition-all"
                            >
                                Close
                            </DashboardButton>
                        </div>
                    </div>
                )}
            </Modal>

            <style dangerouslySetInnerHTML={{ __html: `
                .calendar-container {
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
                    font-size: 1.5rem !important;
                    font-weight: 900 !important;
                    text-transform: uppercase;
                    letter-spacing: -0.025em;
                    color: #111827;
                }
                .dark .fc .fc-toolbar-title {
                    color: #ffffff;
                }

                .fc .fc-button {
                    border-radius: 0.75rem !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    font-size: 0.75rem !important;
                    letter-spacing: 0.05em !important;
                    padding: 0.6rem 1.2rem !important;
                    transition: all 0.3s ease !important;
                }

                .fc-theme-standard td, .fc-theme-standard th {
                    border-color: #f3f4f6 !important;
                }
                .dark .fc-theme-standard td, .dark .fc-theme-standard th {
                    border-color: #1f2937 !important;
                }

                .fc-event {
                    border-radius: 0.5rem !important;
                    padding: 4px 8px !important;
                    font-weight: 700 !important;
                    font-size: 0.75rem !important;
                    border: none !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                }

                .fc-daygrid-day-number {
                    font-weight: 800 !important;
                    font-size: 0.875rem !important;
                    color: #6b7280 !important;
                    padding: 8px !important;
                }
                .dark .fc-daygrid-day-number {
                    color: #9ca3af !important;
                }

                .fc-col-header-cell-cushion {
                    font-weight: 900 !important;
                    text-transform: uppercase !important;
                    font-size: 0.7rem !important;
                    letter-spacing: 0.1em !important;
                    color: #9ca3af !important;
                    padding: 12px 0 !important;
                }
            `}} />
        </AdminLayout>
    );
}
