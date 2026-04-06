import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { usePage, Link, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Index() {
  const { templates } = usePage().props;
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const handleDelete = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
      router.delete(route("admin.templates.destroy", id));
    }
  };

  return (
    <AdminLayout header="Liste des Templates">
    <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">

              <div className="mb-6">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Retour
                </button>
              </div>
      <div className="flex justify-end mb-6">
        <Link
          href={route("admin.templates.create")}
          className="inline-flex items-center px-4 py-2 
                      bg-purple-600 border border-transparent rounded-md 
                      font-semibold text-xs text-white uppercase tracking-widest 
                      hover:bg-purple-700 active:bg-purple-900 
                      focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                      disabled:opacity-25 transition 
                      dark:bg-purple-700 dark:hover:bg-purple-600"
        >
          + Add Template
        </Link>
      </div>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              selectedCategory === cat
                ? "bg-[#8000FF] text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <AnimatePresence>
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden w-[350px] h-[500px] mx-auto group"
            >
              <div className="absolute inset-0 flex flex-col">
                <div className="relative flex-1 overflow-hidden group">
                  <motion.img
                    src={template.image}
                    alt={template.title}
                    className="w-full h-2/3 object-cover"
                    whileHover={{ y: -20 }}
                    transition={{ duration: 0.5 }}
                  />

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {template.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{template.category}</p>

                    <div className="text-gray-600 dark:text-gray-300 flex-1 overflow-y-auto">
                      {template.description}
                    </div>

                    <div className="mt-3 flex justify-center gap-3">
                      <Link
                        href={route("admin.templates.edit", template.id)}
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </div>
    </AdminLayout>
  );
}





