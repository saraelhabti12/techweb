import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { CalendarDaysIcon, ListBulletIcon } from '@heroicons/react/24/outline';

export default function Calendar({ auth, events }) {
    const handleEventClick = (info) => {
        const { member, client_phone, notes } = info.event.extendedProps;
        // You might want to replace this with a beautiful modal later
        alert(`
            Visit: ${info.event.title}
            Member: ${member}
            Phone: ${client_phone}
            Notes: ${notes || 'No notes'}
        `);
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="Appointments Calendar" />

            <DashboardPage 
                title="Studio Schedule"
                description="Monitor and manage all confirmed studio visits and team consultations."
                actions={
                    <Link href={route('admin.appointments.index')}>
                        <DashboardButton variant="secondary" className="flex items-center gap-2">
                            <ListBulletIcon className="w-5 h-5" />
                            View Requests
                        </DashboardButton>
                    </Link>
                }
            >
                <DashboardCard className="!p-8 overflow-hidden border-transparent shadow-xl ring-1 ring-gray-100 dark:ring-gray-800">
                    <div className="calendar-container">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            eventClick={handleEventClick}
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            eventTimeFormat={{
                                hour: 'numeric',
                                minute: '2-digit',
                                meridiem: 'short'
                            }}
                            height="auto"
                        />
                    </div>
                </DashboardCard>
            </DashboardPage>

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
                    background: linear-gradient(135deg, #1F2BF3 0%, #00D8C0 100%) !important;
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
