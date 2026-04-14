<x-mail::message>
# Important Update: {{ $notificationData['title'] }}

{{ $notificationData['message'] }}

<x-mail::button :url="url('/admin/dashboard')">
Open Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
