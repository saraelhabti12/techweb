import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function Expenses({ auth, expenses, categories, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        title: '',
        category_id: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'Virement',
        notes: '',
        user_id: '',
        receipt: null
    });

    const openModal = (expense = null) => {
        if (expense) {
            setEditingExpense(expense);
            setData({
                title: expense.title,
                category_id: expense.category_id,
                amount: expense.amount,
                date: expense.date.split('T')[0],
                payment_method: expense.payment_method || 'Virement',
                notes: expense.notes || '',
                user_id: expense.user_id || '',
                receipt: null
            });
        } else {
            setEditingExpense(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingExpense) {
            post(route('admin.expenses.update', editingExpense.id), {
                _method: 'put',
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.expenses.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
            destroy(route('admin.expenses.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <DashboardPage 
                title="Suivi des Dépenses"
                description="Gérez toutes vos dépenses professionnelles ici."
                actions={
                    <DashboardButton onClick={() => openModal()} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Ajouter une Dépense
                    </DashboardButton>
                }
            >
                <DashboardCard>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Titre</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Catégorie</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Montant</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Payé Par</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                {expenses.map((expense) => (
                                    <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{expense.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter" style={{ backgroundColor: expense.category?.color + '20', color: expense.category?.color }}>
                                                {expense.category?.name || 'Sans Catégorie'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-black text-rose-500">-{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(expense.amount)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{expense.user?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {expense.receipt_path && (
                                                    <a href={`/storage/${expense.receipt_path}`} target="_blank" className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                                                        <EyeIcon className="w-5 h-5" />
                                                    </a>
                                                )}
                                                <button onClick={() => openModal(expense)} className="p-2 text-gray-400 hover:text-[#1F2BF3] transition-colors">
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(expense.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DashboardCard>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingExpense ? "Modifier la Dépense" : "Ajouter une Dépense"}>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Titre</label>
                                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" required />
                                {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Catégorie</label>
                                <select value={data.category_id} onChange={e => setData('category_id', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" required>
                                    <option value="">Choisir...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.category_id && <p className="text-rose-500 text-xs mt-1">{errors.category_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Montant</label>
                                <input type="number" step="0.01" value={data.amount} onChange={e => setData('amount', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" required />
                                {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Date</label>
                                <input type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" required />
                                {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Méthode de Paiement</label>
                                <select value={data.payment_method} onChange={e => setData('payment_method', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold">
                                    <option value="Virement">Virement</option>
                                    <option value="Espèces">Espèces</option>
                                    <option value="Carte">Carte</option>
                                </select>
                                {errors.payment_method && <p className="text-rose-500 text-xs mt-1">{errors.payment_method}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Payé Par</label>
                                <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold">
                                    <option value="">N/A</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                                {errors.user_id && <p className="text-rose-500 text-xs mt-1">{errors.user_id}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Reçu / Facture (Optionnel)</label>
                            <input type="file" onChange={e => setData('receipt', e.target.files[0])} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" />
                            {errors.receipt && <p className="text-rose-500 text-xs mt-1">{errors.receipt}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Notes</label>
                            <textarea value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" rows="3"></textarea>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <DashboardButton variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Annuler</DashboardButton>
                            <DashboardButton type="submit" disabled={processing}>{editingExpense ? "Mettre à jour" : "Ajouter"}</DashboardButton>
                        </div>
                    </form>
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
