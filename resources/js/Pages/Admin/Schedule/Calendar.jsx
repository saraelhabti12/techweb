import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { router } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';
import DashboardPage from "@/Components/UI/DashboardPage";
import DashboardCard from "@/Components/UI/DashboardCard";
import DashboardButton from "@/Components/UI/DashboardButton";

export default function Calendar({ events, auth }) {
    const handleDateClick = (info) => {
        if (info && info.dateStr) {
            router.visit(`/admin/schedule/day?date=${info.dateStr}`);
        }
    };

    const handleEventClick = (info) => {
        if (info && info.jsEvent) info.jsEvent.preventDefault();
        if (info && info.event && info.event.url) {
            router.visit(info.event.url);
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Schedule Calendar" 
                description="View and manage all scheduled events and tasks in a monthly overview."
                actions={
                    <DashboardButton 
                        variant="secondary" 
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back
                    </DashboardButton>
                }
            >
                <DashboardCard noHover className="p-0 overflow-hidden border-none shadow-none bg-transparent dark:bg-transparent backdrop-blur-none">
                    <style>{`
                        .fc {
                            --fc-border-color: rgba(226, 232, 240, 0.1);
                            --fc-button-bg-color: #1F2BF3;
                            --fc-button-border-color: #1F2BF3;
                            --fc-button-hover-bg-color: #161fcb;
                            --fc-button-hover-border-color: #161fcb;
                            --fc-button-active-bg-color: #161fcb;
                            --fc-button-active-border-color: #161fcb;
                            --fc-event-bg-color: #1F2BF3;
                            --fc-event-border-color: #1F2BF3;
                            --fc-today-bg-color: rgba(31, 43, 243, 0.05);
                            background: transparent;
                            font-family: inherit;
                        }

                        .fc .fc-toolbar-title {
                            font-size: 1.25rem !important;
                            font-weight: 900 !important;
                            text-transform: uppercase !important;
                            letter-spacing: -0.025em !important;
                            color: #111827;
                        }

                        .dark .fc .fc-toolbar-title {
                            color: #ffffff;
                        }

                        .fc .fc-button {
                            padding: 0.6rem 1.2rem !important;
                            font-size: 0.75rem !important;
                            font-weight: 800 !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.05em !important;
                            border-radius: 0.75rem !important;
                            transition: all 0.2s !important;
                        }

                        .fc .fc-button-primary:not(:disabled).fc-button-active, 
                        .fc .fc-button-primary:not(:disabled):active {
                            background-color: #1F2BF3 !important;
                            border-color: #1F2BF3 !important;
                            box-shadow: 0 10px 15px -3px rgba(31, 43, 243, 0.3) !important;
                        }

                        .fc th {
                            padding: 12px 0 !important;
                            font-size: 0.7rem !important;
                            font-weight: 900 !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.1em !important;
                            color: #6b7280 !important;
                            border: none !important;
                        }

                        .fc td {
                            border: 1px solid rgba(226, 232, 240, 0.5) !important;
                        }

                        .dark .fc td {
                            border: 1px solid rgba(255, 255, 255, 0.05) !important;
                        }

                        .fc-theme-standard .fc-scrollgrid {
                            border: none !important;
                        }

                        .fc-daygrid-day-number {
                            font-size: 0.875rem !important;
                            font-weight: 700 !important;
                            padding: 8px !important;
                        }

                        .fc-event {
                            border-radius: 6px !important;
                            padding: 2px 4px !important;
                            font-size: 0.75rem !important;
                            font-weight: 600 !important;
                            border: none !important;
                            box-shadow: 0 4px 6px -1px rgba(31, 43, 243, 0.2) !important;
                        }
                    `}</style>
                    
                    <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 dark:border-white/5 shadow-xl">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            dateClick={handleDateClick}
                            eventClick={handleEventClick}
                            eventColor="#1F2BF3"
                            height="auto"
                            firstDay={1}
                            timeZone="local"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,dayGridWeek'
                            }}
                            eventTimeFormat={{
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            }}
                        />
                    </div>
                </DashboardCard>
            </DashboardPage>
        </AdminLayout>
    );
}
