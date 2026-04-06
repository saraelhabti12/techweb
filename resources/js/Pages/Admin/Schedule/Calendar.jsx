import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { router } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Calendar({ events, auth }) {
    const handleDateClick = (info) => {
        router.visit(`/admin/schedule/day?date=${info.dateStr}`);
    };

    const handleEventClick = (info) => {
        info.jsEvent.preventDefault();
        router.visit(info.event.url);
    };

    return (
        <AdminLayout auth={auth} title="Calendar">
            <div className="mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Retour
                </button>
            </div>

            {/* Custom CSS */}
            <style>{`
                /* Contour du calendrier avec espace interne */
                .fc {
                    border: 2px solid #e9d5ff; /* violet clair */
                    border-radius: 8px;
                    overflow: hidden;
                    padding: 16px; /* espace entre bordure et contenu */
                }

                /* Bordures des cellules */
                .fc .fc-col-header-cell, .fc .fc-daygrid-day {
                    border: 1px solid #e9d5ff; /* violet clair */
                }

                /* Toolbar (titre + flèches + bouton today) */
                .fc .fc-toolbar-chunk {
                    display: flex;
                    align-items: center;
                    gap: 12px; /* espace entre flèches, titre et today */
                    margin-bottom: 12px; /* espace sous la toolbar */
                }

                /* Flèches navigation (prev / next) */
                .fc .fc-toolbar button:not(.fc-today-button) {
                    color: #c4b5fd; /* violet très clair */
                    border-color: #c4b5fd;
                    background-color: transparent; /* supprimer gris par défaut */
                    font-weight: 600;
                }
                .fc .fc-toolbar button:not(.fc-today-button):hover {
                    background-color: #a78bfa; /* violet plus foncé au hover */
                    color: white;
                }

                /* Bouton Today */
                .fc .fc-today-button {
                    background-color: #8b5cf6; /* violet moyen */
                    color: white !important;  /* forcer texte blanc */
                    font-weight: 600;
                    border-color: #8b5cf6;
                }
                .fc .fc-today-button:hover {
                    background-color: #7c3aed; /* violet foncé au hover */
                }

                /* Highlight today in calendar (case du jour courant) */
                .fc .fc-day-today {
                    background-color: #ede9fe; /* violet très clair */
                }
            `}</style>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventColor="#8b5cf6" /* couleur des événements */
                    height="80vh"
                    firstDay={1}
                    timeZone="local"
                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }}
                />
            </div>
        </AdminLayout>
    );
}
