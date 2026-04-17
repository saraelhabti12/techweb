<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #333;
            line-height: 1.5;
        }
        .invoice-box {
            max-width: 800px;
            margin: auto;
            padding: 30px;
            font-size: 16px;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .company-info {
            float: left;
        }
        .invoice-info {
            float: right;
            text-align: right;
        }
        .clear {
            clear: both;
        }
        .billing-info {
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .billing-to {
            float: left;
            width: 50%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        table th {
            background: #f9fafb;
            border-bottom: 1px solid #eee;
            padding: 12px;
            text-align: left;
        }
        table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
        }
        .totals {
            float: right;
            width: 300px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .grand-total {
            font-weight: bold;
            font-size: 1.2em;
            border-top: 2px solid #eee;
            margin-top: 10px;
            padding-top: 10px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 0.8em;
            text-transform: uppercase;
            font-weight: bold;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-unpaid { background: #fee2e2; color: #991b1b; }
        .status-partial { background: #fef9c3; color: #854d0e; }
        .status-late { background: #ffedd5; color: #9a3412; }
        
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 0.8em;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="invoice-header">
            <div class="company-info">
                <h1>{{ config('app.name') }}</h1>
                <p>
                    123 Business Avenue<br>
                    City, State, ZIP<br>
                    Email:  techweb.ma@gmail.com<br>
                    Phone:  +212 607 060 769
                </p>
            </div>
            <div class="invoice-info">
                <h2>INVOICE</h2>
                <p>
                    <strong>Number:</strong> {{ $invoice->invoice_number }}<br>
                    <strong>Date:</strong> {{ $invoice->date->format('M d, Y') }}<br>
                    @if($invoice->due_date)
                        <strong>Due Date:</strong> {{ $invoice->due_date->format('M d, Y') }}<br>
                    @endif
                    <strong>Status:</strong> <span class="status-badge status-{{ $invoice->status }}">{{ $invoice->status }}</span>
                </p>
            </div>
            <div class="clear"></div>
        </div>

        <div class="billing-info">
            <div class="billing-to">
                <h3>Bill To:</h3>
                <p>
                    <strong>{{ $invoice->client->name }}</strong><br>
                    @if($invoice->client->company_name)
                        {{ $invoice->client->company_name }}<br>
                    @endif
                    @if($invoice->client->address)
                        {{ $invoice->client->address }}<br>
                    @endif
                    @if($invoice->client->city)
                        {{ $invoice->client->city }}<br>
                    @endif
                    @if($invoice->client->phone)
                        Phone: {{ $invoice->client->phone }}<br>
                    @endif
                    Email: {{ $invoice->client->email }}
                </p>
            </div>
            <div class="clear"></div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: center;">Quantity</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td style="text-align: center;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->unit_price, 2) }} DH</td>
                    <td style="text-align: right;">{{ number_format($item->subtotal, 2) }} DH</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="totals">
            <div style="width: 100%;">
                <table style="margin-bottom: 0;">
                    <tr>
                        <td style="border: none; text-align: right;">Subtotal:</td>
                        <td style="border: none; text-align: right; width: 120px;">{{ number_format($invoice->subtotal, 2) }} DH</td>
                    </tr>
                    @if($invoice->tax > 0)
                    <tr>
                        <td style="border: none; text-align: right;">Tax:</td>
                        <td style="border: none; text-align: right;">{{ number_format($invoice->tax, 2) }} DH</td>
                    </tr>
                    @endif
                    @if($invoice->discount > 0)
                    <tr>
                        <td style="border: none; text-align: right;">Discount:</td>
                        <td style="border: none; text-align: right;">-{{ number_format($invoice->discount, 2) }} DH</td>
                    </tr>
                    @endif
                    <tr class="grand-total">
                        <td style="border: none; text-align: right;"><strong>Total:</strong></td>
                        <td style="border: none; text-align: right;"><strong>{{ number_format($invoice->total, 2) }} DH</strong></td>
                    </tr>
                    @if($invoice->amount_paid > 0)
                    <tr>
                        <td style="border: none; text-align: right;">Amount Paid:</td>
                        <td style="border: none; text-align: right;">{{ number_format($invoice->amount_paid, 2) }} DH</td>
                    </tr>
                    <tr>
                        <td style="border: none; text-align: right;"><strong>Balance Due:</strong></td>
                        <td style="border: none; text-align: right;"><strong>{{ number_format($invoice->total - $invoice->amount_paid, 2) }} DH</strong></td>
                    </tr>
                    @endif
                </table>
            </div>
        </div>
        <div class="clear"></div>

        @if($invoice->notes)
        <div style="margin-top: 30px;">
            <h4>Notes:</h4>
            <p>{{ $invoice->notes }}</p>
        </div>
        @endif

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>{{ config('techweb') }} &copy; {{ date('Y') }}</p>
        </div>
    </div>
</body>
</html>