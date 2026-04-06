<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Blog;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Blog::create([
            'title' => "AI Tools Every Digital Marketer Should Know In 2025",
            'author' => "Techweb",
            'excerpt' => "Discover the best AI tools for marketing in 2025...",
            'content' => "<p>Here is the full blog article with details...</p>",
            'images' => json_encode([
                "/images/slide4.jpg",
                "/images/ai-tools.jpg",
                "/images/marketing-ai.jpg"
            ]),
            'category' => "Tech Trend",
        ]);

        Blog::create([
            'title' => "How To Choose The Right Platform For Your Business Website",
            'author' => "Techweb",
            'excerpt' => "Choosing the right platform can change your business...",
            'content' => "<p>Here is the second blog article...</p>",
            'images' => json_encode([
                "/images/slide4.jpg"
            ]),
            'category' => "Web Development",
        ]);

        Blog::create([
    'title' => 'Mon premier blog',
    'author' => 'Techweb',
    'category' => 'SEO & Traffic',
    'excerpt' => 'Voici un petit résumé de mon premier blog.',
    'content' => '<p>Voici le premier paragraphe.</p><p>Voici le deuxième paragraphe.</p>',
    'images' => json_encode(['/images/blog1.jpg']),
    'tags' => json_encode(['seo', 'marketing', 'traffic']), // 👈 ajouté
]);

    }
}
