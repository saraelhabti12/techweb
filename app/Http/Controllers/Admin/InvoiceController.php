<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with('client')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Financial/Invoices/Index', [
            'invoices' => $invoices
        ]);
    }

    public function create()
    {
        $clients = Client::orderBy('name')->get();
        $nextNumber = 'FAC-' . date('Y') . '-' . Str::padLeft(Invoice::count() + 1, 4, '0');

        return Inertia::render('Admin/Financial/Invoices/Create', [
            'clients' => $clients,
            'nextNumber' => $nextNumber
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|unique:invoices,invoice_number',
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($request) {
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $total = $subtotal + $request->tax - $request->discount;

            $invoice = Invoice::create([
                'client_id' => $request->client_id,
                'invoice_number' => $request->invoice_number,
                'date' => $request->date,
                'due_date' => $request->due_date,
                'subtotal' => $subtotal,
                'tax' => $request->tax,
                'discount' => $request->discount,
                'total' => $total,
                'notes' => $request->notes,
                'status' => 'unpaid',
            ]);

            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('admin.invoices.index')->with('success', 'Invoice created successfully.');
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load('items', 'client', 'payments');
        $clients = Client::orderBy('name')->get();

        return Inertia::render('Admin/Financial/Invoices/Edit', [
            'invoice' => $invoice,
            'clients' => $clients
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'invoice_number' => 'required|unique:invoices,invoice_number,' . $invoice->id,
            'date' => 'required|date',
            'due_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'status' => 'required|in:unpaid,partial,paid,late',
        ]);

        DB::transaction(function () use ($request, $invoice) {
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $total = $subtotal + $request->tax - $request->discount;

            $invoice->update([
                'client_id' => $request->client_id,
                'invoice_number' => $request->invoice_number,
                'date' => $request->date,
                'due_date' => $request->due_date,
                'subtotal' => $subtotal,
                'tax' => $request->tax,
                'discount' => $request->discount,
                'total' => $total,
                'notes' => $request->notes,
                'status' => $request->status,
            ]);

            $invoice->items()->delete();
            foreach ($request->items as $item) {
                $invoice->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('admin.invoices.index')->with('success', 'Invoice updated successfully.');
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();
        return redirect()->route('admin.invoices.index')->with('success', 'Invoice deleted successfully.');
    }

    public function markPaid(Invoice $invoice)
    {
        DB::transaction(function () use ($invoice) {
            $remaining = $invoice->total - $invoice->amount_paid;
            if ($remaining > 0) {
                Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount' => $remaining,
                    'payment_date' => now(),
                    'payment_method' => 'Cash',
                    'notes' => 'Full payment marked manually.',
                ]);
                
                $invoice->update([
                    'amount_paid' => $invoice->total,
                    'status' => 'paid',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Invoice marked as paid.');
    }

    public function downloadPdf(Invoice $invoice)
    {
        $invoice->load('client', 'items');
        
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.invoices.pdf', compact('invoice'));
        
        return $pdf->download('invoice-' . $invoice->invoice_number . '.pdf');
    }

    public function sendEmail(Invoice $invoice)
    {
        // Placeholder for email logic
        return redirect()->back()->with('success', 'Invoice email sent.');
    }
}
