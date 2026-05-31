import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function Salaries({ auth, salaries, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSalary, setEditingSalary] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        user_id: '',
        type: 'monthly',
        base_salary: '',
        advances: 0,
        deductions: 0,
        bonuses: 0,
        final_paid: '',
        payment_date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const calculateFinal = (base, adv, ded, bonus) => {
        return (parseFloat(base || 0) + parseFloat(bonus || 0)) - (parseFloat(adv || 0) + parseFloat(ded || 0));
    };

    const handleBaseChange = (val) => {
        setData(d => ({ ...d, base_salary: val, final_paid: calculateFinal(val, d.advances, d.deductions, d.bonuses) }));
    };

    const openModal = (salary = null) => {
        if (salary) {
            setEditingSalary(salary);
            setData({
                user_id: salary.user_id,
                type: salary.type,
                base_salary: salary.base_salary,
                advances: salary.advances,
                deductions: salary.deductions,
                bonuses: salary.bonuses,
                final_paid: salary.final_paid,
                payment_date: salary.payment_date.split('T')[0],
                notes: salary.notes || ''
            });
        } else {
            setEditingSalary(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingSalary) {
            put(route('admin.salaries.update', editingSalary.id), { 
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                } 
            });
        } else {
            post(route('admin.salaries.store'), { 
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
                title="Gestion des Salaires"
                actions={<DashboardButton onClick={() => openModal()}><PlusIcon className="w-4 h-4 mr-2" />Enregistrer un Salaire</DashboardButton>}
            >
                <DashboardCard>
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-700">
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Membre</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Type</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Base</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400">Net Payé</th>
                                <th className="p-4 text-xs font-black uppercase text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.map(s => (
                                <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 font-bold text-gray-900 dark:text-white">{s.user?.name}</td>
                                    <td className="p-4 text-xs font-black uppercase text-gray-500 dark:text-gray-400">{s.type}</td>
                                    <td className="p-4 font-medium text-gray-700 dark:text-gray-300">{s.base_salary} DH</td>
                                    <td className="p-4 font-black text-emerald-500">{s.final_paid} DH</td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openModal(s)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors"><PencilSquareIcon className="w-5 h-5" /></button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-rose-500 transition-colors"><TrashIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DashboardCard>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Détails du Salaire">
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-1">
                            <select value={data.user_id} onChange={e => setData('user_id', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required>
                                <option value="">Sélectionner un membre</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            {errors.user_id && <p className="text-rose-500 text-[10px] font-bold">{errors.user_id}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <input type="number" placeholder="Base" value={data.base_salary} onChange={e => handleBaseChange(e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required />
                                {errors.base_salary && <p className="text-rose-500 text-[10px] font-bold">{errors.base_salary}</p>}
                            </div>
                            <div className="space-y-1">
                                <input type="date" value={data.payment_date} onChange={e => setData('payment_date', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required />
                                {errors.payment_date && <p className="text-rose-500 text-[10px] font-bold">{errors.payment_date}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <input type="number" placeholder="Avances" value={data.advances} onChange={e => {
                                    const adv = parseFloat(e.target.value) || 0;
                                    setData(d => ({...d, advances: e.target.value, final_paid: calculateFinal(d.base_salary, adv, d.deductions, d.bonuses)}));
                                }} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" />
                                {errors.advances && <p className="text-rose-500 text-[10px] font-bold">{errors.advances}</p>}
                            </div>
                            <div className="space-y-1">
                                <input type="number" placeholder="Déductions" value={data.deductions} onChange={e => {
                                    const ded = parseFloat(e.target.value) || 0;
                                    setData(d => ({...d, deductions: e.target.value, final_paid: calculateFinal(d.base_salary, d.advances, ded, d.bonuses)}));
                                }} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" />
                                {errors.deductions && <p className="text-rose-500 text-[10px] font-bold">{errors.deductions}</p>}
                            </div>
                            <div className="space-y-1">
                                <input type="number" placeholder="Bonuses" value={data.bonuses} onChange={e => {
                                    const bonus = parseFloat(e.target.value) || 0;
                                    setData(d => ({...d, bonuses: e.target.value, final_paid: calculateFinal(d.base_salary, d.advances, d.deductions, bonus)}));
                                }} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" />
                                {errors.bonuses && <p className="text-rose-500 text-[10px] font-bold">{errors.bonuses}</p>}
                            </div>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <p className="text-xs font-black text-emerald-600 uppercase">Montant Final à Payer</p>
                            <p className="text-2xl font-black text-emerald-500">{data.final_paid} DH</p>
                            {errors.final_paid && <p className="text-rose-500 text-[10px] font-bold">{errors.final_paid}</p>}
                        </div>
                        <div className="space-y-1">
                            <select value={data.type} onChange={e => setData('type', e.target.value)} className="w-full rounded-xl border-none bg-gray-50 dark:bg-gray-800 font-bold" required>
                                <option value="monthly">Mensuel</option>
                                <option value="project">Projet</option>
                            </select>
                            {errors.type && <p className="text-rose-500 text-[10px] font-bold">{errors.type}</p>}
                        </div>
                        <DashboardButton type="submit" className="w-full" disabled={processing}>Enregistrer</DashboardButton>
                    </form>
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
