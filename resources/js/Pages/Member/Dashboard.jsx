import React from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { router } from "@inertiajs/react";

export default function MemberDashboard({ auth, tasks, stats }) {
    const [qr, setQr] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

const [filterYear, setFilterYear] = useState('all');
const [filterMonth, setFilterMonth] = useState('all');
const [filterDay, setFilterDay] = useState('all');

const years = Array.from(new Set(tasks.map(task => new Date(task.due_date).getFullYear()))).sort();
const months = Array.from(new Set(tasks.map(task => new Date(task.due_date).getMonth() + 1))).sort();
const days = Array.from(new Set(tasks.map(task => new Date(task.due_date).getDate()))).sort();

const filteredTasks = tasks.filter(task => {
    const due = new Date(task.due_date);
    const matchYear = filterYear === 'all' || due.getFullYear() === parseInt(filterYear);
    const matchMonth = filterMonth === 'all' || due.getMonth() + 1 === parseInt(filterMonth);
    const matchDay = filterDay === 'all' || due.getDate() === parseInt(filterDay);
    return matchYear && matchMonth && matchDay;
});


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        fetch(route("attendance.qr"), {
            headers: {
                "Accept": "application/json", 
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.qr) {
                    setQr(data.qr);
                } else {
                    console.error("No QR code in response:", data);
                }
            })
            .catch((err) => console.error("Error fetching QR:", err));

        return () => clearInterval(timer);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const formattedDate = currentTime.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    return (
        <MemberLayout auth={auth}>
            <Head title="Dashboard" />

            <div className="rounded-xl p-6 mb-6 shadow-lg border border-purple-300/40 space-y-8">
            
                <div className="bg-purple-10/90  rounded-xl p-6 mb-6 shadow-lg border border-purple-300/40">
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        
                        <div>
                            <h1 className="text-3xl font-bold text-black">Welcome back,<span className="text-purple-600">{auth.user.name}!</span></h1>
                            <p className="mt-2 text-black text-sm">Here's what's happening today</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-black">{formattedTime}</div>
                            <div className="text-sm opacity-90">{formattedDate}</div>
                        </div>
                    </div>
                </div>

                <div className=" bg-purple-10/90 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className='bg-gray-200 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6 border border-purple-200'>
                        <StatCard
                            title="To Do"
                            value={stats.todo}
                            description="Tasks waiting to start"
                            color=""
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            }
                        />
                    </div>

                    <div className='bg-gray-200 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6 border border-purple-200'>
                        <StatCard
                            title="In Progress"
                            value={stats.in_progress}
                            description="Active tasks"
                            color=""
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            }
                        />
                    </div>

                    <div className='bg-gray-200 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6 p-6 mb-6 border border-purple-200'>
                        <StatCard
                            title="Completed"
                            value={stats.done}
                            description="Finished tasks"
                            color="text-purple-600"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                <div className="bg-purple-10/90 dark:bg-gray-100 border border-purple-200 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Daily Attendance </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Mark your attendance</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">
                                    Scan this QR code with your mobile device to register your attendance for today.
                                </p>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border border-purple-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Last scanned: {auth.user.last_attendance_at || 'Never'}
                                </div>
                            </div>
                            <div className="flex flex-col items-center border border-purple-200">
                                {qr ? (
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <img
                                            src={`data:image/png;base64,${qr}`}
                                            alt="QR Code"
                                            className="w-40 h-40"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <p>Loading QR...</p>
                                    </div>
                                )}
                                <p className="mt-3 text-sm text-gray-700 dark:text-gray-400">Scan this QR code</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-10/90 border border-purple-200 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white ">Your Tasks</h2>
                            <Link
                                href={route('member.tasks.index')}
                                className=" text-gray-900 dark:text-teal-400 hover:underline flex items-center"
                            >
                                View All
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {tasks.slice(0, 5).map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))}
                        {tasks.length === 0 && (
                            <div className="p-6 text-center">
                                <div className="text-gray-400 dark:text-gray-500 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">No tasks assigned yet</p>
                                <Link
                                    href={route('member.tasks.index')}
                                    className="inline-block mt-3 text-purple-600 dark:text-teal-400 hover:underline text-sm"
                                >
                                    Check for new tasks
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-purple-10/90 border border-purple-200 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">

                        <QuickAction
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            title="My Attendance"
                            link={route('member.myAttendance')}
                        />
                        <QuickAction
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            }
                            title="Settings"
                            link={route('profile.edit')}
                        />
                    </div>
                </div>
            </div>

        </MemberLayout>
    );
}

const StatCard = ({ title, value, description, color, icon }) => {
    const colors = {
        yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
        blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
        green: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    };

    return (
        <div className={`${colors[color]} rounded-xl p-6 flex items-start gap-4 h-full`}>
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
                {description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{description}</p>
                )}
            </div>
        </div>
    );
};

const TaskItem = ({ task }) => {
    const statusColors = {
        todo: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
        in_progress: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
        done: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    };

    const priorityColors = {
        high: 'text-red-500',
        medium: 'text-yellow-500',
        low: 'text-gray-500'
    };

    return (
        <Link
            href={route('member.tasks.progress', task.id)}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                    <div className={`mt-1 w-3 h-3 rounded-full ${priorityColors[task.priority] || 'bg-gray-300'}`}></div>
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">{task.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {task.project?.name} • Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                        </p>
                    </div>
                </div>
                <span className={`${statusColors[task.status]} text-xs px-3 py-1 rounded-full`}>
                    {task.status.replace('_', ' ')}
                </span>
            </div>
        </Link>
    );
};

const QuickAction = ({ icon, title, link }) => {
    return (
        <Link
            href={link}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors group"
        >
            <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-full text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white dark:group-hover:bg-teal-700 transition-colors">
                {icon}
            </div>
            <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {title}
            </span>
        </Link>
    );
};
