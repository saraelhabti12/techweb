import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { CalendarIcon, UserIcon, CheckCircleIcon, XCircleIcon, ChatBubbleLeftEllipsisIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';
import { useTranslation } from 'react-i18next';

export default function AdminLeaves({ auth, requests, pending_count }) {
    const { t } = useTranslation();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, put, processing, reset } = useForm({
        status: '',
        admin_comment: ''
    });

    const openModal = (request) => {
        setSelectedRequest(request);
        setData({
            status: request.status,
            admin_comment: request.admin_comment || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (status) => {
        data.status = status;
        put(route('admin.leaves.update', selectedRequest.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-600';
            case 'rejected': return 'bg-rose-100 text-rose-600';
            default: return 'bg-amber-100 text-amber-600';
        }
    };

    const getLeaveTypeLabel = (type) => {
        const types = {
            vacation: t('vacation_label'),
            sick_leave: t('sick_leave_label'),
            remote_work: t('remote_work_label'),
            personal_day_off: t('personal_day_off_label')
        };
        return types[type] || type;
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title={t('leave_management')}
                description={t('pending_leaves_desc', { count: pending_count })}
            >
                <DashboardCard>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('member')}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('type')}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('dates')}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">{t('status')}</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                    {request.user.name.substring(0, 2)}
                                                </div>
                                                <span className="font-bold text-gray-900 dark:text-white">{request.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                                            {getLeaveTypeLabel(request.type)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {t('from')} {new Date(request.start_date).toLocaleDateString()}
                                            </p>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                {t('to')} {new Date(request.end_date).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(request.status)}`}>
                                                {t(request.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => openModal(request)}
                                                className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"
                                            >
                                                <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('leave_details')}>
                    {selectedRequest && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('member_reason')}</label>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl italic">
                                        "{selectedRequest.reason}"
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('attachment')}</label>
                                    <div className="mt-2">
                                        {selectedRequest.attachment_path ? (
                                            <a 
                                                href={`/storage/${selectedRequest.attachment_path}`} 
                                                target="_blank" 
                                                className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                                            >
                                                <PaperClipIcon className="w-4 h-4" />
                                                {t('view_document')}
                                            </a>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">{t('no_attachment')}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('admin_comment')}</label>
                                <textarea 
                                    value={data.admin_comment} 
                                    onChange={e => setData('admin_comment', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all"
                                    rows="3"
                                    placeholder={t('add_note_placeholder')}
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <DashboardButton 
                                    variant="secondary" 
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={processing}
                                >
                                    {t('close')}
                                </DashboardButton>
                                <DashboardButton 
                                    variant="danger" 
                                    onClick={() => handleSubmit('rejected')}
                                    disabled={processing}
                                >
                                    {t('reject')}
                                </DashboardButton>
                                <DashboardButton 
                                    variant="primary" 
                                    onClick={() => handleSubmit('approved')}
                                    disabled={processing}
                                >
                                    {t('approve')}
                                </DashboardButton>
                            </div>
                        </div>
                    )}
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
