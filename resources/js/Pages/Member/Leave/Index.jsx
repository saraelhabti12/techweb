import MemberLayout from '@/Layouts/MemberLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, CalendarDaysIcon, ClockIcon, PaperAirplaneIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function MemberLeaves({ auth, requests, balance, taken }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        type: 'vacation',
        start_date: '',
        end_date: '',
        reason: '',
        attachment: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('member.leaves.store'), {
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

    return (
        <MemberLayout auth={auth}>
            <DashboardPage 
                title="Mes Congés & Absences"
                description="Suivez vos demandes et votre solde de congés."
                actions={
                    <DashboardButton onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Nouvelle Demande
                    </DashboardButton>
                }
            >
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <DashboardCard className="relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl">
                                <CalendarDaysIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Solde Restant</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{balance} Jours</h3>
                            </div>
                        </div>
                    </DashboardCard>
                    <DashboardCard className="relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl">
                                <ClockIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Jours Pris</p>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">{taken} Jours</h3>
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* Requests List */}
                <DashboardCard title="Historique des demandes">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Dates</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Note Admin</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
                                            {request.type.replace('_', ' ')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Du {new Date(request.start_date).toLocaleDateString()} au {new Date(request.end_date).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusColor(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 italic">
                                            {request.admin_comment || '---'}
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                                            Aucune demande enregistrée.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                {/* Request Modal */}
                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nouvelle Demande de Congé">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type de congé</label>
                            <select 
                                value={data.type} 
                                onChange={e => setData('type', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all"
                            >
                                <option value="vacation">Congés Payés</option>
                                <option value="sick_leave">Arrêt Maladie</option>
                                <option value="remote_work">Télétravail</option>
                                <option value="personal_day_off">Journée Personnelle</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date de début</label>
                                <input 
                                    type="date" 
                                    value={data.start_date} 
                                    onChange={e => setData('start_date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                    required
                                />
                                {errors.start_date && <p className="text-rose-500 text-[10px] font-bold">{errors.start_date}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date de fin</label>
                                <input 
                                    type="date" 
                                    value={data.end_date} 
                                    onChange={e => setData('end_date', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold"
                                    required
                                />
                                {errors.end_date && <p className="text-rose-500 text-[10px] font-bold">{errors.end_date}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Motif / Justification</label>
                            <textarea 
                                value={data.reason} 
                                onChange={e => setData('reason', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold transition-all"
                                rows="3"
                                placeholder="Expliquez brièvement votre demande..."
                                required
                            ></textarea>
                            {errors.reason && <p className="text-rose-500 text-[10px] font-bold">{errors.reason}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Pièce jointe (Optionnel)</label>
                            <input 
                                type="file" 
                                onChange={e => setData('attachment', e.target.files[0])}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition-all"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <DashboardButton variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
                                Annuler
                            </DashboardButton>
                            <DashboardButton type="submit" disabled={processing}>
                                Envoyer la demande
                            </DashboardButton>
                        </div>
                    </form>
                </Modal>
            </DashboardPage>
        </MemberLayout>
    );
}
