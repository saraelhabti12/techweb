import React, { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, Link, router } from "@inertiajs/react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function Edit({ template }) {
  const { data, setData, put, processing, errors } = useForm({
    title: template.title,
    category: template.category,
    description: template.description,
    image: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    put(route("admin.templates.update", template.id));
  };

  return (
    <AdminLayout header="Modifier Template">
      
        <div className="bg-gray-500 bg-opacity-30 dark:bg-gray-800 shadow-lg rounded-2xl p-8 max-w-2xl mx-auto space-y-6">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Update Template
          </h2>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-gray-900 dark:text-gray-200 mb-2">
                Title :
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData("title", e.target.value)}
                className="w-full rounded-md border-gray-300 bg-white
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                  shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3"
              />
              {errors.title && <p className="text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-gray-900 dark:text-gray-200 mb-2">
                Catégory :
              </label>
              <input
                type="text"
                value={data.category}
                onChange={(e) => setData("category", e.target.value)}
                className="w-full rounded-md border-gray-300 bg-white
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                  shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3"
              />
              {errors.category && <p className="text-red-500 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-gray-900 dark:text-gray-200 mb-2">
                Description :
              </label>
              <textarea
                value={data.description}
                onChange={(e) => setData("description", e.target.value)}
                rows={6}
                className="w-full rounded-md border-gray-300 bg-white
                  dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                  shadow-sm focus:border-purple-500 focus:ring-purple-500 p-3"
              />
              {errors.description && (
                <p className="text-red-500 mt-1">{errors.description}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-900 dark:text-gray-200 mb-2">
                Template :
              </label>
              <input
                type="file"
                onChange={(e) => setData("image", e.target.files[0])}
                className="w-full mt-1 text-gray-800 dark:text-gray-200"
              />
              {errors.image && <p className="text-red-500 mt-1">{errors.image}</p>}
            </div>

            <div className="flex gap-6 justify-center mt-10">
              <button
                type="submit"
                disabled={processing}
                className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-purple-700 transition"
              >
                Update
              </button>
              <Link
                href={route("admin.templates")}
                className="bg-gray-200 dark:bg-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
    </AdminLayout>
  );
}

