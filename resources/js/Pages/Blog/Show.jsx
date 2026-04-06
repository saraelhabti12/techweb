import { router,Link } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from '@/Layouts/MainLayout';

export default function Show({ blog, categories, tags ,blogs = [] , filters = {}}) {
  
  const [search, setSearch] = useState(filters.search || "");

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/blogs", { search });
  };
  
  
  return (

    <MainLayout>

    <div className="container mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-8 font-inter">

      <div className="md:col-span-3 p-6 mt-12">
        
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white leading-tight">
          {blog.title}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg italic">
          By <span className="font-semibold">{blog.author}</span>
        </p>

        {blog.images?.length > 0 && (
          <div className="space-y-4 mb-6">
            {blog.images.map((img, index) => (
              <img
                key={index}
                src={img.replace(/\\/g, '')} 
                alt={blog.title}
                className="w-full max-h-[400px] object-contain rounded-lg shadow"
              />
            ))}
          </div>
        )}

        <div
          className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      <aside className="p-6 space-y-8">

        <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Search</h2>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search blog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300
                      focus:outline-none focus:ring-0.5 
                      focus:ring-[#1F2BF3] dark:bg-gray-800 
                      dark:border-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white
                  bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]
                  rounded-2xl shadow-md shadow-[#1F2BF3]/40
                  transition-all duration-200
                  hover:brightness-110 hover:scale-95 cursor-pointer text-center"
          >
            Search
          </button>
        </form>
      </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat, i) => (
              <li key={i} className="flex justify-between">
                <Link
                  href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                  className="font-medium 
                            text-gray-900 dark:text-white 
                            hover:underline hover:text-[#1F2BF3] dark:hover:text-[#1F2BF3]
                            transition-colors duration-200"
                >
                  {cat.name}
                </Link>
                <span className="text-gray-500 dark:text-gray-400">
                  ({cat.count})
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
               <Link
                  key={i}
                  href={`/blogs?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-[#1F2BF3] hover:bg-[#121A9E] text-purple-200 rounded-full text-sm font-medium  dark:text-purple-200  transition"
                >
                  #{tag}
                </Link>
            ))}
          </div>
        </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Recent Posts</h2>
            <div className="space-y-4">
              {blogs.map((recent, i) => (
                <Link
                  key={i}
                  href={`/blogs/${recent.id}`}
                  className="flex items-center gap-4 group"
                >
                  {recent.images?.length > 0 && (
                    <img
                      src={recent.images[0]}
                      alt={recent.title}
                      className="w-16 h-16 object-cover rounded-md shadow"
                    />
                  )}
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition">
                      {recent.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(recent.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </aside>
    </div>
    </MainLayout>
  );
}
