import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { router ,Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ categories , allTags}) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: files });

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const toggleTag = (tag) => {
    if (form.tags.includes(tag)) {
      setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    } else {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', form.title);
    data.append('author', form.author);
    data.append('excerpt', form.excerpt);
    data.append('content', form.content);
    data.append('category', form.category);
    form.tags.forEach(tag => data.append('tags[]', tag));
    form.images.forEach((img) => data.append('images[]', img));

    Inertia.post(route('admin.blogs.store'), data, {
      forceFormData: true, 
      onSuccess: () => {
        setForm({
          title: '',
          author: '',
          excerpt: '',
          content: '',
          category: '',
          tags: [],
          images: [],
        });
        setPreviewImages([]);
      },
      onError: (errors) => console.log(errors),
    });
  };

  return (
    <AdminLayout title="Create Blog">
      <div className="container mx-auto py-12 bg-gray-500 bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 rounded-lg p-6">
      <div className="container mx-auto py-12">
            <div className="mb-6">
            <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
            </button>
            </div>
        <h1 className="text-4xl font-bold mb-6 text-[#8000FF] text-center">Create The Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input type="text" name="title" placeholder="Titre du blog" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0" />

          <input type="text" name="author" placeholder="Auteur" value={form.author} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0" />

          <textarea name="excerpt" placeholder="Extrait" value={form.excerpt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0" />

          <div>
            <input type="file" multiple onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0" />
            <div className="flex gap-4 mt-4">
              {previewImages.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-lg shadow" />
              ))}
            </div>
          </div>

          <textarea name="content" placeholder="Contenu HTML" value={form.content} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg h-60 focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0" />

          <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF] focus:ring-offset-0">
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <div className="space-y-2">
            <label className="block font-medium text-gray-700 dark:text-white mb-1">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-white ${
                    form.tags.includes(tag) ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-700'
                  } hover:bg-purple-700 transition`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">Create</button>

        </form>
      </div>
      </div>
    </AdminLayout>
  );
}
