<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Income;
use App\Models\Salary;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class FinanceController extends Controller
{
    public function dashboard()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        // Stats
        $monthlyIncome = Income::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('paid_amount');
        $monthlyExpenses = Expense::whereBetween('date', [$startOfMonth, $endOfMonth])->sum('amount');
        $monthlySalaries = Salary::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('final_paid');
        $unpaidInvoices = Invoice::where('status', '!=', 'paid')->sum('total') - Invoice::where('status', '!=', 'paid')->sum('amount_paid');
        $pendingSalaries = Salary::where('payment_date', '>', $now)->sum('final_paid'); // Example logic for pending
        
        // Charts Data: Income vs Expenses (Last 6 months)
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = $now->copy()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $income = Income::whereBetween('payment_date', [$monthStart, $monthEnd])->sum('paid_amount');
            $expense = Expense::whereBetween('date', [$monthStart, $monthEnd])->sum('amount');
            $salary = Salary::whereBetween('payment_date', [$monthStart, $monthEnd])->sum('final_paid');

            $chartData[] = [
                'month' => $month->format('M'),
                'income' => $income,
                'expenses' => $expense + $salary,
                'profit' => $income - ($expense + $salary)
            ];
        }

        return Inertia::render('Admin/Financial/Dashboard', [
            'stats' => [
                'monthlyIncome' => $monthlyIncome,
                'monthlyExpenses' => $monthlyExpenses,
                'monthlySalaries' => $monthlySalaries,
                'unpaidInvoices' => $unpaidInvoices,
                'pendingSalaries' => $pendingSalaries,
                'monthlyProfit' => $monthlyIncome - ($monthlyExpenses + $monthlySalaries)
            ],
            'chartData' => $chartData
        ]);
    }

    public function exportPdf(Request $request)
    {
        $type = $request->get('type', 'expenses');
        $data = [];

        if ($type === 'expenses') {
            $data = Expense::with('category')->get();
        } elseif ($type === 'income') {
            $data = Income::with('client')->get();
        } elseif ($type === 'salaries') {
            $data = Salary::with('user')->get();
        }

        $pdf = Pdf::loadView('exports.finance', [
            'type' => $type,
            'data' => $data,
            'date' => Carbon::now()->format('d/m/Y')
        ]);

        return $pdf->download("export_{$type}_" . date('Y-m-d') . ".pdf");
    }

    public function exportExcel(Request $request)
    {
        $type = $request->get('type', 'expenses');
        $fileName = "export_{$type}_" . date('Y-m-d') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($type) {
            $file = fopen('php://output', 'w');
            
            if ($type === 'expenses') {
                fputcsv($file, ['Titre', 'Catégorie', 'Montant', 'Date', 'Méthode', 'Notes']);
                foreach (Expense::with('category')->get() as $item) {
                    fputcsv($file, [$item->title, $item->category->name ?? 'N/A', $item->amount, $item->date->format('d/m/Y'), $item->payment_method, $item->notes]);
                }
            } elseif ($type === 'income') {
                fputcsv($file, ['Client', 'Projet', 'Montant Payé', 'Reste', 'Statut', 'Date']);
                foreach (Income::with('client', 'project')->get() as $item) {
                    fputcsv($file, [$item->client->name, $item->project->name ?? 'N/A', $item->paid_amount, $item->remaining_amount, $item->status, $item->payment_date ? $item->payment_date->format('d/m/Y') : 'N/A']);
                }
            } elseif ($type === 'salaries') {
                fputcsv($file, ['Membre', 'Type', 'Base', 'Avances', 'Déductions', 'Final', 'Date']);
                foreach (Salary::with('user')->get() as $item) {
                    fputcsv($file, [$item->user->name, $item->type, $item->base_salary, $item->advances, $item->deductions, $item->final_paid, $item->payment_date->format('d/m/Y')]);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
