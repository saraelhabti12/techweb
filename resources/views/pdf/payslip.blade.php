<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Salary - {{ $salary->payment_date->format('M Y') }}</title>
    <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #4f46e5; }
        .section { margin-bottom: 20px; }
        .section-title { font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .label { color: #666; }
        .value { font-weight: 500; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { text-align: left; padding: 10px; border-bottom: 1px solid #eee; }
        .table th { background-color: #f9fafb; color: #666; }
        .total-row { font-weight: bold; background-color: #f3f4f6; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PAYSLIP</h1>
            <p>{{ config('app.name') }}</p>
        </div>

        <div class="section">
            <div class="section-title">Employee Information</div>
            <table class="table">
                <tr>
                    <td><span class="label">Name:</span> {{ $user->name }}</td>
                    <td><span class="label">Email:</span> {{ $user->email }}</td>
                </tr>
                <tr>
                    <td><span class="label">Date:</span> {{ $salary->payment_date->format('d M Y') }}</td>
                    <td><span class="label">Payment Type:</span> {{ ucfirst($salary->type) }}</td>
                </tr>
            </table>
        </div>

        <div class="section">
            <div class="section-title">Salary Details</div>
            <table class="table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Base Salary</td>
                        <td style="text-align: right;">{{ number_format($salary->base_salary, 2) }} DH</td>
                    </tr>
                    @if($salary->bonuses > 0)
                    <tr>
                        <td>Bonuses</td>
                        <td style="text-align: right;">+{{ number_format($salary->bonuses, 2) }} DH</td>
                    </tr>
                    @endif
                    @if($salary->advances > 0)
                    <tr>
                        <td>Advances</td>
                        <td style="text-align: right;">-{{ number_format($salary->advances, 2) }} DH</td>
                    </tr>
                    @endif
                    @if($salary->deductions > 0)
                    <tr>
                        <td>Deductions</td>
                        <td style="text-align: right;">-{{ number_format($salary->deductions, 2) }} DH</td>
                    </tr>
                    @endif
                </tbody>
                <tfoot>
                    <tr class="total-row">
                        <td>Total Paid</td>
                        <td style="text-align: right;">{{ number_format($salary->final_paid, 2) }} DH</td>
                    </tr>
                </tfoot>
            </table>
        </div>

        @if($salary->notes)
        <div class="section">
            <div class="section-title">Notes</div>
            <p>{{ $salary->notes }}</p>
        </div>
        @endif

        <div class="footer">
            <p>This is a computer-generated document and does not require a signature.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
