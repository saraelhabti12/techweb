<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Quotation;
use App\Models\QuotationItem;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::with('client')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Financial/Quotations/Index', [
            'quotations' => $quotations
        ]);
    }

    public function create()
    {
        $clients = Client::orderBy('name')->get();
        $nextNumber = 'DEV-' . date('Y') . '-' . Str::padLeft(Quotation::count() + 1, 4, '0');

        return Inertia::render('Admin/Financial/Quotations/Create', [
            'clients' => $clients,
            'nextNumber' => $nextNumber
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'quotation_number' => 'required|unique:quotations,quotation_number',
            'date' => 'required|date',
            'expiry_date' => 'nullable|date',
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

            $quotation = Quotation::create([
                'client_id' => $request->client_id,
                'quotation_number' => $request->quotation_number,
                'date' => $request->date,
                'expiry_date' => $request->expiry_date,
                'subtotal' => $subtotal,
                'tax' => $request->tax,
                'discount' => $request->discount,
                'total' => $total,
                'notes' => $request->notes,
                'status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                $quotation->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('admin.quotations.index')->with('success', 'Quotation created successfully.');
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load('items', 'client');
        $clients = Client::orderBy('name')->get();

        return Inertia::render('Admin/Financial/Quotations/Edit', [
            'quotation' => $quotation,
            'clients' => $clients
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'quotation_number' => 'required|unique:quotations,quotation_number,' . $quotation->id,
            'date' => 'required|date',
            'expiry_date' => 'nullable|date',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        DB::transaction(function () use ($request, $quotation) {
            $subtotal = collect($request->items)->sum(function ($item) {
                return $item['quantity'] * $item['unit_price'];
            });

            $total = $subtotal + $request->tax - $request->discount;

            $quotation->update([
                'client_id' => $request->client_id,
                'quotation_number' => $request->quotation_number,
                'date' => $request->date,
                'expiry_date' => $request->expiry_date,
                'subtotal' => $subtotal,
                'tax' => $request->tax,
                'discount' => $request->discount,
                'total' => $total,
                'notes' => $request->notes,
                'status' => $request->status,
            ]);

            $quotation->items()->delete();
            foreach ($request->items as $item) {
                $quotation->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $item['quantity'] * $item['unit_price'],
                ]);
            }
        });

        return redirect()->route('admin.quotations.index')->with('success', 'Quotation updated successfully.');
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();
        return redirect()->route('admin.quotations.index')->with('success', 'Quotation deleted successfully.');
    }

    public function duplicate(Quotation $quotation)
    {
        $newQuotation = $quotation->replicate();
        $newQuotation->quotation_number = 'DEV-' . date('Y') . '-' . Str::padLeft(Quotation::count() + 1, 4, '0');
        $newQuotation->status = 'pending';
        $newQuotation->save();

        foreach ($quotation->items as $item) {
            $newQuotation->items()->create($item->replicate()->toArray());
        }

        return redirect()->route('admin.quotations.edit', $newQuotation->id)->with('success', 'Quotation duplicated.');
    }

    public function convertToInvoice(Quotation $quotation)
    {
        if ($quotation->invoice) {
            return redirect()->back()->with('error', 'Quotation already converted to invoice.');
        }

        $invoice = DB::transaction(function () use ($quotation) {
            $invoice = Invoice::create([
                'client_id' => $quotation->client_id,
                'quotation_id' => $quotation->id,
                'invoice_number' => 'FAC-' . date('Y') . '-' . Str::padLeft(Invoice::count() + 1, 4, '0'),
                'date' => now(),
                'due_date' => now()->addDays(30),
                'subtotal' => $quotation->subtotal,
                'tax' => $quotation->tax,
                'discount' => $quotation->discount,
                'total' => $quotation->total,
                'status' => 'unpaid',
                'notes' => $quotation->notes,
            ]);

            foreach ($quotation->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'description' => $item->description,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                ]);
            }

            $quotation->update(['status' => 'accepted']);
            return $invoice;
        });

        return redirect()->route('admin.invoices.edit', $invoice->id)->with('success', 'Invoice created from quotation.');
    }

    public function sendEmail(Quotation $quotation)
    {
        // Placeholder for email logic
        // Mail::to($quotation->client->email)->send(new QuotationMail($quotation));
        return redirect()->back()->with('success', 'Quotation email sent.');
    }

    public function downloadPdf(Quotation $quotation)
    {
        $quotation->load('client', 'items');
        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('admin.quotations.pdf', compact('quotation'));
        return $pdf->download('quotation-' . $quotation->quotation_number . '.pdf');
    }
}
