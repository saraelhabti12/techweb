<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            $payment = Payment::create($request->all());
            
            $invoice = Invoice::find($request->invoice_id);
            $newAmountPaid = $invoice->payments()->sum('amount');
            
            $status = 'partial';
            if ($newAmountPaid >= $invoice->total) {
                $status = 'paid';
            }

            $invoice->update([
                'amount_paid' => $newAmountPaid,
                'status' => $status,
            ]);
        });

        return redirect()->back()->with('success', 'Payment recorded.');
    }

    public function destroy(Payment $payment)
    {
        DB::transaction(function () use ($payment) {
            $invoice = $payment->invoice;
            $payment->delete();
            
            $newAmountPaid = $invoice->payments()->sum('amount');
            
            $status = 'unpaid';
            if ($newAmountPaid > 0) {
                $status = $newAmountPaid >= $invoice->total ? 'paid' : 'partial';
            }

            $invoice->update([
                'amount_paid' => $newAmountPaid,
                'status' => $status,
            ]);
        });

        return redirect()->back()->with('success', 'Payment deleted.');
    }
}
