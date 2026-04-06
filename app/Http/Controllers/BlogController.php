<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Blog;
use Inertia\Inertia;

class BlogController extends Controller
{
    // Liste des blogs avec filtres
    public function index(Request $request)
    {
        $query = Blog::query();

        // Filtrer par catégorie
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filtrer par tag
        if ($request->has('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        // Filtrer par recherche
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }

        $blogs = $query->latest()->get(); // images et tags déjà castés en array

        // Si tu veux envoyer categories et tags pour la sidebar
        $allCategories = ['Design', 'Digital Marketing', 'SEO & Traffic', 'Web Development', 'Tech Trend'];
        $categoriesCount = Blog::select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count','category');

        $categories = collect($allCategories)->map(function($cat) use ($categoriesCount) {
            return [
                'name' => $cat,
                'count' => $categoriesCount[$cat] ?? 0,
            ];
        });

        $allTags = [
            'advertising guide','agency b2b vs b2c','branding','business website',
            'commercial','digital','digital entrepreneurs','guide','loyalty',
            'market','marketing','media','power','pr tools','rewards','tactics','website'
        ];

        return Inertia::render('Blog/Index', [
            'blogs' => $blogs,
            'categories' => $categories,
            'tags' => $allTags,
            'selectedCategory' => $request->category ?? null,
        ]);
    }

    // Afficher un blog en détail
    public function show($id)
    {
        $blog = Blog::findOrFail($id);

        $allCategories = ['Design', 'Digital Marketing', 'SEO & Traffic', 'Web Development', 'Tech Trend'];
        $categoriesCount = Blog::select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->pluck('count','category');

        $categories = collect($allCategories)->map(function($cat) use ($categoriesCount) {
            return [
                'name' => $cat,
                'count' => $categoriesCount[$cat] ?? 0,
            ];
        });

        $tags = [
            'advertising guide','agency b2b vs b2c','branding','business website',
            'commercial','digital','digital entrepreneurs','guide','loyalty',
            'market','marketing','media','power','pr tools','rewards','tactics','website'
        ];

        // Blogs récents autres que celui affiché
        $recentBlogs = Blog::where('id', '!=', $id)
            ->latest()
            ->take(2)
            ->get();

        return Inertia::render('Blog/Show', [
            'blog' => $blog,
            'categories' => $categories,
            'tags' => $tags,
            'blogs' => $recentBlogs,
        ]);
    }

    // Formulaire pour créer un blog
    public function create()
    {
        $categories = ['Design', 'Digital Marketing', 'SEO & Traffic', 'Web Development', 'Tech Trend'];
        $allTags = [
            'advertising guide','agency b2b vs b2c','branding','business website',
            'commercial','digital','digital entrepreneurs','guide','loyalty',
            'market','marketing','media','power','pr tools','rewards','tactics','website'
        ];

        return Inertia::render('Admin/Blogs/Create', compact('categories', 'allTags'));
    }

    // Stocker un nouveau blog
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'category' => 'required|string',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        // Sauvegarde des images
        $paths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $filename = time() . '_' . $image->getClientOriginalName();
                $image->move(public_path('images'), $filename);
                $paths[] = '/images/' . $filename;
            }
        }

        Blog::create([
            'title' => $data['title'],
            'author' => $data['author'] ?? 'Techweb',
            'excerpt' => $data['excerpt'] ?? null,
            'content' => $data['content'],
            'category' => $data['category'],
            'tags' => $data['tags'] ?? [],
            'images' => $paths,
        ]);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog créé avec succès !');

    }

    // Pour l'admin: liste des blogs

        public function indexAdmin()
    {
        $blogs = Blog::latest()->get();
        return Inertia::render('Admin/Blogs/Index', ['blogs' => $blogs]);
    }

    public function showAdmin($id)
    {
        $blog = Blog::findOrFail($id);
        return Inertia::render('Admin/Blogs/Show', ['blog' => $blog]);
    }

}
