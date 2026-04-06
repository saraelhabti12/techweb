import { Link } from "@inertiajs/react";
import MainLayout from '@/Layouts/MainLayout';

export default function Index({ blogs = [], categories = [], tags = [], selectedCategory = null }) {
  const filteredBlogs = selectedCategory
    ? blogs.filter((blog) => blog.category === selectedCategory)
    : blogs;

  return (
    <MainLayout>
      <section className="py-28 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {filteredBlogs?.length > 0 ? (
            filteredBlogs.map((blog) => {
              const firstImage =
                blog.images && blog.images.length > 0
                  ? blog.images[0]
                  : blog.content.match(/<img\s+[^>]*src=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;

              return (
                <div
                  key={blog.id}
                  className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition min-h-[500px] flex flex-col"
                >
                  {firstImage && (
                    <img
                      src={firstImage}
                      alt={blog.title}
                      className="w-full h-60 object-cover rounded-lg mb-6 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {blog.title}
                  </h3>

                  <div className="flex items-center mb-6 gap-2 justify-center">
                    {/* Ligne avec gradient et plus longue */}
                    <div className="w-16 h-1 rounded-full bg-gradient-to-r from-[#1F2BF3] to-[#00D8C0]"></div>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      By {blog.author}
                    </p>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-6 flex-1">
                    {blog.excerpt}
                  </p>

                  <Link
                href={`/blogs/${blog.id}`}
                className="px-4 py-2 text-sm font-medium
                          text-gray-800 dark:text-white
                          bg-white/20 dark:bg-black/10
                          rounded-2xl shadow-md shadow-[#1F2BF3]/20
                          transition-all duration-200
                          hover:bg-gradient-to-r hover:from-[#1F2BF3] hover:to-[#00D8C0]
                          hover:brightness-110 hover:scale-95
                          cursor-pointer text-center"
              >
                Learn More
              </Link>
              
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    {blog.category ?? "Uncategorized"}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Aucun blog trouvé pour la catégorie "{selectedCategory}".
            </p>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
