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
import { useTranslation } from 'react-i18next';
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

export default function Calendar({ auth, events, clients = [] }) {
    const { t } = useTranslation();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isWithClient, setIsWithClient] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        type: 'client_meeting',
        date: '',
        start_time: '09:00',
        end_time: '10:00',
        notes: '',
        client_id: '',
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
                setIsWithClient(false);
                reset();
            },
        });
    };

    const eventTypes = [
        { id: 'client_meeting', label: t('client_meeting_label'), color: '#3b82f6' },
        { id: 'internal_meeting', label: t('internal_meeting_label'), color: '#10b981' },
        { id: 'lunch_break', label: t('lunch_break_label'), color: '#f59e0b' },
        { id: 'busy_outside', label: t('busy_outside_label'), color: '#ef4444' },
        { id: 'personal_event', label: t('personal_event_label'), color: '#ec4899' },
    ];

    return (
        <AdminLayout auth={auth}>
            <Head title={t('appointments_calendar')} />

            <DashboardPage 
                title={t('studio_schedule')}
                description={t('monitor_studio_desc')}
                actions={
                    <div className="flex items-center gap-3">
                        <Link href={route('admin.appointments.index')}>
                            <DashboardButton variant="secondary" className="flex items-center gap-2">
                                <ListBulletIcon className="w-5 h-5" />
                                {t('view_requests')}
                            </DashboardButton>
                        </Link>
                        <DashboardButton 
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 !bg-[#1F2BF3] hover:!bg-[#00D8C0] text-white"
                        >
                            <PlusIcon className="w-5 h-5" />
                            {t('add_appointment')}
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
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="2xl">
                <form onSubmit={submit} className="bg-white dark:bg-[#0A0A0A] overflow-hidden rounded-[2rem]">
                    {/* Header with Gradient Background */}
                    <div className="relative px-8 py-10 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] overflow-hidden">
                        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                        <div className="relative z-10 flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white shadow-xl">
                                <CalendarDaysIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">
                                    {t('add_event')}
                                </h2>
                                <p className="text-white/70 text-sm font-bold tracking-tight">{t('manually_block_schedule')}</p>
                            </div>
                        </div>
                        {/* Decorative Circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Section 1: Basic Information */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <InformationCircleIcon className="w-4 h-4 text-[#1F2BF3]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('basic_information', { defaultValue: 'Informations de base' })}</span>
                            </div>
                            
                            <DashboardInput
                                label={t('event_title')}
                                placeholder="e.g. Client Design Sync"
                                icon={PencilSquareIcon}
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                        {t('event_type')}
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
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: eventTypes.find(t => t.id === data.type)?.color }} />
                                    </div>
                                    <InputError message={errors.type} />
                                </div>

                                <DashboardInput
                                    label={t('date')}
                                    type="date"
                                    icon={CalendarDaysIcon}
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                />
                                <InputError message={errors.date} />
                            </div>
                        </div>

                        {/* Section 2: Timing */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <ClockIcon className="w-4 h-4 text-[#1F2BF3]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('timing_duration', { defaultValue: 'Timing et Durée' })}</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <DashboardInput
                                    label={t('start_time')}
                                    type="time"
                                    icon={ClockIcon}
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                />
                                <DashboardInput
                                    label={t('end_time')}
                                    type="time"
                                    icon={ClockIcon}
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Section 3: Client & Notes */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <UserIcon className="w-4 h-4 text-[#1F2BF3]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('client_and_details', { defaultValue: 'Client et Détails' })}</span>
                            </div>

                            <div className="p-6 bg-gray-50 dark:bg-black/20 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${isWithClient ? 'bg-[#1F2BF3] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}>
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <label htmlFor="isWithClient" className="text-sm font-black text-gray-700 dark:text-gray-300 cursor-pointer select-none uppercase tracking-tighter">
                                            {t('appointment_with_client', { defaultValue: 'Rendez-vous avec un client' })}
                                        </label>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => setIsWithClient(!isWithClient)}
                                        className={`w-12 h-6 rounded-full transition-all relative ${isWithClient ? 'bg-[#1F2BF3]' : 'bg-gray-200 dark:bg-gray-800'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isWithClient ? 'left-7' : 'left-1'}`} />
                                    </button>
                                    <input 
                                        type="checkbox" 
                                        id="isWithClient"
                                        checked={isWithClient}
                                        onChange={e => setIsWithClient(e.target.checked)}
                                        className="hidden"
                                    />
                                </div>

                                {isWithClient && (
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                            {t('select_client', { defaultValue: 'Sélectionner un client' })}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#1F2BF3] transition-colors" />
                                            </div>
                                            <select
                                                value={data.client_id}
                                                onChange={e => setData('client_id', e.target.value)}
                                                className="w-full bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-xl shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 pl-11 py-3.5 text-sm font-bold appearance-none"
                                                required={isWithClient}
                                            >
                                                <option value="">{t('choose_a_client', { defaultValue: 'Choisir un client' })}</option>
                                                {clients.map(client => (
                                                    <option key={client.id} value={client.id}>{client.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <InputError message={errors.client_id} />
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-2">
                                        {t('notes')}
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                        className="w-full bg-white dark:bg-black/40 border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl shadow-sm focus:ring-4 focus:ring-[#1F2BF3]/10 focus:border-[#1F2BF3] transition-all duration-300 px-5 py-4 text-sm font-bold min-h-[120px]"
                                        placeholder={t('any_extra_details')}
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-end gap-4">
                        <DashboardButton 
                            type="button" 
                            variant="secondary" 
                            onClick={() => setShowAddModal(false)}
                            className="!px-8 border-none shadow-none hover:bg-gray-200 dark:hover:bg-white/10"
                        >
                            {t('cancel')}
                        </DashboardButton>
                        <DashboardButton 
                            type="submit" 
                            disabled={processing}
                            className="!bg-[#1F2BF3] hover:!bg-[#00D8C0] text-white !px-12 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                        >
                            {t('create_event', { defaultValue: 'Créer un événement' })}
                        </DashboardButton>
                    </div>
                </form>
            </Modal>

            {/* View Appointment Modal */}
            <Modal show={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="xl">
                {selectedEvent && (
                    <div className="bg-white dark:bg-[#0A0A0A] overflow-hidden rounded-[2rem]">
                        {/* Header with Gradient Background */}
                        <div className="relative px-8 py-10 bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] overflow-hidden">
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                            <div className="relative z-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white shadow-xl">
                                        <InformationCircleIcon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">
                                            {t('appointment_details', { defaultValue: 'Détails du rendez-vous' })}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                                                {selectedEvent.type?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowViewModal(false)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10"
                                >
                                    <PlusIcon className="w-6 h-6 rotate-45" />
                                </button>
                            </div>
                            {/* Decorative Circles */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Event Basics */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <TagIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('event_info', { defaultValue: 'Informations Événement' })}</span>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                                    {selectedEvent.title}
                                </h3>
                            </div>

                            {/* Time & Duration Card */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-white/[0.08] hover:shadow-lg hover:shadow-blue-500/5 group">
                                    <div className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-sm text-[#1F2BF3] group-hover:scale-110 transition-transform">
                                        <ClockIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">{t('from_label')}</span>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                                            {new Date(selectedEvent.start).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                        </p>
                                    </div>
                                </div>
                                {selectedEvent.end && (
                                    <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-white/[0.08] hover:shadow-lg hover:shadow-blue-500/5 group">
                                        <div className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-sm text-[#00D8C0] group-hover:scale-110 transition-transform">
                                            <ClockIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">{t('to_label')}</span>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {new Date(selectedEvent.end).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Client & Responsibility */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserIcon className="w-4 h-4 text-[#1F2BF3]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('stakeholders', { defaultValue: 'Parties Prenantes' })}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedEvent.client_name ? (
                                        <div className="p-6 bg-gradient-to-br from-[#1F2BF3]/5 to-transparent dark:from-[#1F2BF3]/10 rounded-[2rem] border border-[#1F2BF3]/10 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center border border-[#1F2BF3]/20 shadow-sm text-[#1F2BF3]">
                                                    <UserIcon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1F2BF3] block mb-0.5">{t('client', { defaultValue: 'Client' })}</span>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEvent.client_name}</p>
                                                </div>
                                            </div>
                                            {selectedEvent.client_phone && (
                                                <div className="flex items-center gap-3 pt-2 border-t border-[#1F2BF3]/10">
                                                    <PhoneIcon className="w-4 h-4 text-[#00D8C0]" />
                                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{selectedEvent.client_phone}</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 italic font-bold text-xs">N/A</div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('no_client_associated', { defaultValue: 'Aucun client associé' })}</p>
                                        </div>
                                    )}

                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 space-y-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-0.5">{t('responsible_person', { defaultValue: 'Responsable' })}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-black text-gray-600 dark:text-gray-300 text-xs">
                                                {selectedEvent.member?.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <p className="text-sm font-black text-gray-900 dark:text-white">{selectedEvent.member}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            {selectedEvent.notes && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <PencilSquareIcon className="w-4 h-4 text-[#1F2BF3]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{t('additional_notes', { defaultValue: 'Notes Additionnelles' })}</span>
                                    </div>
                                    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <PencilSquareIcon className="w-20 h-20 rotate-12" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 italic">
                                            "{selectedEvent.notes}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                            <DashboardButton 
                                onClick={() => setShowViewModal(false)}
                                className="w-full !bg-white dark:!bg-white/5 !text-gray-900 dark:!text-white border border-gray-200 dark:border-white/10 shadow-sm hover:!bg-gray-50 dark:hover:!bg-white/10 transition-all rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs"
                            >
                                {t('close')}
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
