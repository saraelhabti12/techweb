import React, { useState } from 'react';
import { useForm, router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories }) {
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
    <AdminLayout header="Ajouter un Template">
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour
          </button>
        </div>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-500 bg-opacity-30 dark:bg-gray-800 shadow-lg rounded-2xl p-10 max-w-2xl mx-auto space-y-8"
      >
        <h2 className="text-2xl text-center font-bold text-gray-900 dark:text-white mb-4">
          New Template
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">
            Titre 
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData('title', e.target.value)}
            placeholder="Ex: Template Portfolio"
            className="w-full rounded-md border bg-white/60
                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                        shadow-sm 
                        focus:border-purple-500 focus:ring-purple-500"
          />
          {errors.title && (
            <div className="text-red-500 text-sm mt-1">{errors.title}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            value={data.category}
            onChange={(e) => setData('category', e.target.value)}
            className="w-full rounded-md border bg-white/60
                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                        shadow-sm 
                        focus:border-purple-500 focus:ring-purple-500"
          >
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option value="">Aucune catégorie </option>
            )}
          </select>
          {errors.category && (
            <div className="text-red-500 text-sm mt-1">{errors.category}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            placeholder="Description courte du template..."
            rows={5}
            className="w-full rounded-md border bg-white/60
                        dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 
                        shadow-sm 
                        focus:border-purple-500 focus:ring-purple-500"
          ></textarea>
          {errors.description && (
            <div className="text-red-500 text-sm mt-1">{errors.description}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-full text-gray-700 dark:text-gray-200"
          />
          {preview && (
            <img
              src={preview}
              alt="Aperçu"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-gray-300"
            />
          )}
          {errors.image && (
            <div className="text-red-500 text-sm mt-1">{errors.image}</div>
          )}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={processing}
            className="inline-flex items-center px-4 py-2 
                    bg-purple-600 border border-transparent rounded-md 
                    font-semibold text-xs text-white uppercase tracking-widest 
                    hover:bg-purple-700 active:bg-purple-900 
                    focus:outline-none focus:border-purple-900 focus:ring focus:ring-purple-300 
                    disabled:opacity-25 transition 
                    dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            {processing ? 'Envoi...' : 'Ajouter Template'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

