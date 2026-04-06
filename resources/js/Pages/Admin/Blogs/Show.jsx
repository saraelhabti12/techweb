import { router, Link } from "@inertiajs/react";
import { useState } from "react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/Layouts/MainLayout';

export default function Show({ blog, categories = [], tags = [], blogs = [], filters = {} }) {
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/blogs", { search });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-12 font-inter">
            <div className="mb-6">
            <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200 font-semibold"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Retour
            </button>
            </div>
        <div className="max-w-3xl mx-auto bg-white border border-purple-200 rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-700 leading-tight text-center">
            {blog.title}
          </h1>
          <p className="text-purple-500 mb-6 text-lg italic text-center">
            By <span className="font-semibold">{blog.author}</span>
          </p>
          {Array.isArray(blog.images) && blog.images.length > 0 && (
            <div className="space-y-4 mb-6">
              {blog.images.map((img, index) => (
                <img
                  key={index}
                  src={img.replace(/\\/g, '')}
                  alt={blog.title}
                  className="w-full max-h-[400px] object-contain rounded-xl shadow-md mx-auto border border-purple-100"
                />
              ))}
            </div>
          )}
          <div
            className="text-lg text-gray-700 leading-relaxed space-y-6 prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
