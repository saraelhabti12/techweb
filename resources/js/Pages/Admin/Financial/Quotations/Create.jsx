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
        quotation_number: nextNumber,
        date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
        post(route('admin.quotations.store'));
    };

    return (
        <AdminLayout auth={auth}>
            <Head title="New Quotation" />

            <DashboardPage
                title="Create Quotation"
                description="Fill in the details below to generate a new professional quotation."
                backRoute="admin.quotations.index"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic Info */}
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
                                                <option key={client.id} value={client.id}>{client.name} - {client.company_name}</option>
                                            ))}
                                        </select>
                                        <InputError message={errors.client_id} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Quotation Number" />
                                        <TextInput
                                            value={data.quotation_number}
                                            onChange={(e) => setData('quotation_number', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.quotation_number} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Date" />
                                        <TextInput
                                            type="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="mt-1 block w-full"
                                            required
                                        />
                                        <InputError message={errors.date} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Expiry Date" />
                                        <TextInput
                                            type="date"
                                            value={data.expiry_date}
                                            onChange={(e) => setData('expiry_date', e.target.value)}
                                            className="mt-1 block w-full"
                                        />
                                        <InputError message={errors.expiry_date} className="mt-2" />
                                    </div>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Items / Services">
                                <div className="space-y-4">
                                    <div className="hidden md:grid grid-cols-12 gap-4 px-2 text-xs font-bold text-gray-500 uppercase">
                                        <div className="col-span-6">Description</div>
                                        <div className="col-span-2 text-center">Qty</div>
                                        <div className="col-span-2 text-right">Price</div>
                                        <div className="col-span-2 text-right">Total</div>
                                    </div>

                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {data.items.map((item, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-xl"
                                                >
                                                    <div className="col-span-6">
                                                        <TextInput
                                                            placeholder="Item description..."
                                                            value={item.description}
                                                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                            className="w-full"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <TextInput
                                                            type="number"
                                                            step="0.01"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                            className="w-full text-center"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <TextInput
                                                            type="number"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                            className="w-full text-right"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-span-2 flex items-center justify-between">
                                                        <span className="text-sm font-mono font-bold text-gray-700 dark:text-gray-300">
                                                            {(item.quantity * item.unit_price).toFixed(2)}€
                                                        </span>
                                                        {data.items.length > 1 && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeItem(index)}
                                                                className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    <button 
                                        type="button"
                                        onClick={addItem}
                                        className="flex items-center gap-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition-colors py-2"
                                    >
                                        <Plus className="w-4 h-4" /> Add Line Item
                                    </button>
                                </div>
                            </DashboardCard>

                            <DashboardCard title="Notes & Terms">
                                <textarea
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                                    rows="4"
                                    placeholder="Add any specific notes or terms for this quotation..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                ></textarea>
                            </DashboardCard>
                        </div>

                        {/* Summary */}
                        <div className="space-y-6">
                            <DashboardCard title="Financial Summary">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                                        <span className="text-sm text-gray-500">Subtotal</span>
                                        <span className="font-mono font-bold text-gray-900 dark:text-white">{subtotal.toFixed(2)}€</span>
                                    </div>
                                    
                                    <div>
                                        <InputLabel value="Tax / VAT (€)" />
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            value={data.tax}
                                            onChange={(e) => setData('tax', e.target.value)}
                                            className="mt-1 block w-full text-right"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel value="Discount (€)" />
                                        <TextInput
                                            type="number"
                                            step="0.01"
                                            value={data.discount}
                                            onChange={(e) => setData('discount', e.target.value)}
                                            className="mt-1 block w-full text-right"
                                        />
                                    </div>

                                    <div className="flex justify-between items-center py-4 px-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mt-4">
                                        <span className="text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider text-xs">Total Amount</span>
                                        <span className="text-xl font-mono font-black text-indigo-600 dark:text-indigo-400">
                                            {total.toFixed(2)}€
                                        </span>
                                    </div>

                                    <DashboardButton
                                        type="submit"
                                        variant="primary"
                                        className="w-full justify-center mt-6 py-4"
                                        disabled={processing}
                                    >
                                        <Save className="w-5 h-5" />
                                        {processing ? 'Saving...' : 'Save Quotation'}
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
