<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index()
    {
        // Récupérer tous les templates
        $templates = Template::all();

        // Page d’administration
        return Inertia::render('Admin/Templates/Index', [
            'templates' => $templates,
        ]);
    }

    public function adminIndex()
    {
        return $this->index();
    }

    public function create()
    {
        // Récupérer toutes les catégories uniques, non-nulles et non vides
        $categories = Template::select('category')
                              ->whereNotNull('category')
                              ->whereRaw('TRIM(category) != ""')
                              ->distinct()
                              ->pluck('category')
                              ->toArray();

        return Inertia::render('Admin/Templates/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048', 
        ]);

        $path = $request->file('image')->store('templates', 'public');

        Template::create([
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'image' => '/storage/' . $path,
        ]);

        return redirect()->route('admin.templates.index')->with('success', 'Template ajouté avec succès.');
    }

    public function edit(Template $template)
    {
        return Inertia::render('Admin/Templates/Edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, Template $template)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        $template->title = $request->title;
        $template->category = $request->category;
        $template->description = $request->description;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('templates', 'public');
            $template->image = '/storage/' . $path;
        }

        $template->save();

        return redirect()->route('admin.templates.index')->with('success', 'Template mis à jour avec succès');
    }

    public function destroy(Template $template)
    {
        $template->delete();
        return redirect()->route('admin.templates.index')->with('success', 'Template supprimé avec succès');
    }
}
