@extends('emails.layout', [
    'title' => 'Nouveau message de projet',
    'subtitle' => 'Un nouveau projet a été soumis via TechWeb',
    'actionUrl' => route('admin.customers.show', $contact->id),
    'actionText' => 'Voir les détails dans le Dashboard'
])

@section('content')
    <span class="section-title">Informations du Client</span>
    <div class="info-card">
        <table class="info-table">
            <tr>
                <td class="label">Nom Complet</td>
                <td class="value">{{ $contact->full_name }}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td class="value" style="color: #1F2BF3;">{{ $contact->email }}</td>
            </tr>
            <tr>
                <td class="label">Contact</td>
                <td class="value">{{ $contact->contact_number }}</td>
            </tr>
            <tr>
                <td class="label">Entreprise</td>
                <td class="value">{{ $contact->company_name ?? 'N/A' }}</td>
            </tr>
        </table>
    </div>

    <span class="section-title">Services Demandés</span>
    <div class="info-card" style="border-left-color: #00D8C0;">
        <ul style="margin: 0; padding: 0 0 0 20px; color: #475569; font-size: 15px;">
            @if($contact->services && is_array($contact->services))
                @foreach($contact->services as $service)
                    <li style="margin-bottom: 8px; font-weight: 600;">{{ $service }}</li>
                @endforeach
            @else
                <li>Aucun service spécifique sélectionné.</li>
            @endif
        </ul>
    </div>

    <span class="section-title">Message / Brief du Projet</span>
    <div class="message-box">
        "{{ $contact->message }}"
    </div>

    <div style="margin-top: 20px; padding: 15px; background-color: #f8fafc; border-radius: 12px; text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 600;">
            Besoin de Créateurs ? <span style="color: {{ $contact->needs_creator ? '#10b981' : '#64748b' }};">{{ $contact->needs_creator ? 'OUI' : 'NON' }}</span>
        </p>
        @if($contact->needs_creator && $contact->selected_creators)
            <p style="margin: 5px 0 0; color: #64748b; font-size: 12px;">
                Nombre de créateurs sélectionnés : <strong>{{ count($contact->selected_creators) }}</strong>
            </p>
        @endif
    </div>
@endsection
