@extends('emails.layout', [
    'title' => 'Notification Importante',
    'subtitle' => $notificationData['title'] ?? 'Mise à jour du Système',
    'actionUrl' => url('/admin/dashboard'),
    'actionText' => 'Ouvrir le Dashboard'
])

@section('content')
    <span class="section-title">Message</span>
    <div class="message-box">
        {{ $notificationData['message'] }}
    </div>

    @if(isset($notificationData['type']))
        <div style="margin-top: 10px; text-align: right;">
            <span style="display: inline-block; padding: 4px 12px; background-color: #e2e8f0; color: #475569; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
                Type: {{ $notificationData['type'] }}
            </span>
        </div>
    @endif

    <div style="margin-top: 30px; padding: 15px; background-color: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7;">
        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
            Cette notification nécessite votre attention. Veuillez vous connecter au dashboard pour plus d'informations.
        </p>
    </div>
@endsection
