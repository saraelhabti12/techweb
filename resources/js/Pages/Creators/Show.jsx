import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { MapPinIcon, StarIcon, CheckCircleIcon, LanguageIcon, ArrowLeftIcon, IdentificationIcon, ScaleIcon } from '@heroicons/react/24/outline';

export default function Show({ creator }) {
    return (
        <MainLayout>
            <Head title={`${creator.display_name} - Professional Creator`} />
            
            <div className="pt-32 pb-20 px-6 lg:px-8 bg-white dark:bg-black overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <Link href={route('creators.index')} className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#1F2BF3] transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to All Creators
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Image Gallery Column */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-2xl relative"
                            >
                                <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover" />
                                <div className="absolute top-8 left-8">
                                    <div className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl shadow-2xl ${
                                        creator.availability_status === 'available' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'
                                    }`}>
                                        {creator.availability_status.replace('_', ' ')}
                                    </div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-2 gap-8">
                                {creator.gallery_images?.map((img, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="aspect-square rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 shadow-xl"
                                    >
                                        <img src={`/storage/${img}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-5 space-y-12">
                            <div className="space-y-4">
                                <motion.span 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1F2BF3] block"
                                >
                                    Featured Creator
                                </motion.span>
                                <motion.h1 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter"
                                >
                                    {creator.display_name}
                                </motion.h1>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-2 text-lg text-gray-500 uppercase tracking-widest font-bold"
                                >
                                    <MapPinIcon className="w-5 h-5 text-[#1F2BF3]" />
                                    {creator.city}
                                </motion.div>
                            </div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-2 gap-6 p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800"
                            >
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Height</p>
                                    <p className="text-2xl font-black dark:text-white">{creator.height_cm} <span className="text-xs font-normal">cm</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Age</p>
                                    <p className="text-2xl font-black dark:text-white">{creator.age} <span className="text-xs font-normal">years</span></p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Clothing</p>
                                    <p className="text-2xl font-black dark:text-white">{creator.clothing_size}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Shoes</p>
                                    <p className="text-2xl font-black dark:text-white">{creator.shoe_size}</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2BF3] flex items-center gap-2">
                                        <IdentificationIcon className="w-4 h-4" />
                                        Experience
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {creator.experience_notes}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2BF3] flex items-center gap-2">
                                        <StarIcon className="w-4 h-4" />
                                        Skills & Talent
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {creator.skills}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1F2BF3] flex items-center gap-2">
                                        <LanguageIcon className="w-4 h-4" />
                                        Languages
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {creator.languages?.map((lang, i) => (
                                            <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-[#1F2BF3] rounded-xl text-xs font-black uppercase tracking-widest">
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="pt-8"
                            >
                                <Link href={route('contact.store')} className="block w-full text-center py-6 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl">
                                    Book This Creator
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
