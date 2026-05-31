<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financial/Categories', [
            'categories' => ExpenseCategory::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        ExpenseCategory::create($validated);

        return redirect()->back()->with('success', 'Catégorie créée avec succès.');
    }

    public function update(Request $request, ExpenseCategory $expenseCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'color' => 'nullable|string|max:7',
        ]);

        $expenseCategory->update($validated);

        return redirect()->back()->with('success', 'Catégorie mise à jour avec succès.');
    }

    public function destroy(ExpenseCategory $expenseCategory)
    {
        $expenseCategory->delete();

        return redirect()->back()->with('success', 'Catégorie supprimée avec succès.');
    }
}
