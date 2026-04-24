<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        @page {
            margin: 0cm 0cm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #1a202c;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }
        /* Top Decorative Shape */
        .header-bg {
            position: absolute;
            top: 0;
            right: 0;
            width: 45%;
            height: 250px;
            background: linear-gradient(135deg, #1F2BF3 0%, #00D8C0 100%);
            z-index: -1;
            border-bottom-left-radius: 100%;
            opacity: 0.1;
        }
        .header-stripe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(90deg, #1F2BF3 0%, #00D8C0 100%);
        }
        .content {
            padding: 50px 40px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        .logo {
            max-width: 180px;
            height: auto;
        }
        .document-type {
            text-align: right;
            vertical-align: top;
        }
        .document-type h1 {
            margin: 0;
            font-size: 32pt;
            font-weight: 900;
            color: #1F2BF3;
            letter-spacing: -1px;
            text-transform: uppercase;
        }
        .document-type p {
            margin: 5px 0 0;
            font-size: 12pt;
            color: #718096;
            font-weight: bold;
        }

        .info-section {
            width: 100%;
            margin-bottom: 40px;
        }
        .info-box {
            width: 48%;
            vertical-align: top;
        }
        .info-label {
            font-size: 8pt;
            text-transform: uppercase;
            font-weight: 900;
            color: #1F2BF3;
            margin-bottom: 8px;
            letter-spacing: 1px;
            border-bottom: 2px solid #edf2f7;
            padding-bottom: 4px;
            display: block;
            width: fit-content;
        }
        .info-content {
            font-size: 10pt;
            color: #2d3748;
        }
        .info-content strong {
            font-size: 11pt;
            color: #1a202c;
        }

        .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            margin-bottom: 30px;
        }
        .details-table th {
            background-color: #f7fafc;
            color: #1F2BF3;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 8pt;
            padding: 12px 15px;
            text-align: left;
            border-bottom: 2px solid #edf2f7;
        }
        .details-table td {
            padding: 15px;
            border-bottom: 1px solid #edf2f7;
            vertical-align: middle;
        }
        .details-table tr:last-child td {
            border-bottom: none;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .totals-section {
            width: 100%;
        }
        .notes-box {
            width: 55%;
            vertical-align: top;
            padding-right: 30px;
        }
        .totals-box {
            width: 45%;
            vertical-align: top;
        }
        .total-table {
            width: 100%;
            border-collapse: collapse;
        }
        .total-row td {
            padding: 8px 0;
            color: #4a5568;
        }
        .total-row.grand-total td {
            padding-top: 15px;
            border-top: 2px solid #1F2BF3;
            color: #1a202c;
            font-weight: 900;
            font-size: 14pt;
        }
        .currency {
            font-size: 10pt;
            color: #718096;
            margin-left: 4px;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 10pt;
            text-transform: uppercase;
            font-weight: 900;
            margin-top: 10px;
        }
        .status-paid { background: #dcfce7; color: #166534; border: 1px solid #bcf0da; }
        .status-unpaid { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .status-partial { background: #fef9c3; color: #854d0e; border: 1px solid #fef08a; }

        .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 30px 40px;
            background-color: #f7fafc;
            border-top: 1px solid #edf2f7;
        }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }
        .footer-col {
            width: 33.33%;
            vertical-align: top;
            font-size: 8pt;
            color: #718096;
        }
        .footer-title {
            font-weight: 900;
            color: #1F2BF3;
            text-transform: uppercase;
            margin-bottom: 5px;
            display: block;
        }
    </style>
</head>
<body>
    <div class="header-stripe"></div>
    <div class="header-bg"></div>

    <div class="content">
        <!-- Header Section -->
        <table class="header-table">
            <tr>
                <td>
                    @php
                        $logoPath = public_path('images/logotechweb.png');
                        $logoData = base64_encode(file_get_contents($logoPath));
                        $logoSrc = 'data:image/png;base64,' . $logoData;
                    @endphp
                    <img src="{{ $logoSrc }}" alt="Techweb Logo" class="logo">
                </td>
                <td class="document-type">
                    <h1>FACTURE</h1>
                    <p>#{{ $invoice->invoice_number }}</p>
                    <div class="status-badge status-{{ $invoice->status }}">
                        {{ $invoice->status == 'paid' ? 'Payée' : ($invoice->status == 'partial' ? 'Partielle' : 'Non Payée') }}
                    </div>
                </td>
            </tr>
        </table>

        <!-- Info Section -->
        <table class="info-section">
            <tr>
                <td class="info-box">
                    <span class="info-label">Facturé à</span>
                    <div class="info-content">
                        <strong>{{ $invoice->client->name }}</strong><br>
                        @if($invoice->client->company_name)
                            {{ $invoice->client->company_name }}<br>
                        @endif
                        @if($invoice->client->address)
                            {{ $invoice->client->address }}<br>
                            {{ $invoice->client->city }}<br>
                        @endif
                        @if($invoice->client->phone)
                            {{ $invoice->client->phone }}<br>
                        @endif
                        {{ $invoice->client->email }}
                    </div>
                </td>
                <td style="width: 4%;"></td>
                <td class="info-box">
                    <span class="info-label">Détails de facturation</span>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Date de facture:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right;">{{ $invoice->date->format('d/m/Y') }}</td>
                        </tr>
                        @if($invoice->due_date)
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Échéance:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right; color: #e53e3e;">{{ $invoice->due_date->format('d/m/Y') }}</td>
                        </tr>
                        @endif
                        @if($invoice->quotation)
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Réf. Devis:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right;">#{{ $invoice->quotation->quotation_number }}</td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>

        <!-- Table Section -->
        <table class="details-table">
            <thead>
                <tr>
                    <th style="width: 50%;">Description des services</th>
                    <th class="text-center" style="width: 10%;">Qté</th>
                    <th class="text-right" style="width: 20%;">Prix Unitaire</th>
                    <th class="text-right" style="width: 20%;">Montant HT</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td>
                        <div style="font-weight: bold; color: #2d3748;">{{ $item->description }}</div>
                    </td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right">{{ number_format($item->unit_price, 2, ',', ' ') }}<span class="currency">DH</span></td>
                    <td class="text-right" style="font-weight: bold;">{{ number_format($item->subtotal, 2, ',', ' ') }}<span class="currency">DH</span></td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Totals Section -->
        <table class="totals-section">
            <tr>
                <td class="notes-box">
                    @if($invoice->notes)
                        <span class="info-label">Notes & Instructions</span>
                        <div style="font-size: 9pt; color: #4a5568; margin-top: 10px;">
                            {{ $invoice->notes }}
                        </div>
                    @else
                        <div style="margin-top: 20px;">
                            <p style="font-size: 9pt; color: #718096; font-style: italic;">
                                Merci pour votre confiance.<br>
                                Veuillez effectuer le règlement avant la date d'échéance.
                            </p>
                        </div>
                    @endif
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f7fafc; border-radius: 8px; border-left: 4px solid #1F2BF3;">
                        <span style="font-size: 8pt; font-weight: 900; color: #1F2BF3; text-transform: uppercase;">Méthodes de Paiement</span>
                        <p style="font-size: 8pt; color: #4a5568; margin: 5px 0 0;">
                            Virement Bancaire / Versement<br>
                            <strong>Banque:</strong> CIH Bank<br>
                            <strong>RIB:</strong> 230 450 1234567890 123456 78
                        </p>
                    </div>
                </td>
                <td class="totals-box">
                    <table class="total-table">
                        <tr class="total-row">
                            <td style="text-align: right; color: #718096;">Total Hors Taxe</td>
                            <td class="text-right" style="font-weight: bold; width: 120px;">{{ number_format($invoice->subtotal, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @if($invoice->tax > 0)
                        <tr class="total-row">
                            <td style="text-align: right; color: #718096;">TVA (20%)</td>
                            <td class="text-right" style="font-weight: bold;">{{ number_format($invoice->tax, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @endif
                        @if($invoice->discount > 0)
                        <tr class="total-row">
                            <td style="text-align: right; color: #e53e3e;">Remise</td>
                            <td class="text-right" style="font-weight: bold; color: #e53e3e;">-{{ number_format($invoice->discount, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @endif
                        <tr class="total-row grand-total">
                            <td style="text-align: right;">TOTAL TTC</td>
                            <td class="text-right">{{ number_format($invoice->total, 2, ',', ' ') }}<span class="currency" style="color: white; opacity: 0.7;">DH</span></td>
                        </tr>
                        @if($invoice->amount_paid > 0)
                        <tr class="total-row">
                            <td style="text-align: right; color: #718096; padding-top: 15px;">Montant Payé</td>
                            <td class="text-right" style="font-weight: bold; color: #38a169; padding-top: 15px;">{{ number_format($invoice->amount_paid, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        <tr class="total-row">
                            <td style="text-align: right; color: #1a202c; font-weight: bold;">Reste à Payer</td>
                            <td class="text-right" style="font-weight: bold; color: #e53e3e; font-size: 12pt;">{{ number_format($invoice->total - $invoice->amount_paid, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @endif
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <table class="footer-table">
            <tr>
                <td class="footer-col">
                    <span class="footer-title">Techweb Agency</span>
                    Digital Solutions & Creative Studio<br>
                    Tanger, Maroc
                </td>
                <td class="footer-col" style="text-align: center;">
                    <span class="footer-title">Contact</span>
                    techweb.ma@gmail.com<br>
                    +212 607 060 769
                </td>
                <td class="footer-col" style="text-align: right;">
                    <span class="footer-title">Légal</span>
                    ICE: 003254189000076<br>
                    IF: 53641285
                </td>
            </tr>
        </table>
        <div style="text-align: center; margin-top: 20px; font-size: 7pt; color: #cbd5e0;">
            © {{ date('Y') }} Techweb. Tous droits réservés.
        </div>
    </div>
</body>
</html>