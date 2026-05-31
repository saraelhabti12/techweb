<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Income;
use App\Models\Client;
use App\Models\Project;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class IncomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Financial/Incomes', [
            'incomes' => Income::with('client', 'project', 'invoice')->latest()->get(),
            'clients' => Client::all(['id', 'name']),
            'projects' => Project::all(['id', 'name']),
            'invoices' => Invoice::all(['id', 'invoice_number', 'total', 'amount_paid']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_id' => 'nullable|exists:invoices,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'remaining_amount' => 'required|numeric|min:0',
            'status' => 'required|in:paid,partial,unpaid',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('proof')) {
            $validated['proof_path'] = $request->file('proof')->store('proofs', 'public');
        }
        unset($validated['proof']);

        Income::create($validated);

        // Optional: Update linked invoice if exists
        if ($request->invoice_id) {
            $invoice = Invoice::find($request->invoice_id);
            if ($invoice) {
                $invoice->increment('amount_paid', $request->paid_amount);
                if ($invoice->amount_paid >= $invoice->total) {
                    $invoice->update(['status' => 'paid']);
                } elseif ($invoice->amount_paid > 0) {
                    $invoice->update(['status' => 'partial']);
                }
            }
        }

        return redirect()->back()->with('success', 'Revenu enregistré avec succès.');
    }

    public function update(Request $request, Income $income)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_id' => 'nullable|exists:invoices,id',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'remaining_amount' => 'required|numeric|min:0',
            'status' => 'required|in:paid,partial,unpaid',
            'payment_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'proof' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($request->hasFile('proof')) {
            if ($income->proof_path) {
                Storage::disk('public')->delete($income->proof_path);
            }
            $validated['proof_path'] = $request->file('proof')->store('proofs', 'public');
        }
        unset($validated['proof']);

        $income->update($validated);

        return redirect()->back()->with('success', 'Revenu mis à jour avec succès.');
    }

    public function destroy(Income $income)
    {
        if ($income->proof_path) {
            Storage::disk('public')->delete($income->proof_path);
        }
        $income->delete();

        return redirect()->back()->with('success', 'Revenu supprimé avec succès.');
    }
}
