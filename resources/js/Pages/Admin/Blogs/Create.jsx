import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { PhotoIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function Create({ categories, allTags, auth }) {
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

    router.post(route('admin.blogs.store'), data, {
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
    });
  };

  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Compose New Article"
            description="Craft a high-quality blog post or studio update for your audience."
            actions={
                <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                    Discard Draft
                </DashboardButton>
            }
        >
            <DashboardCard className="max-w-4xl mx-auto border-transparent shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Article Headline</label>
                            <input 
                                type="text" name="title" placeholder="Enter post title..." value={form.title} onChange={handleChange} 
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Author Identity</label>
                            <input 
                                type="text" name="author" placeholder="Public name..." value={form.author} onChange={handleChange} 
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Brief Excerpt</label>
                        <textarea 
                            name="excerpt" placeholder="Provide a short summary for social sharing..." value={form.excerpt} onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all" 
                            rows="2"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Feature Imagery</label>
                        <div className="relative group">
                            <input 
                                type="file" multiple onChange={handleImageChange} 
                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" 
                            />
                            <div className="w-full py-10 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center group-hover:border-[#1F2BF3]/50 transition-all">
                                <PhotoIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Add cover images</span>
                            </div>
                        </div>
                        <AnimatePresence>
                            {previewImages.length > 0 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-wrap gap-4 mt-6">
                                    {previewImages.map((src, i) => (
                                        <div key={i} className="relative group/img">
                                            <img src={src} alt={`preview-${i}`} className="w-24 h-24 object-cover rounded-xl shadow-lg border-2 border-white dark:border-gray-800 ring-1 ring-gray-100 dark:ring-gray-700" />
                                            <button 
                                                onClick={(e) => { e.preventDefault(); setPreviewImages(prev => prev.filter((_, idx) => idx !== i)); }}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Article Content (HTML Compatible)</label>
                        <textarea 
                            name="content" placeholder="Write your masterpiece here..." value={form.content} onChange={handleChange} 
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-4 shadow-sm transition-all h-80 font-mono text-sm leading-relaxed" 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 text-center md:text-left">Article Category</label>
                            <select 
                                name="category" value={form.category} onChange={handleChange} 
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all font-bold uppercase tracking-widest text-[10px]"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 text-center md:text-left">Relevant Tags</label>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            form.tags.includes(tag) 
                                                ? 'bg-[#1F2BF3] text-white shadow-lg shadow-blue-500/20' 
                                                : 'bg-white dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700 hover:border-[#1F2BF3] hover:text-[#1F2BF3]'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <DashboardButton 
                            type="submit" 
                            className="w-full md:w-auto !px-20 !py-4"
                        >
                            Publish Article Now
                        </DashboardButton>
                    </div>
                </form>
            </DashboardCard>
        </DashboardPage>
    </AdminLayout>
  );
}
