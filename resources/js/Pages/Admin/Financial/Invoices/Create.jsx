import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Plus, Trash2, Save, X, Calculator, 
    Calendar, User, FileText, Hash, Percent, DollarSign
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create({ auth, clients, nextNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        invoice_number: nextNumber,
        date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0 }],
        tax: 0,
        discount: 0,
        notes: '',
    });

    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const calcSubtotal = data.items.reduce((acc, item) => {
            return acc + (parseFloat(item.quantity) * parseFloat(item.unit_price) || 0);
        }, 0);
        setSubtotal(calcSubtotal);
        setTotal(calcSubtotal + parseFloat(data.tax || 0) - parseFloat(data.discount || 0));
    }, [data.items, data.tax, data.discount]);

    const addItem = () => {
        setData('items', [...data.items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.invoices.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="New Invoice" />

            <DashboardPage
                title="Create Invoice"
                description="Generate a new invoice for billing."
                backRoute="admin.invoices.index"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <DashboardCard title="Basic Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel value="Client" />
                                        <select 
                                            className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                                            value={data.client_id}
                                            onChange={(e) => setData('client_id', e.target.value)}
                                        >
                                            <option value="">Select a client</option>
                                            {clients.map(client => (
                                                <option key={client.id} value={client.id}>{client.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.client_id} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Invoice Number" />
                                        <TextInput value={data.invoice_number} onChange={e => setData('invoice_number', e.target.value)} className="mt-1 block w-full" required />
                                        <InputError message={errors.invoice_number} className="mt-2" />
                                    </div>
                                    <div>
                                        <InputLabel value="Date" />
                                        <TextInput type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="mt-1 block w-full" required />
                                    </div>
                                    <div>
                                        <InputLabel value="Due Date" />
                                        <TextInput type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} className="mt-1 block w-full" />
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Items">
                                <div className="space-y-4">
                                    {data.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-800/20 p-3 rounded-xl">
                                            <TextInput placeholder="Description" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="flex-1" required />
                                            <TextInput type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="w-20 text-center" required />
                                            <TextInput type="number" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', e.target.value)} className="w-32 text-right" required />
                                            <button type="button" onClick={() => removeItem(index)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addItem} className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                                        <Plus className="w-4 h-4"/> Add Item
                                    </button>
                                </div>
                            </DashboardCard>
                        </div>

                        <div className="space-y-6">
                            <DashboardCard title="Summary">
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 text-sm">Subtotal</span>
                                        <span className="font-bold">{subtotal.toFixed(2)}€</span>
                                    </div>
                                    <div>
                                        <InputLabel value="Tax (€)" />
                                        <TextInput type="number" value={data.tax} onChange={e => setData('tax', e.target.value)} className="w-full text-right" />
                                    </div>
                                    <div>
                                        <InputLabel value="Discount (€)" />
                                        <TextInput type="number" value={data.discount} onChange={e => setData('discount', e.target.value)} className="w-full text-right" />
                                    </div>
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex justify-between items-center font-bold">
                                        <span className="text-indigo-700">Total</span>
                                        <span className="text-xl text-indigo-600">{total.toFixed(2)}€</span>
                                    </div>
                                    <DashboardButton type="submit" variant="primary" className="w-full justify-center" disabled={processing}>
                                        <Save className="w-5 h-5" />
                                        Save Invoice
                                    </DashboardButton>
                                </div>
                            </DashboardCard>
                        </div>
                    </div>
                </form>
            </DashboardPage>
        </AdminLayout>
    );
}
