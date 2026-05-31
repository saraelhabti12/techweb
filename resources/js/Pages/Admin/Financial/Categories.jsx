import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Modal from '@/Components/Modal';

export default function Categories({ auth, categories }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        color: '#1F2BF3'
    });

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setData({ name: category.name, color: category.color || '#1F2BF3' });
        } else {
            setEditingCategory(null);
            reset();
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('admin.expense-categories.update', editingCategory.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.expense-categories.store'), {
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
                title="Catégories de Dépenses"
                actions={
                    <DashboardButton onClick={() => openModal()} className="flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Nouvelle Catégorie
                    </DashboardButton>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map(category => (
                        <DashboardCard key={category.id} className="relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: category.color }}></div>
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-900 dark:text-white">{category.name}</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(category)} className="p-2 text-gray-400 hover:text-indigo-500 transition-colors">
                                        <PencilSquareIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => confirm('Supprimer ?') && destroy(route('admin.expense-categories.destroy', category.id))} className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </DashboardCard>
                    ))}
                </div>

                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Modifier la Catégorie" : "Nouvelle Catégorie"}>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Nom</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all font-bold" required />
                            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Couleur</label>
                            <input type="color" value={data.color} onChange={e => setData('color', e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-[#1F2BF3] transition-all cursor-pointer" />
                            {errors.color && <p className="text-rose-500 text-xs mt-1">{errors.color}</p>}
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <DashboardButton variant="secondary" onClick={() => setIsModalOpen(false)} type="button">Annuler</DashboardButton>
                            <DashboardButton type="submit" disabled={processing}>{editingCategory ? "Mettre à jour" : "Ajouter"}</DashboardButton>
                        </div>
                    </form>
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
