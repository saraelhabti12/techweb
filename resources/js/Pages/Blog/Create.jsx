import { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

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

  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
  const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-8 text-gray-900 dark:text-white tracking-tight">Create Blog Post</h1>

          <DashboardCard>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    placeholder="Blog Title" 
                    value={form.title} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>

                <div>
                  <label className={labelClass}>Author</label>
                  <input 
                    type="text" 
                    name="author" 
                    placeholder="Author Name" 
                    value={form.author} 
                    onChange={handleChange} 
                    className={inputClass} 
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Excerpt</label>
                <textarea 
                  name="excerpt" 
                  placeholder="A short summary of the blog post" 
                  value={form.excerpt} 
                  onChange={handleChange} 
                  className={inputClass}
                  rows="3"
                />
              </div>

              <div>
                <label className={labelClass}>Images</label>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleImageChange} 
                  className={inputClass} 
                />
                <div className="flex flex-wrap gap-4 mt-4">
                  {previewImages.map((src, i) => (
                    <img key={i} src={src} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white dark:border-gray-800" />
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Content (HTML)</label>
                <textarea 
                  name="content" 
                  placeholder="Main blog content..." 
                  value={form.content} 
                  onChange={handleChange} 
                  className={`${inputClass} min-h-[300px]`} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Category</label>
                  <select 
                    name="category" 
                    value={form.category} 
                    onChange={handleChange} 
                    className={inputClass}
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className={labelClass}>Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          form.tags.includes(tag) 
                            ? 'bg-[#1F2BF3] text-white shadow-lg shadow-[#1F2BF3]/25' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <DashboardButton type="submit">
                  Publish Post
                </DashboardButton>
              </div>
            </form>
          </DashboardCard>
        </div>
      </div>
    </MainLayout>
  );
}
