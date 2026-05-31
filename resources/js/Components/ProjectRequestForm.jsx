import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, MessageSquare, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ProjectRequestForm({ creators = [] }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, reset, errors, recentlySuccessful } = useForm({
        full_name: '',
        contact_number: '',
        company_name: '',
        email: '',
        services: [],
        message: '',
        needs_creator: false,
        selected_creators: [],
    });

    const toggleCreator = (creatorId) => {
        const current = [...data.selected_creators];
        const index = current.indexOf(creatorId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(creatorId);
        }
        setData('selected_creators', current);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    const serviceOptions = [
        { id: "Website Creation", label: t('website_creation') },
        { id: "E-commerce", label: t('ecommerce') },
        { id: "Photography", label: t('photography') },
        { id: "SEO & Marketing", label: t('seo_marketing') },
        { id: "Graphic Design", label: t('graphic_design') },
        { id: "Advertising", label: t('advertising') }
    ];

    return (
        <div className="relative">
            <AnimatePresence>
                {recentlySuccessful && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-500"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs">{t('success_sent')}</p>
                            <p className="text-xs opacity-80">{t('contact_12h')}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('full_name_label')}</label>
                        <input
                            type="text"
                            required
                            value={data.full_name}
                            onChange={(e) => setData('full_name', e.target.value)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                            placeholder={t('placeholder_full_name')}
                        />
                        {errors.full_name && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.full_name}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('contact_number_label')}</label>
                        <input
                            type="tel"
                            required
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                            placeholder={t('placeholder_contact')}
                        />
                        {errors.contact_number && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.contact_number}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('email_address')}</label>
                        <input
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                            placeholder={t('placeholder_email')}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.email}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('company_name_label')}</label>
                        <input
                            type="text"
                            value={data.company_name}
                            onChange={(e) => setData('company_name', e.target.value)}
                            className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none"
                            placeholder={t('placeholder_company')}
                        />
                        {errors.company_name && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.company_name}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('choose_services')}</label>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                        {serviceOptions.map((service) => (
                            <label key={service.id} className="flex items-center gap-2 cursor-pointer group/label">
                                <input
                                    type="checkbox"
                                    checked={data.services.includes(service.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setData('services', [...data.services, service.id]);
                                        } else {
                                            setData('services', data.services.filter(s => s !== service.id));
                                        }
                                    }}
                                    className="w-4 h-4 rounded border-gray-300 text-[#1F2BF3] focus:ring-[#1F2BF3] bg-white dark:bg-gray-800"
                                />
                                <span className="text-[10px] font-black uppercase text-gray-600 dark:text-gray-400 group-hover/label:text-[#1F2BF3] transition-colors tracking-widest">{service.label}</span>
                            </label>
                        ))}
                    </div>
                    {errors.services && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.services}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 ml-2 tracking-widest">{t('project_message')}</label>
                    <textarea
                        rows="4"
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        className="w-full bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#1F2BF3] transition-all dark:text-white outline-none resize-none"
                        placeholder={t('placeholder_message')}
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-widest">{errors.message}</p>}
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{t('need_creator')}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('creator_types')}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={data.needs_creator}
                                onChange={e => setData('needs_creator', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1F2BF3]"></div>
                        </label>
                    </div>

                    {data.needs_creator && creators.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-4 overflow-hidden"
                        >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {creators.map((creator) => (
                                    <div 
                                        key={creator.id}
                                        onClick={() => toggleCreator(creator.id)}
                                        className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                                            data.selected_creators.includes(creator.id) 
                                            ? 'border-[#1F2BF3] scale-[0.98]' 
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        {creator.profile_photo ? (
                                            <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover" alt={creator.display_name} />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                                                <User className="w-8 h-8 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">{creator.display_name}</p>
                                        </div>
                                        {data.selected_creators.includes(creator.id) && (
                                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#1F2BF3] rounded-full flex items-center justify-center text-white">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {data.selected_creators.length > 0 && (
                                <p className="text-[10px] font-black text-[#1F2BF3] uppercase tracking-widest text-center">
                                    {t('creators_selected', { count: data.selected_creators.length })}
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-5 bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                    <Send className="w-5 h-5" />
                    {processing ? t('transmitting') : t('send_message')}
                </button>
            </form>
        </div>
    );
}
