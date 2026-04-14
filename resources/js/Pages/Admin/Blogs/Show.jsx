import { router, Link } from "@inertiajs/react";
import { useState } from "react";
import { 
    CalendarIcon, 
    UserCircleIcon, 
    TagIcon, 
    ChevronLeftIcon,
    PencilSquareIcon
} from '@heroicons/react/24/outline';
import AdminLayout from '@/Layouts/AdminLayout';
import DashboardPage from '@/Components/UI/DashboardPage';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';
import { motion } from 'framer-motion';

export default function Show({ blog, auth }) {
  return (
    <AdminLayout auth={auth}>
        <DashboardPage 
            title="Article Preview"
            description="Preview how your article appears to the public before final publication."
            actions={
                <div className="flex gap-3">
                    <DashboardButton variant="secondary" onClick={() => window.history.back()} className="text-sm">
                        Back to List
                    </DashboardButton>
                    <Link href={route('admin.blogs.edit', blog.id)}>
                        <DashboardButton className="flex items-center gap-2">
                            <PencilSquareIcon className="w-4 h-4" />
                            Edit Article
                        </DashboardButton>
                    </Link>
                </div>
            }
        >
            <DashboardCard className="max-w-4xl mx-auto border-transparent shadow-2xl !p-0 overflow-hidden">
                {/* Hero Header */}
                <div className="relative h-[400px] w-full overflow-hidden">
                    {Array.isArray(blog.images) && blog.images.length > 0 ? (
                        <img
                            src={blog.images[0].replace(/\\/g, '')}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1F2BF3] to-[#00D8C0] flex items-center justify-center">
                            <span className="text-white font-black text-6xl opacity-20 uppercase tracking-tighter">TechWeb Blog</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-10">
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-3 py-1 bg-[#1F2BF3] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {blog.category?.name || 'Uncategorized'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                            {blog.title}
                        </h1>
                        <div className="flex items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <UserCircleIcon className="w-5 h-5 text-[#00D8C0]" />
                                <span className="text-sm font-bold uppercase tracking-widest">{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-[#00D8C0]" />
                                <span className="text-sm font-bold uppercase tracking-widest">
                                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-10 md:p-16 bg-white dark:bg-gray-900">
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300">
                        <div
                            className="text-lg leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </div>

                    {/* Secondary Images Gallery */}
                    {Array.isArray(blog.images) && blog.images.length > 1 && (
                        <div className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8">Additional Imagery</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {blog.images.slice(1).map((img, index) => (
                                    <motion.img
                                        whileHover={{ scale: 1.02 }}
                                        key={index}
                                        src={img.replace(/\\/g, '')}
                                        alt={`${blog.title} - ${index}`}
                                        className="w-full h-64 object-cover rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags Footer */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <TagIcon className="w-5 h-5 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DashboardCard>
        </DashboardPage>
    </AdminLayout>
  );
}
