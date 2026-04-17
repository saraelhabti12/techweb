import { router, Link } from "@inertiajs/react";
import { useState } from "react";
import MainLayout from '@/Layouts/MainLayout';
import DashboardCard from '@/Components/UI/DashboardCard';
import DashboardButton from '@/Components/UI/DashboardButton';

export default function Show({ blog, categories, tags, blogs = [], filters = {} }) {

  const [search, setSearch] = useState(filters?.search || "");

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/blogs", { search });
  };

  const labelClass = "block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5";
  const inputClass = "w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-[#1F2BF3] px-4 py-3 shadow-sm transition-all";

  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <DashboardCard noHover={true} className="mb-8">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tight">
                  {blog.title}
                </h1>

                <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <span>By</span>
                  <span className="text-[#1F2BF3]">{blog.author}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(blog.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              {blog.images?.length > 0 && (
                <div className="space-y-6 mb-8">
                  {blog.images.map((img, index) => (
                    <div key={index} className="rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800">
                      <img
                        src={img.replace(/\\/g, '')}
                        alt={blog.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#1F2BF3] prose-strong:text-gray-900 dark:prose-strong:text-white"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </DashboardCard>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Search */}
            <DashboardCard className="p-6">
              <h2 className={labelClass}>Search</h2>
              <form onSubmit={handleSearch} className="space-y-3">
                <input
                  type="text"
                  placeholder="Keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={inputClass}
                />
                <DashboardButton type="submit" className="w-full">
                  Search
                </DashboardButton>
              </form>
            </DashboardCard>

            {/* Categories */}
            <DashboardCard className="p-6">
              <h2 className={labelClass}>Categories</h2>
              <ul className="space-y-3">
                {categories.map((cat, i) => (
                  <li key={i}>
                    <Link
                      href={`/blogs?category=${encodeURIComponent(cat.name)}`}
                      className="group flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
                    >
                      <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-[#1F2BF3] transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-xs font-black bg-gray-100 dark:bg-gray-800 text-gray-400 px-2 py-1 rounded-lg group-hover:bg-[#1F2BF3]/10 group-hover:text-[#1F2BF3] transition-all">
                        {cat.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </DashboardCard>

            {/* Tags */}
            <DashboardCard className="p-6">
              <h2 className={labelClass}>Popular Tags</h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/blogs?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-[#1F2BF3] text-gray-500 dark:text-gray-400 hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </DashboardCard>

            {/* Recent Posts */}
            <DashboardCard className="p-6">
              <h2 className={labelClass}>Recent Posts</h2>
              <div className="space-y-6 pt-2">
                {blogs.map((recent, i) => (
                  <Link
                    key={i}
                    href={`/blogs/${recent.id}`}
                    className="flex items-center gap-4 group"
                  >
                    {recent.images?.length > 0 && (
                      <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                        <img
                          src={recent.images[0]}
                          alt={recent.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#1F2BF3] transition-colors line-clamp-2 leading-tight">
                        {recent.title}
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                        {new Date(recent.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </DashboardCard>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
}
