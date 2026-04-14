import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create({ categories, auth }) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    category: categories.length > 0 ? categories[0] : '', 
    description: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('admin.templates.store'), {
      forceFormData: true, 
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData('image', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Create New Template"
            description="Add a new premium design asset to your studio's library."
            actions={
                <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                    Go Back
                </DashboardButton>
            }
        >
            <DashboardCard className="max-w-3xl mx-auto border-transparent shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Template Title 
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Modern Portfolio UI"
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                />
                                {errors.title && (
                                    <div className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.title}</div>
                                )}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                    Asset Category
                                </label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                                >
                                    {Array.isArray(categories) && categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                        {cat}
                                        </option>
                                    ))
                                    ) : (
                                    <option value="">No categories defined</option>
                                    )}
                                </select>
                                {errors.category && (
                                    <div className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.category}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                                Cover Preview Image
                            </label>
                            <div className="relative group h-[164px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                <div className={`w-full h-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                                    preview 
                                        ? 'border-transparent bg-gray-100 dark:bg-gray-800' 
                                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 group-hover:border-[#1F2BF3]/50'
                                }`}>
                                    <AnimatePresence mode="wait">
                                        {preview ? (
                                            <motion.div 
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                className="relative w-full h-full"
                                            >
                                                <img
                                                    src={preview}
                                                    alt="Aperçu"
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                                <button 
                                                    onClick={(e) => { e.preventDefault(); setPreview(null); setData('image', null); }}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform z-20"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <>
                                                <PhotoIcon className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2 group-hover:text-[#1F2BF3] transition-colors" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Click to upload</span>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            {errors.image && (
                                <div className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.image}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
                            Template Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Briefly describe the features and usage of this template..."
                            rows={5}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all"
                        ></textarea>
                        {errors.description && (
                            <div className="text-red-500 text-xs font-bold mt-1 uppercase">{errors.description}</div>
                        )}
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                        <DashboardButton 
                            type="submit" 
                            disabled={processing} 
                            className="w-full md:w-auto !px-12"
                        >
                            {processing ? 'Saving Template...' : 'Publish Template'}
                        </DashboardButton>
                    </div>
                </form>
            </DashboardCard>
        </DashboardPage>
    </AdminLayout>
  );
}
