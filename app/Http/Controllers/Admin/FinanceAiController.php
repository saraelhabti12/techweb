<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Quotation;
use App\Models\Payment;
use App\Models\Salary;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class FinanceAiController extends Controller
{
    public function analyze()
    {
        Log::info('AI Financial Analysis started');

        $apiKey = config('services.gemini.api_key');
        if (!$apiKey) {
            Log::error('Gemini API key missing in configuration');
            return response()->json([
                'error' => 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env file.'
            ], 500);
        }

        try {
            $now = Carbon::now();
            $startOfMonth = $now->copy()->startOfMonth();
            $endOfMonth = $now->copy()->endOfMonth();

            // 1. Invoices stats
            $totalInvoicesCount = Invoice::count();
            $invoicesTotal = Invoice::sum('total');
            $invoicesPaid = Invoice::sum('amount_paid');
            $invoicesUnpaid = $invoicesTotal - $invoicesPaid;
            
            $invoicesByStatus = Invoice::selectRaw('status, count(*) as count, sum(total) as total')
                ->groupBy('status')
                ->get()
                ->toArray();

            $unpaidInvoicesList = Invoice::with('client')
                ->where('status', '!=', 'paid')
                ->orderBy('due_date', 'asc')
                ->limit(10)
                ->get()
                ->map(fn($inv) => [
                    'number' => $inv->invoice_number,
                    'client' => $inv->client?->name ?? 'Unknown',
                    'total' => $inv->total,
                    'remaining' => $inv->total - $inv->amount_paid,
                    'due_date' => $inv->due_date?->format('Y-m-d'),
                    'days_overdue' => $inv->due_date && $inv->due_date->isPast() ? $inv->due_date->diffInDays($now) : 0
                ])
                ->toArray();

            // 2. Quotations stats
            $quotationsCount = Quotation::count();
            $quotationsTotal = Quotation::sum('total');
            $quotationsByStatus = Quotation::selectRaw('status, count(*) as count, sum(total) as total')
                ->groupBy('status')
                ->get()
                ->toArray();

            // 3. Payments stats
            $paymentsReceivedTotal = Payment::sum('amount');
            $paymentsThisMonth = Payment::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('amount');
            $recentPayments = Payment::orderBy('payment_date', 'desc')
                ->limit(10)
                ->get()
                ->map(fn($pay) => [
                    'amount' => $pay->amount,
                    'date' => $pay->payment_date?->format('Y-m-d'),
                    'method' => $pay->payment_method
                ])
                ->toArray();

            // 4. Salaries stats
            $salariesPaidTotal = Salary::sum('final_paid');
            $salariesThisMonth = Salary::whereBetween('payment_date', [$startOfMonth, $endOfMonth])->sum('final_paid');

            // 5. Expenses stats
            $expensesTotal = Expense::sum('amount');
            $expensesThisMonth = Expense::whereBetween('date', [$startOfMonth, $endOfMonth])->sum('amount');
            
            $expensesByCategory = Expense::join('expense_categories', 'expenses.category_id', '=', 'expense_categories.id')
                ->selectRaw('expense_categories.name as category, sum(expenses.amount) as total')
                ->groupBy('expense_categories.name')
                ->get()
                ->toArray();

            $financialData = [
                'meta' => [
                    'currency' => 'MAD',
                    'current_date' => $now->format('Y-m-d'),
                    'current_month' => $now->format('F Y')
                ],
                'invoices' => [
                    'total_count' => $totalInvoicesCount,
                    'total_value' => $invoicesTotal,
                    'paid_value' => $invoicesPaid,
                    'unpaid_value' => $invoicesUnpaid,
                    'by_status' => $invoicesByStatus,
                    'overdue_list' => $unpaidInvoicesList
                ],
                'quotations' => [
                    'total_count' => $quotationsCount,
                    'total_value' => $quotationsTotal,
                    'by_status' => $quotationsByStatus
                ],
                'cash_movements_current_month' => [
                    'income_received' => $paymentsThisMonth,
                    'expenses_paid' => $expensesThisMonth,
                    'salaries_paid' => $salariesThisMonth,
                    'net_profit' => $paymentsThisMonth - ($expensesThisMonth + $salariesThisMonth)
                ],
                'historical_totals' => [
                    'payments_received' => $paymentsReceivedTotal,
                    'salaries_paid' => $salariesPaidTotal,
                    'expenses_paid' => $expensesTotal
                ],
                'expenses_by_category' => $expensesByCategory,
                'recent_payments' => $recentPayments
            ];

            $prompt = "As an expert financial AI Advisor specializing in corporate and agency finance, analyze the following financial dataset for the agency and generate a comprehensive diagnostic report.
            
            Financial Dataset:
            " . json_encode($financialData, JSON_PRETTY_PRINT) . "
            
            Please provide the analysis in the following JSON format ONLY:
            {
                \"monthly_cashflow_summary\": \"A high-level 3-4 sentence evaluation of the current month's cashflow, profit margins, and overall stability.\",
                \"unpaid_invoices_alerts\": [
                    {\"invoice_number\": \"INV-XXX\", \"client\": \"Client Name\", \"amount\": 1000, \"days_overdue\": 5, \"action_item\": \"Short recommendation for recovery\"}
                ],
                \"top_spending_categories\": [
                    {\"category\": \"Category Name\", \"total\": 5000, \"percentage_of_total\": 35.5, \"recommendation\": \"Advice on optimization\"}
                ],
                \"predicted_monthly_profit\": {
                    \"amount\": 12500.50,
                    \"confidence_level\": \"High\" | \"Medium\" | \"Low\",
                    \"rationale\": \"Brief rationale for the prediction based on upcoming due invoices, pending quotations, and recurring overheads.\"
                },
                \"payment_risk_alerts\": [
                    {\"level\": \"Critical\" | \"Warning\" | \"Low\", \"title\": \"Alert title\", \"description\": \"Detailed explanation of the risk vector\"}
                ],
                \"financial_recommendations\": [
                    \"Specific operational action to optimize cash flow\",
                    \"Recommendation on cost reductions or budget controls\",
                    \"Insight on revenue collection or project pricing optimization\"
                ]
            }";

            Log::info('Sending request to Gemini API');

            $response = Http::timeout(30)
                ->withoutVerifying()
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]);

            if (!$response->successful()) {
                Log::error('Gemini API failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Gemini API request failed',
                    'details' => $response->json()['error']['message'] ?? 'Unknown error from AI service.'
                ], 500);
            }

            $result = $response->json();
            $aiText = $result['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$aiText) {
                Log::error('Invalid response structure from Gemini', ['response' => $result]);
                return response()->json([
                    'error' => 'Invalid response from AI service structure.',
                    'details' => json_encode($result)
                ], 500);
            }

            $cleanJson = preg_replace('/^```json\s*|\s*```$/i', '', trim($aiText));
            $aiData = json_decode($cleanJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to decode AI JSON', ['raw_text' => $aiText, 'error' => json_last_error_msg()]);
                return response()->json([
                    'error' => 'AI returned malformed data.',
                    'details' => $aiText
                ], 500);
            }

            return response()->json([
                'success' => true,
                'analysis' => $aiData,
                'data' => $financialData
            ]);

        } catch (\Exception $e) {
            Log::error('AI Financial Analysis Exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'An internal error occurred during financial analysis.',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}
