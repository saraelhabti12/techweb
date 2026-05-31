@extends('emails.layout', [
    'title' => 'Réponse de TechWeb',
    'subtitle' => 'Nous avons répondu à votre message',
])

@section('content')
    <span class="section-title">Message de l'équipe TechWeb</span>
    <div class="message-box">
        {!! nl2br(e($body)) !!}
    </div>

    <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
        Si vous avez d'autres questions, n'hésitez pas à répondre directement à cet e-mail.
    </p>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
        <p style="margin: 0; color: #0f172a; font-size: 14px; font-weight: 700;">Cordialement,</p>
        <p style="margin: 4px 0 0; color: #1F2BF3; font-size: 16px; font-weight: 800;">L'équipe TechWeb</p>
    </div>
@endsection
