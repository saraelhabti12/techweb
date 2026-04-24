<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Quotation {{ $quotation->quotation_number }}</title>
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

        .status-stamp {
            position: absolute;
            top: 400px;
            right: 60px;
            width: 120px;
            height: 120px;
            border: 4px double #cbd5e0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-15deg);
            opacity: 0.15;
            z-index: 10;
        }
        .status-stamp span {
            font-size: 14pt;
            font-weight: 900;
            text-transform: uppercase;
            color: #4a5568;
            text-align: center;
        }

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
        .page-number:before {
            content: "Page " counter(page);
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
                    <h1>DEVIS</h1>
                    <p>#{{ $quotation->quotation_number }}</p>
                </td>
            </tr>
        </table>

        <!-- Info Section -->
        <table class="info-section">
            <tr>
                <td class="info-box">
                    <span class="info-label">Client</span>
                    <div class="info-content">
                        <strong>{{ $quotation->client->name }}</strong><br>
                        @if($quotation->client->company_name)
                            {{ $quotation->client->company_name }}<br>
                        @endif
                        @if($quotation->client->address)
                            {{ $quotation->client->address }}<br>
                            {{ $quotation->client->city }}<br>
                        @endif
                        @if($quotation->client->phone)
                            {{ $quotation->client->phone }}<br>
                        @endif
                        {{ $quotation->client->email }}
                    </div>
                </td>
                <td style="width: 4%;"></td>
                <td class="info-box">
                    <span class="info-label">Détails du document</span>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Date d'émission:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right;">{{ $quotation->date->format('d/m/Y') }}</td>
                        </tr>
                        @if($quotation->expiry_date)
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Date d'expiration:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right; color: #e53e3e;">{{ $quotation->expiry_date->format('d/m/Y') }}</td>
                        </tr>
                        @endif
                        <tr>
                            <td style="padding: 2px 0; font-size: 9pt; color: #718096;">Statut:</td>
                            <td style="padding: 2px 0; font-size: 9pt; font-weight: bold; text-align: right; text-transform: uppercase; color: #1F2BF3;">{{ $quotation->status }}</td>
                        </tr>
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
                @foreach($quotation->items as $item)
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
                    @if($quotation->notes)
                        <span class="info-label">Notes & Conditions</span>
                        <div style="font-size: 9pt; color: #4a5568; margin-top: 10px;">
                            {{ $quotation->notes }}
                        </div>
                    @else
                        <div style="margin-top: 20px;">
                            <p style="font-size: 9pt; color: #718096; font-style: italic;">
                                Merci d'avoir choisi Techweb pour votre projet.<br>
                                Ce devis est valable pendant 30 jours.
                            </p>
                        </div>
                    @endif
                </td>
                <td class="totals-box">
                    <table class="total-table">
                        <tr class="total-row">
                            <td style="text-align: right; color: #718096;">Total Hors Taxe</td>
                            <td class="text-right" style="font-weight: bold; width: 120px;">{{ number_format($quotation->subtotal, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @if($quotation->tax > 0)
                        <tr class="total-row">
                            <td style="text-align: right; color: #718096;">TVA (20%)</td>
                            <td class="text-right" style="font-weight: bold;">{{ number_format($quotation->tax, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @endif
                        @if($quotation->discount > 0)
                        <tr class="total-row">
                            <td style="text-align: right; color: #e53e3e;">Remise</td>
                            <td class="text-right" style="font-weight: bold; color: #e53e3e;">-{{ number_format($quotation->discount, 2, ',', ' ') }}<span class="currency">DH</span></td>
                        </tr>
                        @endif
                        <tr class="total-row grand-total">
                            <td style="text-align: right;">TOTAL TTC</td>
                            <td class="text-right">{{ number_format($quotation->total, 2, ',', ' ') }}<span class="currency" style="color: white; opacity: 0.7;">DH</span></td>
                        </tr>
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