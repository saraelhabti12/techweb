<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Client;
use App\Models\Creator;
use App\Models\Commercial;
use App\Models\Template;
use App\Models\Project;
use App\Models\Task;
use App\Models\Activity;
use App\Models\User;
use App\Models\Blog;
use App\Models\ExpenseCategory;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Salary;
use App\Models\LeaveRequest;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@techweb.ma')->first();
        if (!$admin) {
            $admin = User::factory()->create([
                'name' => 'Admin User',
                'email' => 'admin@techweb.ma',
                'password' => bcrypt('password123'),
                'role' => 'admin',
            ]);
        }

        $member = User::where('email', 'member@techweb.ma')->first();
        if (!$member) {
            $member = User::factory()->create([
                'name' => 'Test Member',
                'email' => 'member@techweb.ma',
                'password' => bcrypt('password123'),
                'role' => 'member',
            ]);
        }

        $pm = User::firstOrCreate(
            ['email' => 'manager@techweb.ma'],
            [
                'name' => 'Sara Lahlou',
                'password' => bcrypt('password123'),
                'role' => 'project_manager',
            ]
        );

        User::firstOrCreate(
            ['email' => 'hicham@techweb.ma'],
            [
                'name' => 'Hicham Bennani',
                'password' => bcrypt('password123'),
                'role' => 'member',
            ]
        );

        User::firstOrCreate(
            ['email' => 'najat@techweb.ma'],
            [
                'name' => 'Najat El Fassi',
                'password' => bcrypt('password123'),
                'role' => 'member',
            ]
        );

        $team = User::whereIn('role', ['admin', 'project_manager', 'member'])->get();

        $categories = [];
        $catNames = ['Web Development', 'Mobile App', 'UI/UX Design', 'SEO & Marketing', 'Branding'];
        foreach ($catNames as $name) {
            $categories[$name] = Category::firstOrCreate(['name' => $name]);
        }

        $client1 = Client::firstOrCreate(
            ['email' => 'contact@atlanticma.com'],
            [
                'user_id' => $admin->id,
                'name' => 'Atlantic Solutions',
                'phone' => '0522123456',
                'whatsapp' => '0622123456',
                'company_name' => 'Atlantic Solutions Maroc',
                'city' => 'Casablanca',
                'address' => '12 Bd Zerktouni, Casablanca',
                'website' => 'https://atlanticma.com',
                'status' => 'client',
                'contact_method' => 'call',
                'contact_date' => now()->addDays(7),
                'notes' => 'Client fidèle depuis 2023. Projets web en cours.',
            ]
        );

        $client2 = Client::firstOrCreate(
            ['email' => 'info@creastore.ma'],
            [
                'user_id' => $admin->id,
                'name' => 'CréaStore',
                'phone' => '0533123456',
                'whatsapp' => '0633123456',
                'company_name' => 'CréaStore SARL',
                'city' => 'Rabat',
                'address' => '34 Av. Mohammed V, Rabat',
                'website' => 'https://creastore.ma',
                'social_links' => json_encode([
                    ['platform' => 'instagram', 'url' => 'https://instagram.com/creastore'],
                    ['platform' => 'facebook', 'url' => 'https://facebook.com/creastore'],
                ]),
                'status' => 'prospect',
                'contact_method' => 'whatsapp',
                'contact_date' => now()->addDays(3),
                'notes' => 'Prospect intéressé par une refonte de site e-commerce.',
            ]
        );

        $client3 = Client::firstOrCreate(
            ['email' => 'hello@luminary.ma'],
            [
                'user_id' => $admin->id,
                'name' => 'Luminary Agency',
                'phone' => '0528123456',
                'whatsapp' => '0628123456',
                'company_name' => 'Luminary Agency',
                'city' => 'Marrakech',
                'address' => '5 Rue de la Liberté, Marrakech',
                'website' => 'https://luminary.ma',
                'status' => 'interested',
                'contact_method' => 'meeting',
                'contact_date' => now()->addDays(14),
                'notes' => 'Agence de création cherchant une solution complète.',
            ]
        );

        Creator::firstOrCreate(
            ['email' => 'yasmine@example.com'],
            [
                'full_name' => 'Yasmine Benali',
                'display_name' => 'Yasmine B.',
                'age' => 24,
                'gender' => 'female',
                'city' => 'Casablanca',
                'phone' => '0612345678',
                'height_cm' => 170,
                'weight_kg' => 58,
                'clothing_size' => 'S',
                'shoe_size' => '38',
                'languages' => json_encode(['Arabic', 'French', 'English']),
                'skills' => 'Mannequinat, Photoshoot, Défilés',
                'experience_notes' => '3 ans d\'expérience en mannequinat.',
                'availability_status' => 'available',
                'daily_rate' => 2500.00,
                'visible_on_homepage' => true,
                'active' => true,
            ]
        );

        Creator::firstOrCreate(
            ['email' => 'mehdi@example.com'],
            [
                'full_name' => 'Mehdi El Ouafi',
                'display_name' => 'Mehdi EO',
                'age' => 27,
                'gender' => 'male',
                'city' => 'Rabat',
                'phone' => '0623456789',
                'height_cm' => 185,
                'weight_kg' => 75,
                'clothing_size' => 'L',
                'shoe_size' => '43',
                'languages' => json_encode(['Arabic', 'French', 'English', 'Spanish']),
                'skills' => 'Photographie, Vidéo, Montage',
                'experience_notes' => '5 ans en tant que photographe professionnel.',
                'availability_status' => 'available',
                'daily_rate' => 3500.00,
                'visible_on_homepage' => true,
                'active' => true,
            ]
        );

        Creator::firstOrCreate(
            ['email' => 'leila@example.com'],
            [
                'full_name' => 'Leila Chafik',
                'display_name' => 'Leila Ch.',
                'age' => 22,
                'gender' => 'female',
                'city' => 'Tanger',
                'phone' => '0634567890',
                'height_cm' => 168,
                'weight_kg' => 55,
                'clothing_size' => 'XS',
                'shoe_size' => '37',
                'languages' => json_encode(['Arabic', 'French']),
                'skills' => 'Mannequinat, Influenceuse, Création de contenu',
                'experience_notes' => 'Nouveau talent, forte présence sur Instagram.',
                'availability_status' => 'available',
                'daily_rate' => 2000.00,
                'visible_on_homepage' => true,
                'active' => true,
            ]
        );

        $com1 = Commercial::firstOrCreate(
            ['email' => 'sami@techweb.ma'],
            [
                'name' => 'Sami Tazi',
                'phone' => '0611111111',
                'status' => 'active',
                'commission_type' => 'percentage',
                'commission_value' => 10.00,
                'notes' => 'Commercial senior, spécialisé dans les grands comptes.',
            ]
        );
        Commercial::firstOrCreate(
            ['email' => 'imane@techweb.ma'],
            [
                'name' => 'Ine Boutaleb',
                'phone' => '0622222222',
                'status' => 'active',
                'commission_type' => 'fixed',
                'commission_value' => 1500.00,
                'notes' => 'Nouvelle commerciale, spécialisée dans les PME.',
            ]
        );

        $tplData = [
            ['title' => 'Landing Page Pro', 'category' => 'Web Development', 'description' => 'Template landing page moderne et responsive pour startups.', 'image' => '/images/templates/landing-pro.jpg'],
            ['title' => 'E-Commerce Boost', 'category' => 'Web Development', 'description' => 'Solution e-commerce complète avec panier et paiement intégré.', 'image' => '/images/templates/ecommerce.jpg'],
            ['title' => 'Portfolio Créatif', 'category' => 'UI/UX Design', 'description' => 'Template portfolio pour créatifs, photographes et artistes.', 'image' => '/images/templates/portfolio.jpg'],
            ['title' => 'Dashboard Admin', 'category' => 'UI/UX Design', 'description' => 'Template dashboard avec graphiques, tables et analytics.', 'image' => '/images/templates/dashboard.jpg'],
            ['title' => 'Mobile App Starter', 'category' => 'Mobile App', 'description' => 'Structure de base pour application mobile React Native.', 'image' => '/images/templates/mobile-app.jpg'],
        ];
        foreach ($tplData as $tpl) {
            Template::firstOrCreate(['title' => $tpl['title']], $tpl);
        }

        $now = now();

        $projectsData = [
            [
                'name' => 'Refonte Site Atlantic Solutions',
                'description' => 'Refonte complète du site corporate avec nouvelle identité visuelle, système de gestion de contenu et intégration d\'outils analytics.',
                'category_id' => $categories['Web Development']->id,
                'client_id' => $client1->id,
                'project_type' => 'Client Project',
                'status' => 'active',
                'start_date' => $now->copy()->subMonths(2)->format('Y-m-d'),
                'end_date' => $now->copy()->addMonths(1)->format('Y-m-d'),
                'project_manager_id' => $pm->id,
                'commercial_type' => 'internal',
                'client_name' => $client1->name,
                'client_phone' => $client1->phone,
                'client_email' => $client1->email,
            ],
            [
                'name' => 'Application Mobile LivreurPro',
                'description' => 'Développement d\'une application mobile de livraison avec suivi en temps réel, notifications push et tableau de bord.',
                'category_id' => $categories['Mobile App']->id,
                'project_type' => 'Internal (Techweb)',
                'status' => 'active',
                'start_date' => $now->copy()->subMonth()->format('Y-m-d'),
                'end_date' => $now->copy()->addMonths(3)->format('Y-m-d'),
                'project_manager_id' => $pm->id,
                'commercial_type' => 'internal',
            ],
            [
                'name' => 'Campagne SEO CréaStore',
                'description' => 'Stratégie SEO complète : audit technique, optimisation on-page, netlinking et reporting mensuel.',
                'category_id' => $categories['SEO & Marketing']->id,
                'client_id' => $client2->id,
                'project_type' => 'Client Project',
                'status' => 'active',
                'start_date' => $now->copy()->subWeeks(3)->format('Y-m-d'),
                'end_date' => $now->copy()->addMonths(2)->format('Y-m-d'),
                'project_manager_id' => $admin->id,
                'commercial_type' => 'external',
                'commercial_name' => 'Reda El Amrani',
                'commercial_phone' => '0644444444',
                'commercial_email' => 'reda@example.com',
                'commercial_commission' => 8.50,
                'client_name' => $client2->name,
                'client_phone' => $client2->phone,
                'client_email' => $client2->email,
            ],
            [
                'name' => 'Identité Visuelle Luminary',
                'description' => 'Création complète de l\'identité visuelle : logo, charte graphique, cartes de visite, templates email et kit réseaux sociaux.',
                'category_id' => $categories['Branding']->id,
                'client_id' => $client3->id,
                'project_type' => 'Client Project',
                'status' => 'paused',
                'start_date' => $now->copy()->subMonths(1)->format('Y-m-d'),
                'end_date' => $now->copy()->addMonths(2)->format('Y-m-d'),
                'project_manager_id' => $pm->id,
                'commercial_type' => 'internal',
                'client_name' => $client3->name,
                'client_phone' => $client3->phone,
                'client_email' => $client3->email,
            ],
            [
                'name' => 'Plateforme E-learning Techweb',
                'description' => 'Développement d\'une plateforme interne de formation avec cours vidéo, quiz et certifications.',
                'category_id' => $categories['Web Development']->id,
                'project_type' => 'Internal (Techweb)',
                'status' => 'completed',
                'start_date' => $now->copy()->subMonths(4)->format('Y-m-d'),
                'end_date' => $now->copy()->subDays(15)->format('Y-m-d'),
                'project_manager_id' => $admin->id,
                'commercial_type' => 'internal',
            ],
        ];

        $projectModels = [];
        foreach ($projectsData as $data) {
            $project = Project::firstOrCreate(
                ['name' => $data['name']],
                $data
            );
            $projectModels[] = $project;
        }

        $allUsers = $team->pluck('id')->toArray();

        foreach ($projectModels as $index => $project) {
            $memberCount = min(2 + $index % 3, count($allUsers));
            $memberIds = array_slice($allUsers, 0, $memberCount);
            $project->members()->syncWithoutDetaching($memberIds);

            if ($index % 2 === 0) {
                $project->commercials()->syncWithoutDetaching([$com1->id]);
            }

            if ($index === 0 || $index === 4) {
                $creators = Creator::inRandomOrder()->take(1)->pluck('id')->toArray();
                $project->creators()->syncWithoutDetaching($creators);
            }
        }

        $tasksData = [
            ['project_index' => 0, 'title' => 'Audit du site existant', 'description' => 'Analyser l\'architecture actuelle, les performances et le contenu.', 'status' => 'completed'],
            ['project_index' => 0, 'title' => 'Maquettes UI nouvelles pages', 'description' => 'Créer les maquettes Figma pour les 5 pages principales.', 'status' => 'completed'],
            ['project_index' => 0, 'title' => 'Intégration front-end', 'description' => 'Intégrer les maquettes avec React et Tailwind CSS.', 'status' => 'in_progress'],
            ['project_index' => 0, 'title' => 'Développement back-end CMS', 'description' => 'Mettre en place le système de gestion de contenu.', 'status' => 'todo'],
            ['project_index' => 0, 'title' => 'Tests et déploiement', 'description' => 'Tests fonctionnels, performance et mise en production.', 'status' => 'todo'],
            ['project_index' => 1, 'title' => 'Conception des écrans', 'description' => 'Design des écrans de l\'application mobile.', 'status' => 'completed'],
            ['project_index' => 1, 'title' => 'API de géolocalisation', 'description' => 'Intégrer l\'API de suivi en temps réel.', 'status' => 'in_progress'],
            ['project_index' => 1, 'title' => 'Système de notifications', 'description' => 'Mettre en place les notifications push Firebase.', 'status' => 'todo'],
            ['project_index' => 2, 'title' => 'Audit SEO technique', 'description' => 'Analyser les performances, le maillage et les balises.', 'status' => 'completed'],
            ['project_index' => 2, 'title' => 'Optimisation on-page', 'description' => 'Optimiser les balises meta, titres et contenu.', 'status' => 'in_progress'],
            ['project_index' => 2, 'title' => 'Campagne netlinking', 'description' => 'Mettre en place une stratégie de backlinks.', 'status' => 'todo'],
            ['project_index' => 3, 'title' => 'Brief créatif', 'description' => 'Définir les axes créatifs avec le client.', 'status' => 'completed'],
            ['project_index' => 3, 'title' => 'Propositions logo', 'description' => 'Présenter 3 concepts logo au client.', 'status' => 'paused'],
            ['project_index' => 4, 'title' => 'Développement plateforme', 'description' => 'Coder la plateforme e-learning complète.', 'status' => 'completed'],
            ['project_index' => 4, 'title' => 'Contenu des formations', 'description' => 'Créer le contenu des 5 premiers modules.', 'status' => 'completed'],
        ];

        foreach ($tasksData as $taskItem) {
            $project = $projectModels[$taskItem['project_index']];
            $assignedUser = $allUsers[array_rand($allUsers)];
            Task::firstOrCreate(
                ['title' => $taskItem['title'], 'project_id' => $project->id],
                [
                    'description' => $taskItem['description'],
                    'status' => $taskItem['status'],
                    'due_date' => $now->copy()->addDays(rand(5, 45))->format('Y-m-d'),
                    'project_id' => $project->id,
                    'assigned_to' => $assignedUser,
                ]
            );
        }

        $adminName = $admin->name;
        $actions = [
            ['action' => 'Project Created', 'description' => "Created project: {$projectsData[0]['name']}"],
            ['action' => 'Project Created', 'description' => "Created project: {$projectsData[1]['name']}"],
            ['action' => 'Client Added', 'description' => "Added client: {$client1->name}"],
            ['action' => 'Client Added', 'description' => "Added client: {$client2->name}"],
            ['action' => 'Task Completed', 'description' => "Completed task: Audit du site existant"],
            ['action' => 'Project Status Updated', 'description' => "Updated status of project '{$projectsData[3]['name']}' to 'paused'"],
        ];
        foreach ($actions as $act) {
            Activity::firstOrCreate(
                ['action' => $act['action'], 'description' => $act['description']],
                ['user_id' => $admin->id]
            );
        }

        $this->call(BlogSeeder::class);

        // ─── Finance Data ───────────────────────────────────────────────

        $expCatNames = [
            ['name' => 'Software & Licences', 'color' => '#3B82F6'],
            ['name' => 'Bureau & Fournitures', 'color' => '#10B981'],
            ['name' => 'Marketing & Pub', 'color' => '#F59E0B'],
            ['name' => 'Transport & Déplacement', 'color' => '#8B5CF6'],
            ['name' => 'Hébergement & Domaine', 'color' => '#EC4899'],
            ['name' => 'Services Externalisés', 'color' => '#06B6D4'],
            ['name' => 'Repas & Vie de bureau', 'color' => '#F97316'],
        ];
        $expenseCategoryMap = [];
        foreach ($expCatNames as $ec) {
            $cat = ExpenseCategory::firstOrCreate(['name' => $ec['name']], ['color' => $ec['color']]);
            $expenseCategoryMap[$ec['name']] = $cat->id;
        }

        $expensesData = [
            ['title' => 'Abonnement Figma Team', 'category' => 'Software & Licences', 'amount' => 750.00, 'date' => $now->copy()->subDays(45)->format('Y-m-d'), 'payment_method' => 'card', 'user_id' => $admin->id],
            ['title' => 'Licences Adobe Creative Cloud', 'category' => 'Software & Licences', 'amount' => 2400.00, 'date' => $now->copy()->subDays(30)->format('Y-m-d'), 'payment_method' => 'card', 'user_id' => $admin->id],
            ['title' => 'Impression brochures Atlantic', 'category' => 'Marketing & Pub', 'amount' => 1850.00, 'date' => $now->copy()->subDays(20)->format('Y-m-d'), 'payment_method' => 'bank', 'user_id' => $admin->id],
            ['title' => 'Campagne Google Ads', 'category' => 'Marketing & Pub', 'amount' => 5000.00, 'date' => $now->copy()->subDays(10)->format('Y-m-d'), 'payment_method' => 'bank', 'user_id' => $admin->id],
            ['title' => 'Fournitures bureau', 'category' => 'Bureau & Fournitures', 'amount' => 320.00, 'date' => $now->copy()->subDays(15)->format('Y-m-d'), 'payment_method' => 'cash', 'user_id' => $admin->id],
            ['title' => 'Hébergement Serveur Dedibox', 'category' => 'Hébergement & Domaine', 'amount' => 1200.00, 'date' => $now->copy()->subDays(5)->format('Y-m-d'), 'payment_method' => 'card', 'user_id' => $admin->id],
            ['title' => 'Déplacement client Atlantic', 'category' => 'Transport & Déplacement', 'amount' => 450.00, 'date' => $now->copy()->subDays(12)->format('Y-m-d'), 'payment_method' => 'cash', 'user_id' => $pm->id],
            ['title' => 'Repas équipe sprint', 'category' => 'Repas & Vie de bureau', 'amount' => 890.00, 'date' => $now->copy()->subDays(7)->format('Y-m-d'), 'payment_method' => 'card', 'user_id' => $admin->id],
            ['title' => 'Traduction site anglais', 'category' => 'Services Externalisés', 'amount' => 3500.00, 'date' => $now->copy()->subDays(25)->format('Y-m-d'), 'payment_method' => 'bank', 'user_id' => $pm->id],
        ];
        foreach ($expensesData as $ex) {
            Expense::create([
                'title' => $ex['title'],
                'category_id' => $expenseCategoryMap[$ex['category']],
                'amount' => $ex['amount'],
                'date' => $ex['date'],
                'payment_method' => $ex['payment_method'],
                'notes' => 'Dépense générée pour la démo.',
                'user_id' => $ex['user_id'],
            ]);
        }

        $quotation1 = Quotation::create([
            'client_id' => $client1->id,
            'quotation_number' => 'DEV-2024-001',
            'date' => $now->copy()->subDays(60)->format('Y-m-d'),
            'expiry_date' => $now->copy()->subDays(30)->format('Y-m-d'),
            'subtotal' => 45000.00,
            'tax' => 9000.00,
            'discount' => 2000.00,
            'total' => 52000.00,
            'status' => 'accepted',
            'notes' => 'Devis pour la refonte du site Atlantic Solutions.',
        ]);
        QuotationItem::insert([
            ['quotation_id' => $quotation1->id, 'description' => 'Audit & Stratégie digitale', 'quantity' => 1, 'unit_price' => 8000.00, 'subtotal' => 8000.00],
            ['quotation_id' => $quotation1->id, 'description' => 'Design UX/UI (5 pages)', 'quantity' => 5, 'unit_price' => 3000.00, 'subtotal' => 15000.00],
            ['quotation_id' => $quotation1->id, 'description' => 'Développement Front-end', 'quantity' => 1, 'unit_price' => 12000.00, 'subtotal' => 12000.00],
            ['quotation_id' => $quotation1->id, 'description' => 'Développement Back-end CMS', 'quantity' => 1, 'unit_price' => 10000.00, 'subtotal' => 10000.00],
        ]);

        $quotation2 = Quotation::create([
            'client_id' => $client2->id,
            'quotation_number' => 'SEO-2024-002',
            'date' => $now->copy()->subDays(25)->format('Y-m-d'),
            'expiry_date' => $now->copy()->addDays(5)->format('Y-m-d'),
            'subtotal' => 22000.00,
            'tax' => 4400.00,
            'discount' => 0,
            'total' => 26400.00,
            'status' => 'pending',
            'notes' => 'Devis pour la campagne SEO CréaStore.',
        ]);
        QuotationItem::insert([
            ['quotation_id' => $quotation2->id, 'description' => 'Audit technique SEO', 'quantity' => 1, 'unit_price' => 5000.00, 'subtotal' => 5000.00],
            ['quotation_id' => $quotation2->id, 'description' => 'Optimisation on-page (15 pages)', 'quantity' => 15, 'unit_price' => 800.00, 'subtotal' => 12000.00],
            ['quotation_id' => $quotation2->id, 'description' => 'Campagne netlinking (3 mois)', 'quantity' => 3, 'unit_price' => 2500.00, 'subtotal' => 7500.00],
        ]);

        $invoice1 = Invoice::create([
            'client_id' => $client1->id,
            'quotation_id' => $quotation1->id,
            'invoice_number' => 'FAC-2024-001',
            'date' => $now->copy()->subDays(55)->format('Y-m-d'),
            'due_date' => $now->copy()->subDays(25)->format('Y-m-d'),
            'subtotal' => 45000.00,
            'tax' => 9000.00,
            'discount' => 2000.00,
            'total' => 52000.00,
            'amount_paid' => 26000.00,
            'status' => 'partial',
            'notes' => '1er versement reçu. Solde restant: 26,000.00 MAD.',
        ]);
        InvoiceItem::insert([
            ['invoice_id' => $invoice1->id, 'description' => 'Refonte Site Atlantic - Forfait global', 'quantity' => 1, 'unit_price' => 52000.00, 'subtotal' => 52000.00],
        ]);

        Payment::create([
            'invoice_id' => $invoice1->id,
            'amount' => 26000.00,
            'payment_date' => $now->copy()->subDays(50)->format('Y-m-d'),
            'payment_method' => 'bank_transfer',
            'notes' => 'Acompte 50% - Virement bancaire',
        ]);

        Income::create([
            'client_id' => $client1->id,
            'project_id' => $projectModels[0]->id,
            'invoice_id' => $invoice1->id,
            'total_amount' => 52000.00,
            'paid_amount' => 26000.00,
            'remaining_amount' => 26000.00,
            'status' => 'partial',
            'payment_date' => $now->copy()->subDays(50)->format('Y-m-d'),
            'notes' => 'Revenu projet Atlantic Solutions.',
        ]);

        $salariesData = [
            ['user_id' => $admin->id, 'type' => 'monthly', 'base_salary' => 25000.00, 'advances' => 0, 'deductions' => 1500.00, 'bonuses' => 3000.00, 'final_paid' => 26500.00, 'payment_date' => $now->copy()->subDays(2)->format('Y-m-d')],
            ['user_id' => $pm->id, 'type' => 'monthly', 'base_salary' => 18000.00, 'advances' => 0, 'deductions' => 1000.00, 'bonuses' => 2000.00, 'final_paid' => 19000.00, 'payment_date' => $now->copy()->subDays(2)->format('Y-m-d')],
            ['user_id' => $member->id, 'type' => 'monthly', 'base_salary' => 8500.00, 'advances' => 0, 'deductions' => 500.00, 'bonuses' => 0, 'final_paid' => 8000.00, 'payment_date' => $now->copy()->subDays(2)->format('Y-m-d')],
            ['user_id' => $admin->id, 'type' => 'project', 'base_salary' => 8000.00, 'advances' => 0, 'deductions' => 0, 'bonuses' => 1000.00, 'final_paid' => 9000.00, 'payment_date' => $now->copy()->subDays(35)->format('Y-m-d'), 'notes' => 'Prime projet Atlantic Solutions'],
        ];
        foreach ($salariesData as $s) {
            Salary::create($s);
        }

        LeaveRequest::create([
            'user_id' => $member->id,
            'type' => 'vacation',
            'start_date' => $now->copy()->addDays(10)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(14)->format('Y-m-d'),
            'reason' => 'Congé annuel',
            'status' => 'approved',
            'admin_comment' => 'Approuvé. Bonnes vacances !',
        ]);
        LeaveRequest::create([
            'user_id' => $pm->id,
            'type' => 'sick_leave',
            'start_date' => $now->copy()->subDays(20)->format('Y-m-d'),
            'end_date' => $now->copy()->subDays(18)->format('Y-m-d'),
            'reason' => 'Maladie',
            'status' => 'approved',
            'admin_comment' => 'Approuvé. Reposez-vous bien.',
        ]);
        LeaveRequest::create([
            'user_id' => $member->id,
            'type' => 'remote_work',
            'start_date' => $now->copy()->addDays(20)->format('Y-m-d'),
            'end_date' => $now->copy()->addDays(22)->format('Y-m-d'),
            'reason' => 'Travail à distance pour raison personnelle',
            'status' => 'pending',
        ]);

        $financeActions = [
            ['action' => 'Invoice Created', 'description' => "Created invoice {$invoice1->invoice_number} for {$client1->name}"],
            ['action' => 'Payment Received', 'description' => "Received payment of 26,000.00 MAD for invoice {$invoice1->invoice_number}"],
            ['action' => 'Salary Paid', 'description' => "Paid monthly salaries for " . $now->format('F Y')],
        ];
        foreach ($financeActions as $act) {
            Activity::firstOrCreate(
                ['action' => $act['action'], 'description' => $act['description']],
                ['user_id' => $admin->id]
            );
        }
    }
}
