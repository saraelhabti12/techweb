<!DOCTYPE html>
<html>
<head>
    <title>Export Finance - {{ ucfirst($type) }}</title>
    <style>
        body { font-family: sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { text-align: center; margin-bottom: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rapport de {{ ucfirst($type) }}</h1>
        <p>Date: {{ $date }}</p>
    </div>

    <table>
        <thead>
            @if($type === 'expenses')
                <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Méthode</th>
                </tr>
            @elseif($type === 'income')
                <tr>
                    <th>Client</th>
                    <th>Projet</th>
                    <th>Montant Payé</th>
                    <th>Statut</th>
                    <th>Date</th>
                </tr>
            @elseif($type === 'salaries')
                <tr>
                    <th>Membre</th>
                    <th>Type</th>
                    <th>Montant Final</th>
                    <th>Date</th>
                </tr>
            @endif
        </thead>
        <tbody>
            @foreach($data as $item)
                @if($type === 'expenses')
                    <tr>
                        <td>{{ $item->title }}</td>
                        <td>{{ $item->category->name ?? 'N/A' }}</td>
                        <td>{{ number_format($item->amount, 2) }} DH</td>
                        <td>{{ $item->date->format('d/m/Y') }}</td>
                        <td>{{ $item->payment_method }}</td>
                    </tr>
                @elseif($type === 'income')
                    <tr>
                        <td>{{ $item->client->name }}</td>
                        <td>{{ $item->project->name ?? 'N/A' }}</td>
                        <td>{{ number_format($item->paid_amount, 2) }} DH</td>
                        <td>{{ $item->status }}</td>
                        <td>{{ $item->payment_date ? $item->payment_date->format('d/m/Y') : 'N/A' }}</td>
                    </tr>
                @elseif($type === 'salaries')
                    <tr>
                        <td>{{ $item->user->name }}</td>
                        <td>{{ $item->type }}</td>
                        <td>{{ number_format($item->final_paid, 2) }} DH</td>
                        <td>{{ $item->payment_date->format('d/m/Y') }}</td>
                    </tr>
                @endif
            @endforeach
        </tbody>
    </table>
</body>
</html>
