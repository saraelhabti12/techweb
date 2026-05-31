<?php

namespace App\Http\Controllers\Member;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class SalaryController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $salaries = Salary::where('user_id', $user->id)
            ->latest('payment_date')
            ->get();

        // Calculate next payment date (e.g., 5th of next month)
        $nextPaymentDate = Carbon::now()->addMonth()->startOfMonth()->addDays(4);

        return Inertia::render('Member/Salary/Index', [
            'salaries' => $salaries,
            'user' => $user,
            'nextPaymentDate' => $nextPaymentDate->format('Y-m-d'),
        ]);
    }

    public function downloadPayslip(Salary $salary)
    {
        if ($salary->user_id !== auth()->id()) {
            abort(403);
        }

        $salary->load('user');
        
        $pdf = Pdf::loadView('pdf.payslip', [
            'salary' => $salary,
            'user' => $salary->user,
        ]);

        return $pdf->download("payslip-{$salary->payment_date->format('M-Y')}.pdf");
    }
}
