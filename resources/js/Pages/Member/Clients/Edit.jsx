import React, { useState } from 'react';
import MemberLayout from '@/Layouts/MemberLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { FileIcon, XMarkIcon, PhotoIcon, DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Edit({ auth, client }) {
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'project_manager';
    const Layout = isAdmin ? AdminLayout : MemberLayout;
    const updateRoute = isAdmin ? 'admin.clients.update' : 'member.clients.update';

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        whatsapp: client.whatsapp || '',
        company_name: client.company_name || '',
        city: client.city || '',
        address: client.address || '',
        website: client.website || '',
        logo: null,
        notes: client.notes || '',
        status: client.status || 'prospect',
        contact_method: client.contact_method || 'whatsapp',
        contact_date: client.contact_date || new Date().toISOString().split('T')[0],
        files: [],
    });

    const [logoPreview, setLogoPreview] = useState(client.logo ? `/storage/${client.logo}` : null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFilesChange = (e) => {
        const newFiles = Array.from(e.target.files);
        setData('files', [...data.files, ...newFiles]);
    };

    const removeNewFile = (index) => {
        const newFiles = [...data.files];
        newFiles.splice(index, 1);
        setData('files', newFiles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(updateRoute, client.id), {
            forceFormData: true,
            onError: (errors) => {
                console.error('Update failed:', errors);
            }
        });
    };

    return (
        <Layout auth={auth}>
            <Head title="Edit Professional Client" />

            <DashboardPage 
                title="Edit Professional Client"
                description={`Update profile and documentation for ${client.name}.`}
                actions={
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Go Back
                    </DashboardButton>
                }
            >
                <DashboardCard className="max-w-5xl mx-auto">
                    <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">
                        
                        {/* Section 1: Basic & Business Identity */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-[#1F2BF3] uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">Business Identity</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                                {/* Logo Upload */}
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Company Logo</label>
                                    <div className="relative group">
                                        <div className="w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-[#1F2BF3]/50">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <PhotoIcon className="w-10 h-10 text-gray-300 mb-2" />
                                                    <span className="text-[10px] font-bold text-gray-400">Click to upload</span>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                onChange={handleLogoChange}
                                                accept="image/*"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    {errors.logo && <p className="mt-1 text-sm text-red-500 font-bold">{errors.logo}</p>}
                                </div>

                                {/* Main Business Info */}
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Full Name / Contact Person</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Company Name</label>
                                        <input
                                            type="text"
                                            value={data.company_name}
                                            onChange={e => setData('company_name', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        />
                                        {errors.company_name && <p className="mt-1 text-sm text-red-500 font-bold">{errors.company_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Website</label>
                                        <input
                                            type="url"
                                            value={data.website}
                                            onChange={e => setData('website', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        />
                                        {errors.website && <p className="mt-1 text-sm text-red-500 font-bold">{errors.website}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Communication */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-[#1F2BF3] uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">Communication & Location</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500 font-bold">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Phone Number</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500 font-bold">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">WhatsApp Number</label>
                                    <input
                                        type="text"
                                        value={data.whatsapp}
                                        onChange={e => setData('whatsapp', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    />
                                    {errors.whatsapp && <p className="mt-1 text-sm text-red-500 font-bold">{errors.whatsapp}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">City</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-500 font-bold">{errors.city}</p>}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Full Address</label>
                                    <input
                                        type="text"
                                        value={data.address}
                                        onChange={e => setData('address', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-500 font-bold">{errors.address}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 3: CRM & Documentation */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-[#1F2BF3] uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-2">CRM & Documentation</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Status</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    >
                                        <option value="prospect">Prospect</option>
                                        <option value="interested">Interested</option>
                                        <option value="client">Client</option>
                                        <option value="not_interested">Not Interested</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Preferred Contact Method</label>
                                    <select
                                        value={data.contact_method}
                                        onChange={e => setData('contact_method', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    >
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="call">Phone Call</option>
                                        <option value="meeting">Meeting</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Next Contact Date</label>
                                    <input
                                        type="date"
                                        value={data.contact_date}
                                        onChange={e => setData('contact_date', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Professional Notes</label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                    rows="4"
                                />
                                {errors.notes && <p className="mt-1 text-sm text-red-500 font-bold">{errors.notes}</p>}
                            </div>

                            {/* Existing Files */}
                            {client.files && client.files.length > 0 && (
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Existing Documents</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {client.files.map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-3 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <FileIcon className="w-5 h-5 text-[#1F2BF3]" />
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{file.original_name}</span>
                                                </div>
                                                <a href={`/storage/${file.file_path}`} target="_blank" className="text-[10px] font-black text-[#1F2BF3] uppercase">View</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Multiple File Upload */}
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Attach More Documents</label>
                                <div className="relative group">
                                    <div className="w-full py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-2xl flex flex-col items-center justify-center transition-all group-hover:border-[#1F2BF3]/50">
                                        <DocumentIcon className="w-10 h-10 text-gray-300 mb-2" />
                                        <span className="text-sm font-bold text-gray-400">Add more files...</span>
                                        <input 
                                            type="file" 
                                            multiple
                                            onChange={handleFilesChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* New Files List Preview */}
                                {data.files.length > 0 && (
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {data.files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="p-2 bg-[#1F2BF3]/10 rounded-lg">
                                                        <FileIcon className="w-5 h-5 text-[#1F2BF3]" />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{file.name}</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeNewFile(index)}
                                                    className="p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <DashboardButton 
                                type="submit" 
                                disabled={processing} 
                                className="w-full md:w-auto"
                            >
                                {processing ? 'Updating...' : 'Save Changes'}
                            </DashboardButton>
                        </div>
                    </form>
                </DashboardCard>
            </DashboardPage>
        </Layout>
    );
}
