@extends('emails.layout', [
    'title' => 'Nouveau Rendez-vous Demandé',
    'subtitle' => 'Une demande de rendez-vous a été soumise',
    'actionUrl' => url('/admin/appointments'),
    'actionText' => 'Voir les Rendez-vous'
])

@section('content')
    <span class="section-title">Détails du Rendez-vous</span>
    <div class="info-card">
        <table class="info-table">
            <tr>
                <td class="label">Client</td>
                <td class="value">{{ $appointment->client->name }}</td>
            </tr>
            <tr>
                <td class="label">Demandé Par</td>
                <td class="value">{{ $appointment->user->name }}</td>
            </tr>
            <tr>
                <td class="label">Date Prévue</td>
                <td class="value" style="color: #1F2BF3;">{{ $appointment->appointment_date }}</td>
            </tr>
        </table>
    </div>

    <span class="section-title">Notes Additionnelles</span>
    <div class="message-box">
        {{ $appointment->notes ?? 'Aucune note fournie.' }}
    </div>

    <div style="margin-top: 20px; padding: 20px; background-color: #f0f9ff; border-radius: 16px; border: 1px dashed #1F2BF3; text-align: center;">
        <p style="margin: 0; color: #0369a1; font-size: 14px; font-weight: 600;">
            Veuillez confirmer ou replanifier ce rendez-vous depuis votre interface d'administration.
        </p>
    </div>
@endsection
