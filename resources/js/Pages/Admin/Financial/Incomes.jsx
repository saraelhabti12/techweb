import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function Incomes({ auth, incomes, clients, projects, invoices }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        client_id: '',
        project_id: '',
        invoice_id: '',
        total_amount: '',
        paid_amount: '',
        remaining_amount: '',
        status: 'unpaid',
        payment_date: new Date().toISOString().split('T')[0],
        notes: '',
        proof: null
    });

    const openModal = (income = null) => {
        if (income) {
            setEditingIncome(income);
            setData({
                client_id: income.client_id,
                project_id: income.project_id || '',
                invoice_id: income.invoice_id || '',
                total_amount: income.total_amount,
                paid_amount: income.paid_amount,
                remaining_amount: income.remaining_amount,
                status: income.status,
                payment_date: income.payment_date ? income.payment_date.split('T')[0] : '',
                notes: income.notes || '',
                proof: null
            });
        } else {
            setEditingIncome(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIncome) {
            post(route('admin.incomes.update', editingIncome.id), { 
                _method: 'put', 
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                } 
            });
        } else {
            post(route('admin.incomes.store'), { 
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                } 
            });
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Suivi des Revenus"
                actions={<DashboardButton onClick={() => openModal()}><PlusIcon className="w-4 h-4 mr-2" />Enregistrer un Paiement Client</DashboardButton>}
            >
                <DashboardCard>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Client</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Projet / Facture</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Montant Payé</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Statut</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map(i => (
                                <tr key={i.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-bold text-gray-900 dark:text-white">{i.client?.name}</td>
                                    <td className="p-4">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{i.project?.name || 'N/A'}</p>
                                        <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Inv: {i.invoice?.invoice_number || 'N/A'}</p>
                                    </td>
                                    <td className="p-4 font-black text-emerald-500">+{i.paid_amount} DH</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${i.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                            {i.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {i.proof_path && <a href={`/storage/${i.proof_path}`} target="_blank" className="p-2 text-gray-400 hover:text-indigo-500"><EyeIcon className="w-5 h-5" /></a>}
                                            <button onClick={() => openModal(i)} className="p-2 text-gray-400 hover:text-indigo-500"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => confirm('Supprimer ?') && destroy(route('admin.incomes.destroy', i.id))} className="p-2 text-gray-400 hover:text-rose-500"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DashboardCard>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Détails du Revenu">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <select value={data.client_id} onChange={e => setData('client_id', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required>
                                    <option value="">Client</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.client_id && <p className="text-rose-500 text-[10px] font-bold">{errors.client_id}</p>}
                            </div>
                            <div className="space-y-1">
                                <select value={data.project_id} onChange={e => setData('project_id', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold">
                                    <option value="">Projet</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                {errors.project_id && <p className="text-rose-500 text-[10px] font-bold">{errors.project_id}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <input type="number" placeholder="Montant Total" value={data.total_amount} onChange={e => {
                                    const total = parseFloat(e.target.value) || 0;
                                    const paid = parseFloat(data.paid_amount) || 0;
                                    setData(d => ({...d, total_amount: e.target.value, remaining_amount: (total - paid).toFixed(2)}));
                                }} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required />
                                {errors.total_amount && <p className="text-rose-500 text-[10px] font-bold">{errors.total_amount}</p>}
                            </div>
                            <div className="space-y-1">
                                <input type="number" placeholder="Montant Payé" value={data.paid_amount} onChange={e => {
                                    const paid = parseFloat(e.target.value) || 0;
                                    const total = parseFloat(data.total_amount) || 0;
                                    setData(d => ({...d, paid_amount: e.target.value, remaining_amount: (total - paid).toFixed(2)}));
                                }} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required />
                                {errors.paid_amount && <p className="text-rose-500 text-[10px] font-bold">{errors.paid_amount}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold">
                                    <option value="unpaid">Non payé</option>
                                    <option value="partial">Partiel</option>
                                    <option value="paid">Payé</option>
                                </select>
                                {errors.status && <p className="text-rose-500 text-[10px] font-bold">{errors.status}</p>}
                            </div>
                            <div className="space-y-1">
                                <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" />
                                {errors.payment_date && <p className="text-rose-500 text-[10px] font-bold">{errors.payment_date}</p>}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <input type="file" onChange={e => setData('proof', e.target.files[0])} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold p-2" />
                            {errors.proof && <p className="text-rose-500 text-[10px] font-bold">{errors.proof}</p>}
                        </div>
                        <DashboardButton type="submit" className="w-full" disabled={processing}>Enregistrer</DashboardButton>
                    </form>
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
