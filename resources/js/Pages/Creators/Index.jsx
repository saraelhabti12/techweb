import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { UserIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Index({ creators }) {
    return (
        <MainLayout>
            <Head title="Our Creators" />
            
            <div className="pt-32 pb-20 px-6 lg:px-8 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <motion.span 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1F2BF3] mb-4 block"
                        >
                            Talent & Models
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter mb-8"
                        >
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]">Creators</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-500 max-w-2xl leading-relaxed"
                        >
                            Work with the best talent for your product shoots. Our creators are professionals in modeling, content creation, and brand representation.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {creators.map((creator, i) => (
                            <motion.div
                                key={creator.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link href={route('creators.show', creator.id)} className="group block">
                                    <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-gray-900 relative mb-6 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
                                        {creator.profile_photo ? (
                                            <img src={`/storage/${creator.profile_photo}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <UserIcon className="w-20 h-20" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute top-6 left-6">
                                            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${
                                                creator.availability_status === 'available' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'
                                            }`}>
                                                {creator.availability_status.replace('_', ' ')}
                                            </div>
                                        </div>

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                            <p className="text-white text-sm font-bold flex items-center gap-2">
                                                View Profile
                                                <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            </p>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors mb-2">
                                        {creator.display_name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 uppercase tracking-widest font-bold">
                                        <MapPinIcon className="w-4 h-4" />
                                        {creator.city}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
