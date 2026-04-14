import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Index() {
  const { templates, auth } = usePage().props;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this template?")) {
      router.delete(route('admin.templates.destroy', id));
    }
  };

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Design Templates"
            description="Manage and organize your reusable project templates and assets."
            actions={
                <Link href={route("admin.templates.create")}>
                    <DashboardButton className="flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Add Template
                    </DashboardButton>
                </Link>
            }
        >
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-sm ${
                            selectedCategory === cat
                                ? "bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0] text-white shadow-blue-500/20"
                                : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-[#1F2BF3] border border-gray-100 dark:border-gray-800"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredTemplates.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <Squares2X2Icon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-medium italic">No templates found in this category.</p>
                        </div>
                    ) : (
                        filteredTemplates.map((template) => (
                            <motion.div
                                layout
                                key={template.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DashboardCard className="group !p-0 overflow-hidden h-full flex flex-col border-transparent hover:border-[#1F2BF3]/20">
                                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <motion.img
                                            src={template.image}
                                            alt={template.title}
                                            className="w-full h-full object-cover"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ duration: 0.6 }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                            <div className="flex gap-3">
                                                <Link 
                                                    href={route('admin.templates.edit', template.id)}
                                                    className="flex-1"
                                                >
                                                    <DashboardButton className="w-full !py-2 !text-xs">
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </DashboardButton>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(template.id)}
                                                    className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-[#1F2BF3] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                                                {template.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-2 group-hover:text-[#1F2BF3] transition-colors">
                                            {template.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                                            {template.description}
                                        </p>
                                    </div>
                                </DashboardCard>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </DashboardPage>
    </AdminLayout>
  );
}
