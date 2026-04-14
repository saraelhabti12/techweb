import { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

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
    // Ajouter les tags individuellement
    form.tags.forEach(tag => data.append('tags[]', tag));

    // Ajouter les images
    form.images.forEach((img) => data.append('images[]', img));

    // Utiliser directement l'URL de la route POST
    router.post(route('admin.blogs.store'), data, {
      forceFormData: true, // ⚠️ Important pour envoyer correctement les fichiers
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
    // <MainLayout>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-[#8000FF] text-center">Create The Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <input type="text" name="title" placeholder="Titre du blog" value={form.title} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF]" />

          <input type="text" name="author" placeholder="Auteur" value={form.author} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF]" />

          <textarea name="excerpt" placeholder="Extrait" value={form.excerpt} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF]" />

          <div>
            <input type="file" multiple onChange={handleImageChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF]" />
            <div className="flex gap-4 mt-4">
              {previewImages.map((src, i) => (
                <img key={i} src={src} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-lg shadow" />
              ))}
            </div>
          </div>

          <textarea name="content" placeholder="Contenu HTML" value={form.content} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg h-60 focus:outline-none focus:ring-2 focus:ring-[#8000FF]" />

          <select name="category" value={form.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8000FF]">
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
    // </MainLayout>
  );
}
