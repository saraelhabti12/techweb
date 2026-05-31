<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SalaryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financial/Salaries', [
            'salaries' => Salary::with('user')->latest()->get(),
            'users' => User::all(['id', 'name', 'base_salary'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:monthly,project',
            'base_salary' => 'required|numeric|min:0',
            'advances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'bonuses' => 'nullable|numeric|min:0',
            'final_paid' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['advances'] = $validated['advances'] ?? 0;
        $validated['deductions'] = $validated['deductions'] ?? 0;
        $validated['bonuses'] = $validated['bonuses'] ?? 0;

        Salary::create($validated);

        return redirect()->back()->with('success', 'Salaire enregistré avec succès.');
    }

    public function update(Request $request, Salary $salary)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:monthly,project',
            'base_salary' => 'required|numeric|min:0',
            'advances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'bonuses' => 'nullable|numeric|min:0',
            'final_paid' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $validated['advances'] = $validated['advances'] ?? 0;
        $validated['deductions'] = $validated['deductions'] ?? 0;
        $validated['bonuses'] = $validated['bonuses'] ?? 0;

        $salary->update($validated);

        return redirect()->back()->with('success', 'Salaire mis à jour avec succès.');
    }

    public function destroy(Salary $salary)
    {
        $salary->delete();

        return redirect()->back()->with('success', 'Salaire supprimé avec succès.');
    }
}
