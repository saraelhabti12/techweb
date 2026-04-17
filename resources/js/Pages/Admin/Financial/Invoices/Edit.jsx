import React, { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { 
    Plus, Trash2, Save, CheckCircle, 
    CreditCard, Calendar, DollarSign, Download, Send
} from 'lucide-react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Edit({ auth, invoice, clients }) {
    const { data, setData, put, processing, errors } = useForm({
        client_id: invoice.client_id,
        invoice_number: invoice.invoice_number,
        date: invoice.date.split('T')[0],
        due_date: invoice.due_date ? invoice.due_date.split('T')[0] : '',
        items: invoice.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price
        })),
        tax: invoice.tax,
        discount: invoice.discount,
        notes: invoice.notes || '',
        status: invoice.status,
    });

    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    const paymentForm = useForm({
        invoice_id: invoice.id,
        amount: (invoice.total - invoice.amount_paid).toFixed(2),
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'Bank Transfer',
        notes: '',
    });

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
        put(route('admin.invoices.update', invoice.id));
    };

    const handleAddPayment = (e) => {
        e.preventDefault();
        paymentForm.post(route('admin.payments.store'), {
            onSuccess: () => {
                setIsPaymentModalOpen(false);
                paymentForm.reset();
            }
        });
    };

    const deletePayment = (id) => {
        if (confirm('Delete this payment record?')) {
            router.delete(route('admin.payments.destroy', id));
        }
    };

    return (
        <AdminLayout auth={auth}>
            <Head title={`Edit Invoice ${invoice.invoice_number}`} />

            <DashboardPage
                title={`Invoice: ${invoice.invoice_number}`}
                description="Manage billing details and track payments for this invoice."
                backRoute="admin.invoices.index"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                        <DashboardCard title="Invoice Details">
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
                                </div>
                                <div>
                                    <InputLabel value="Status" />
                                    <select 
                                        className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                    >
                                        <option value="unpaid">Unpaid</option>
                                        <option value="partial">Partial</option>
                                        <option value="paid">Paid</option>
                                        <option value="late">Late</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Date" />
                                    <TextInput type="date" value={data.date} onChange={e => setData('date', e.target.value)} className="mt-1 block w-full" />
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
                                    <div key={index} className="flex gap-4 items-center">
                                        <TextInput placeholder="Description" value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} className="flex-1" />
                                        <TextInput type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} className="w-20 text-center" />
                                        <TextInput type="number" value={item.unit_price} onChange={e => updateItem(index, 'unit_price', e.target.value)} className="w-32 text-right" />
                                        <button type="button" onClick={() => removeItem(index)} className="text-red-500"><Trash2 className="w-4 h-4"/></button>
                                    </div>
                                ))}
                                <button type="button" onClick={addItem} className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                                    <Plus className="w-4 h-4"/> Add Item
                                </button>
                            </div>
                        </DashboardCard>

                        <div className="flex justify-end gap-3">
                            <DashboardButton type="submit" variant="primary" disabled={processing}>
                                Save Changes
                            </DashboardButton>
                        </div>
                    </form>

                    <div className="space-y-6">
                        <DashboardCard title="Payment Status">
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Amount</span>
                                        <span className="font-bold">{invoice.total}€</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Paid Amount</span>
                                        <span className="font-bold text-green-600">{invoice.amount_paid}€</span>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between font-bold">
                                        <span>Remaining</span>
                                        <span className="text-red-600">{(invoice.total - invoice.amount_paid).toFixed(2)}€</span>
                                    </div>
                                </div>
                                
                                <DashboardButton 
                                    onClick={() => setIsPaymentModalOpen(true)}
                                    variant="secondary" 
                                    className="w-full justify-center"
                                >
                                    <CreditCard className="w-4 h-4"/>
                                    Record Payment
                                </DashboardButton>
                            </div>
                        </DashboardCard>

                        <DashboardCard title="Payment History">
                            <div className="space-y-3">
                                {invoice.payments.length > 0 ? invoice.payments.map(payment => (
                                    <div key={payment.id} className="text-xs p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold">{payment.amount}€</p>
                                            <p className="text-gray-500">{new Date(payment.payment_date).toLocaleDateString()} - {payment.payment_method}</p>
                                        </div>
                                        <button onClick={() => deletePayment(payment.id)} className="text-red-400 hover:text-red-600">
                                            <Trash2 className="w-3.5 h-3.5"/>
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-500 text-xs py-4">No payments recorded yet.</p>
                                )}
                            </div>
                        </DashboardCard>
                    </div>
                </div>

                {/* Payment Modal */}
                <Modal show={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)}>
                    <form onSubmit={handleAddPayment} className="p-6">
                        <h2 className="text-lg font-bold mb-4">Record New Payment</h2>
                        <div className="space-y-4">
                            <div>
                                <InputLabel value="Amount (€)" />
                                <TextInput type="number" step="0.01" value={paymentForm.data.amount} onChange={e => paymentForm.setData('amount', e.target.value)} className="w-full" required />
                            </div>
                            <div>
                                <InputLabel value="Payment Date" />
                                <TextInput type="date" value={paymentForm.data.payment_date} onChange={e => paymentForm.setData('payment_date', e.target.value)} className="w-full" required />
                            </div>
                            <div>
                                <InputLabel value="Method" />
                                <select 
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                                    value={paymentForm.data.payment_method}
                                    onChange={e => paymentForm.setData('payment_method', e.target.value)}
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Notes" />
                                <textarea 
                                    className="w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1"
                                    value={paymentForm.data.notes}
                                    onChange={e => paymentForm.setData('notes', e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <DashboardButton onClick={() => setIsPaymentModalOpen(false)} variant="secondary">Cancel</DashboardButton>
                            <DashboardButton type="submit" variant="primary" disabled={paymentForm.processing}>Save Payment</DashboardButton>
                        </div>
                    </form>
                </Modal>
            </DashboardPage>
        </AdminLayout>
    );
}
